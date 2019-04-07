import * as fakeTpaResponse from './fake-tpa-response.json';

if (window.Wix && window.Wix.Utils.getViewMode() === 'standalone') {
  window.Wix = new class WixMock {
    modelCache = {};
    siteColors;
    siteTextPresets;
    styleParams;

    constructor() {
      this.siteColors = fakeTpaResponse.res.siteColors;
      this.siteTextPresets = fakeTpaResponse.res.siteTextPresets;
      this.styleParams = fakeTpaResponse.res.style;
    }

    getComponentInfo() {
      return 'componentInfo';
    }

    getSiteInfo(cb) {
      cb({
        url: 'https://wix.com/my-site',
        baseUrl: 'https://wix.com/',
      });
    }

    Utils = {
      getViewMode() {
        return 'standalone';
      },
      getCompId() {
        return 'compId';
      },
      getLocale() {
        return 'en';
      },
      getDeviceType() {
        return 'desktop';
      },
      getInstanceValue() {
        return '';
      },
    };

    Styles = {
      getSiteColors: cb => cb(this.siteColors),
      getSiteTextPresets: cb => cb(this.siteTextPresets),
      getStyleParams: cb => cb(this.styleParams),
      getStyleId: cb => cb('style-jp8ide5x'),
    };
  }();
}
