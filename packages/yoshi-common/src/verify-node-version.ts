import semver from 'semver';
import { minimumNodeVersion } from './utils/constants';

export default function verifyNodeVersion() {
  if (!semver.satisfies(process.version, `>=v${minimumNodeVersion}`)) {
    console.log(
      `Node version ${process.version} is less than the required version of v${minimumNodeVersion}\n`,
    );
    console.log('Aborting...');

    process.exit(1);
  }
}
