declare module '*.scss';
declare module '*.json';
declare var browser: any;

interface Window {
  __LOCALE__: string;
  __BASEURL__: string;
  __STATICS_BASE_URL__: string;
}

declare module NodeJS {
  interface Global {
    browser: any;
  }
}
