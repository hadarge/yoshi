const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const wnpm = require('wnpm-ci');
const parseArgs = require('minimist');
const { splitPackagesPromise } = require('./utils');
const { inTeamCity: checkInTeamCity } = require('yoshi-helpers/queries');

const cliArgs = parseArgs(process.argv.slice(2));

const shouldBumpMinor = cliArgs.minor;
const inTeamCity = checkInTeamCity();

module.exports = async () => {
  const [, libs] = await splitPackagesPromise;

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
  if (inTeamCity) {
    await Promise.all(
      libs.map(lib => {
        console.log(`Publishing ${lib.name}...`);
        console.log();

        // `npm-ci` is installed globally on CI
        return execa.shell('npx npm-ci publish', { cwd: lib.location });
      }),
    );
  }

  return {
    persistent: false,
  };
};
