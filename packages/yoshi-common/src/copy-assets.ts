import path from 'path';
import fs from 'fs-extra';
import globby from 'globby';
import { STATICS_DIR, SRC_DIR } from 'yoshi-config/paths';

export async function copyTemplates(cwd = process.cwd()) {
  const files = await globby('**/*.{ejs,vm}', { cwd: path.join(cwd, SRC_DIR) });

  await Promise.all(
    files.map(file => {
      return fs.copy(
        path.join(cwd, SRC_DIR, file),
        path.join(cwd, STATICS_DIR, file),
      );
    }),
  );
}
