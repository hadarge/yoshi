import path from 'path';
import arg from 'arg';
import fs from 'fs-extra';
import execa from 'execa';
import wnpm from 'wnpm-ci';
import {
  inTeamCity as checkInTeamCity,
  inPRTeamCity as checkInPRTeamCity,
} from 'yoshi-helpers/queries';
import { cliCommand } from '../bin/yoshi-monorepo';

const inTeamCity = checkInTeamCity();
const inPRTeamCity = checkInPRTeamCity();

const release: cliCommand = async function(argv, rootConfig, { libs }) {
  const args = arg(
    {
      '--minor': Boolean,
    },
    { argv },
  );

  const { '--minor': shouldBumpMinor } = args;

  if (inTeamCity && !inPRTeamCity) {
    // Patch libraries' `package.json` main field to point to `dist`
    await Promise.all(
      libs.map(async lib => {
        const packageJsonPath = path.join(lib.location, 'package.json');
        const json = await fs.readJSON(packageJsonPath);

        // Point to js version of the file in the `dist` directory
        json.main = path.join('dist', json.main.replace('.ts', '.js'));

        fs.writeFileSync(packageJsonPath, JSON.stringify(json, null, 2));
      }),
    );

    await Promise.all(
      libs.map(lib => {
        return wnpm.prepareForRelease({ shouldBumpMinor, cwd: lib.location });
      }),
    );

    // This part is inconsistent with how non-monorepo apps work:
    // Here we publish packages as part of `yoshi release` while in most apps
    // CI does the publishinng
    await Promise.all(
      libs.map(lib => {
        console.log(`Publishing ${lib.name}...`);
        console.log();

        // `npm-ci` is installed globally on CI
        return execa('npx npm-ci publish', { cwd: lib.location, shell: true });
      }),
    );
  }
};

export default release;
