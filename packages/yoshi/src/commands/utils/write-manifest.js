const url = require('url');
const path = require('path');
const fs = require('fs-extra');
const { groupBy } = require('lodash');
const { getProjectArtifactVersion } = require('yoshi-helpers/utils');
const rootApp = require('yoshi-config/root-app');

module.exports = async function writeManifest(config, stats, app = rootApp) {
  const assetsJson = stats.compilation.chunkGroups.reduce((acc, chunk) => {
    acc[chunk.name] = [
      // If a chunk shows more than once, append to existing files
      ...(acc[chunk.name] || []),
      // Add files to the list
      ...chunk.chunks.reduce(
        (files, child) => [
          ...files,
          ...child.files
            // Remove map files
            .filter(file => !file.endsWith('.map'))
            // Remove rtl.min.css files
            .filter(file => !file.endsWith('.rtl.min.css'))
            // Resolve into an absolute path, relatively to publicPath
            .map(file => url.resolve(config.output.publicPath, file)),
        ],
        [],
      ),
    ];
    return acc;
  }, {});

  // Group extensions together
  Object.keys(assetsJson).forEach(entryName => {
    assetsJson[entryName] = groupBy(assetsJson[entryName], fileUrl => {
      const { pathname } = url.parse(fileUrl);
      const extension = path.extname(pathname);

      return extension ? extension.slice(1) : '';
    });
  });

  // Artifact version on CI
  const artifactVersion = getProjectArtifactVersion();

  // Write file to disc
  await fs.writeJSON(
    path.resolve(app.STATICS_DIR, `manifest.${artifactVersion}.json`),
    assetsJson,
    { spaces: 2 },
  );
};
