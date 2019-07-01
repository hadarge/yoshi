import { LaunchOptions } from 'puppeteer';

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

export type Config = {
  puppeteer?: LaunchOptions;
  bootstrap?: BootstrapOptions;
  server?: {
    command: string;
    port: number;
  };
};
