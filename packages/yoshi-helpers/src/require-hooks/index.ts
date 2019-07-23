import config from 'yoshi-config';
import { isTypescriptProject } from '../queries';

export const setupRequireHooks = () => {
  if (isTypescriptProject()) {
    require('./ts-node-register');
  } else if (config.transpileTests) {
    require('./babel-register');
  }
};
