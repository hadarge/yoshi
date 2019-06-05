declare module '@wix/wix-run-mode';
declare module '@wix/wix-express-csrf';
declare module '@wix/wix-config-emitter';

declare module '@wix/wix-bootstrap-ng' {

  import WixConfig from '@wix/wix-config';

  export interface BootstrapContext {
    readonly config: WixConfig;
  }
}
