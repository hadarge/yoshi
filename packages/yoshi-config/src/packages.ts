import execa from 'execa';
import { partition } from 'lodash';
import { getPaths } from './paths';
import loadConfig from './loadConfig';

function loadPackages() {
  const { stdout } = execa.sync('npx lerna list --all --json', {
    shell: true,
  });

  const pkgs = JSON.parse(stdout).map((pkg: any) => {
    const paths = getPaths(pkg.location);
    const config = loadConfig({ cwd: pkg.location });

    return {
      ...pkg,
      ...paths,
      ...config,
    };
  });

  const [apps, libs] = partition(pkgs, (pkg: any) => pkg.private);

  return {
    apps,
    libs,
  };
}

export default loadPackages();
