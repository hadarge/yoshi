interface Window {
  __LOCALE__: string;
  __BASEURL__: string;
}

// tslint:disable-next-line:no-namespace
declare namespace Express {
  interface Request {
    aspects: any;
  }
}

declare module 'yoshi-template-intro';
declare module '@wix/wix-express-require-https';
declare module '@wix/wix-express-csrf';
