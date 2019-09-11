import path from 'path';
import ejs from 'ejs';
import { TEMPLATES_BUILD_DIR } from 'yoshi-config/paths';

export default async (templateName: string, data: any = {}) => {
  // When running tests, we use the development environment in watch mode
  // and the production environment otherwise.
  const fileName =
    process.env.NODE_ENV === 'development'
      ? `${templateName}.debug.ejs`
      : `${templateName}.prod.ejs`;

  const absolutePath = path.resolve(TEMPLATES_BUILD_DIR, fileName);

  const html: string = await ejs.renderFile(absolutePath, data);

  return html;
};
