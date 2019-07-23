import semver from 'semver';

export default function verifyMinimumNodeVersion(requiredVersion: string) {
  if (!semver.satisfies(process.version, `>=v${requiredVersion}`)) {
    console.log(
      `Node version ${process.version} is less than the required version of v${requiredVersion}\n`,
    );
    console.log('Aborting...');

    process.exit(1);
  }
}
