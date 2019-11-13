import importCwd from 'import-cwd';
import { partition } from 'lodash';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Result } from 'npm-package-arg';
import { Config } from 'yoshi-config/build/config';
import loadConfig from 'yoshi-config/loadConfig';

export type Package = {
  name: string;
  location: string;
  private: boolean;
  resolved: Result;
  rootPath: string;
  bin: Record<string, string>;
  scripts: Record<string, string>;
  manifestLocation: string;
  nodeModulesLocation: string;
  binLocation: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  optionalDependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
};

export type PackageGraphNode = {
  name: string;
  location: string;
  version: string;
  externalDependencies: Map<string, Result>;
  localDependencies: Map<string, Result>;
  localDependents: Map<string, Result>;
  pkg: Package;

  // Custom properties
  config: Config;
};

export type PackageGraph = Map<string, PackageGraphNode>;

export type LoadGraphResult = {
  graph: PackageGraph;
  apps: Array<PackageGraphNode>;
  libs: Array<PackageGraphNode>;
};

export default async function loadPackageGraph(): Promise<LoadGraphResult> {
  const { getPackages } = importCwd('@lerna/project') as any;
  const PackageGraph = importCwd('@lerna/package-graph') as any;

  const pkgs: Array<Package> = await getPackages(process.cwd());

  const graph: PackageGraph = new PackageGraph(pkgs);

  graph.forEach((node: any) => {
    node.config = loadConfig({ cwd: node.location });
  });

  const pkgsArray = Array.from(graph.values());

  const [apps, libs] = partition(pkgsArray, node => node.pkg.private);

  return { graph, apps, libs };
}
