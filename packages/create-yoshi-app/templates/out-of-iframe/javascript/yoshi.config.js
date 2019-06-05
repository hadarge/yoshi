module.exports = {
  projectType: 'app',
  liveReload: false,
  hmr: false,
  startUrl: [
    'https://gileck5.wixsite.com/ooi-dev',
    'https://editor.wix.com/html/editor/web/renderer/edit/b9d9cf23-cb0a-4b45-9a68-480736b6aaf0?metaSiteId=3154eb7d-784e-4056-a1da-4ab36bee981f',
  ],
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
    settingsPanel: './settingsPanel/settingsPanel.js',
    editorApp: './editorApp/editorApp.js',
    viewerApp: './viewerApp/viewerApp.js',
    viewerScript: './viewerApp/viewerScript.js',
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
