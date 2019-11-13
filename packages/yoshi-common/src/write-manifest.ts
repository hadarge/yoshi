import url from 'url';
import path from 'path';
import fs from 'fs-extra';
import { groupBy } from 'lodash';
import { getProjectArtifactVersion } from 'yoshi-helpers/utils';
import webpack from 'webpack';
import { STATICS_DIR } from 'yoshi-config/paths';

export default async function writeManifest(
  config: webpack.Configuration,
  stats: webpack.Stats,
  cwd: string = process.cwd(),
) {
  const assetsJson = stats.compilation.chunkGroups.reduce((acc, chunk) => {
    acc[chunk.name] = [
      // If a chunk shows more than once, append to existing files
      ...(acc[chunk.name] || []),
      // Add files to the list
      ...chunk.chunks.reduce(
        (files: any, child: any) => [
          ...files,
          ...child.files
            // Remove map files
            .filter((file: string) => !file.endsWith('.map'))
            // Remove rtl.min.css files
            .filter((file: string) => !file.endsWith('.rtl.min.css'))
            // Resolve into an absolute path, relatively to publicPath
            .map((file: string) =>
              //@ts-ignore
              url.resolve(config.output.publicPath, file),
            ),
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
      const extension = path.extname(pathname as string);

      return extension ? extension.slice(1) : '';
    });
  });

  // Artifact version on CI
  const artifactVersion = getProjectArtifactVersion();

  // Write file to disc
  await fs.writeJSON(
    path.resolve(
      path.join(cwd, STATICS_DIR),
      `manifest.${artifactVersion}.json`,
    ),
    assetsJson,
    { spaces: 2 },
  );
}
