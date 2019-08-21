import { Config } from './config';

const validConfig: Required<Config> = {
  puppeteer: {},
  bootstrap: {
    setup: async () => {},
    teardown: async () => {},
  },
  server: {
    command: 'npm run server',
    port: 3000,
  },
  specOptions: {
    globals: {},
    testURL: '',
  },
  e2eOptions: {
    globals: {},
    testURL: '',
  },
  collectCoverage: true,
  collectCoverageFrom: ['__tests__'],
  coverageReporters: ['json'],
  coverageDirectory: 'bla',
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageThreshold: { global: { key: 1 } },
};

export default validConfig;
