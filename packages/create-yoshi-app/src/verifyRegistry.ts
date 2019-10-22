import chalk from 'chalk';
import { isPrivateRegistryReachable } from './utils';

export default function verifyRegistry(workingDir: string) {
  if (!isPrivateRegistryReachable(workingDir)) {
    console.error(
      chalk.red(
        `Wix Private Registry is not reachable, please connect to VPN and try again`,
      ),
    );
    process.exit(1);
  }
}
