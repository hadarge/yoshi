declare module 'chai';
declare module 'axios';
declare module 'wix-axios-config';
declare module 'wix-run-mode';
declare module 'wix-bootstrap-testkit';
declare module 'wix-config-emitter';
declare module 'i18next-xhr-backend';
declare module '*.scss';
declare module '*.json';
declare module 'enzyme';
declare var browser: any;

interface Window {
  __STATICS_BASE_URL__: string;
  __LOCALE__: string;
  __BASEURL__: string;
}

declare module NodeJS {
  interface Global {
    browser: any;
  }
}
