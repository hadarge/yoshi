import path from 'path';
import fs from 'fs-extra';
import globby from 'globby';
import chokidar from 'chokidar';
import multimatch from 'multimatch';

export default function copyAssets(
  packagesDir: string,
  packagesList: Array<string>,
  watch: boolean,
) {
  const patterns = packagesList.reduce((acc: Array<string>, pkg: string) => {
    return [...acc, `${pkg}/src/**/*`, `!${pkg}/src/**/*.(ts|tsx|json)`];
  }, []);

  const assets = globby.sync(patterns, {
    onlyFiles: true,
    gitignore: true,
  });

  assets.forEach(copyToBuildDir);

  if (watch) {
    const dirsToIgnore = packagesList.reduce(
      (acc: Array<string>, pkg: string) => {
        return [
          ...acc,
          path.join(pkg, 'node_modules'),
          path.join(pkg, 'build'),
        ];
      },
      [],
    );

    chokidar
      .watch(packagesList, { ignored: dirsToIgnore, ignoreInitial: true })
      .on('all', (event, assetPath) => {
        const matchs = multimatch(assetPath, patterns);

        if (!matchs || !matchs.length) {
          return;
        }

        switch (event) {
          case 'add':
          case 'change':
            copyToBuildDir(assetPath);
            break;

          case 'unlink':
            removeFromBuildDir(assetPath);
            break;
        }
      });
  }

  function copyToBuildDir(assetPath: string) {
    const assetBuildPath = getAssetBuildPath(assetPath);
    fs.removeSync(assetBuildPath);
    fs.copySync(assetPath, assetBuildPath);
  }

  function removeFromBuildDir(assetPath: string) {
    const assetBuildPath = getAssetBuildPath(assetPath);
    fs.removeSync(assetBuildPath);
  }

  function getAssetBuildPath(assetPath: string) {
    const relativePath = path.relative(packagesDir, assetPath);
    const pkgName = relativePath.split(path.sep)[0];
    const pkgSrcPath = path.resolve(packagesDir, pkgName, 'src');
    const pkgBuildPath = path.resolve(packagesDir, pkgName, 'build');
    const relativeToSrcPath = path.relative(pkgSrcPath, assetPath);

    return path.resolve(pkgBuildPath, relativeToSrcPath);
  }
}
