import path from 'path';
import ejs from 'ejs';
import rootApp from 'yoshi-config/root-app';

export default async (templateName: string, data: any = {}) => {
  // When running tests, we use the development environment in watch mode
  // and the production environment otherwise.
  const fileName =
    process.env.NODE_ENV === 'development'
      ? `${templateName}.debug.ejs`
      : `${templateName}.prod.ejs`;

  const absolutePath = path.resolve(rootApp.TEMPLATES_BUILD_DIR, fileName);

  const html: string = await ejs.renderFile(absolutePath, data);

  return html;
};
