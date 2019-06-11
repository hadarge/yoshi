const { editorUrl, viewerUrl } = require('./dev/sites');

module.exports = {
  projectType: 'app',
  liveReload: false,
  hmr: false,
  startUrl: [editorUrl, viewerUrl],
  externals: {
    react: {
      amd: 'react',
      umd: 'react',
      commonjs: 'react',
      commonjs2: 'react',
      root: 'React',
    },
    'react-dom': {
      amd: 'reactDOM',
      umd: 'react-dom',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      root: 'ReactDOM',
    },
  },
  entry: {
    settingsPanel: './settingsPanel/settingsPanel.tsx',
    editorApp: './editorApp/editorApp.tsx',
    viewerWidget: './viewerApp/viewerWidget.tsx',
    viewerScript: './viewerApp/viewerScript.ts',
    'wix-private-mock': '../dev/wix-private.mock.js',
  },
  servers: {
    cdn: {
      ssl: true,
    },
  },
  exports: '[name]',
  umdNamedDefine: false,
  enhancedTpaStyle: true,
};
