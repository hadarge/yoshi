import path from 'path';
import petriSpecs from 'petri-specs';
import { STATICS_DIR } from 'yoshi-config/paths';

export default async function({
  config,
  cwd = process.cwd(),
}: {
  config: any;
  cwd?: string;
}) {
  const directory = path.join(cwd, 'petri-specs');
  const destFile = path.join(cwd, STATICS_DIR, 'petri-experiments.json');

  petriSpecs.build({ directory, json: destFile, base: cwd, ...config });
}
