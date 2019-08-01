// eslint-disable-next-line import/no-extraneous-dependencies
import { LaunchOptions } from 'puppeteer';
import { InitialOptions } from '@jest/types/build/Config';

type BootstrapSetupOptions = {
  globalObject: any;
  getPort: () => number;
  staticsUrl: string;
  appConfDir: string;
  appLogDir: string;
  appPersistentDir: string;
};

type BootstrapTeardownOptions = {
  globalObject: any;
};

type BootstrapOptions = {
  setup?: (options: BootstrapSetupOptions) => Promise<any>;
  teardown?: (options: BootstrapTeardownOptions) => Promise<any>;
};

type WhitelistedProjectOptions = Pick<InitialOptions, 'globals'>;

type WhitelistedGlobalOptions = Pick<
  InitialOptions,
  | 'collectCoverage'
  | 'collectCoverageFrom'
  | 'coverageReporters'
  | 'coverageDirectory'
  | 'coveragePathIgnorePatterns'
  | 'coverageThreshold'
>;

export type Config = Partial<WhitelistedGlobalOptions> & {
  puppeteer?: LaunchOptions;
  bootstrap?: BootstrapOptions;
  server?: {
    command: string;
    port: number;
  };
  specOptions?: WhitelistedProjectOptions;
  e2eOptions?: WhitelistedProjectOptions;
};
