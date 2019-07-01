import { IWixStatic } from '@wix/native-components-infra/dist/src/types/wix-sdk';

declare global {
  interface Window {
    Wix: IWixStatic;
    __STATICS_BASE_URL__: string;
    __BASEURL__: string;
    __LOCALE__: string;
  }
}

export {};
