import { getPaths } from './paths';
import config from './index';

const rootPaths = getPaths(process.cwd());

const rootApp = {
  ...rootPaths,
  ...config,
};

export default rootApp;
