import fs from 'fs';
import path from 'path';
import globby from 'globby';

export default (absoluteDirPath: string) => {
  const filesPaths = globby.sync(['**/*', '!node_modules'], {
    cwd: absoluteDirPath,
    dot: true,
    gitignore: true,
  });

  const files: Record<string, string> = {};

  filesPaths.forEach(filePath => {
    files[filePath] = fs.readFileSync(
      path.join(absoluteDirPath, filePath),
      'utf-8',
    );
  });

  return files;
};
