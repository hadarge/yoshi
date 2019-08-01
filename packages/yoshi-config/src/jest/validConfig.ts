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
  },
  e2eOptions: {
    globals: {},
  },
  collectCoverage: true,
  collectCoverageFrom: ['__tests__'],
  coverageReporters: ['json'],
  coverageDirectory: 'bla',
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageThreshold: {},
};

export default validConfig;
