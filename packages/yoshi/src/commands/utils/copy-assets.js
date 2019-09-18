const path = require('path');
const fs = require('fs-extra');
const globby = require('globby');
const rootApp = require('yoshi-config/root-app');
const chokidar = require('chokidar');

async function copyTemplates(app = rootApp) {
  const files = await globby('**/*.{ejs,vm}', { cwd: app.SRC_DIR });

  await Promise.all(
    files.map(file => {
      return fs.copy(
        path.join(app.SRC_DIR, file),
        path.join(app.STATICS_DIR, file),
      );
    }),
  );
}

function watchPublicFolder(app = rootApp) {
  const watcher = chokidar.watch(app.PUBLIC_DIR, {
    persistent: true,
    ignoreInitial: false,
    cwd: app.PUBLIC_DIR,
  });

  const copyFile = relativePath => {
    return fs.copy(
      path.join(app.PUBLIC_DIR, relativePath),
      path.join(app.ASSETS_DIR, relativePath),
    );
  };

  const removeFile = relativePath => {
    return fs.remove(path.join(app.ASSETS_DIR, relativePath));
  };

  watcher.on('change', copyFile);
  watcher.on('add', copyFile);
  watcher.on('unlink', removeFile);
}

module.exports = {
  watchPublicFolder,
  copyTemplates,
};
