import { transform } from './utils';

export = {
  process(source: string, fullFileName: string) {
    return transform(source, fullFileName);
  },
};
