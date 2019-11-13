import path from 'path';
import fs from 'fs-extra';
import xmldoc from 'xmldoc';
import { POM_FILE } from 'yoshi-config/paths';

const renderTemplate = (
  filename: string,
  data: Record<string, string>,
): string => {
  const template = fs.readFileSync(filename).toString();

  return Object.keys(data).reduce(
    (acc, key) => acc.replace(`{{${key}}}`, data[key]),
    template,
  );
};

export default async function async({
  clientProjectName,
  staticsDir,
  cwd = process.cwd(),
}: {
  clientProjectName?: string;
  staticsDir: string;
  cwd?: string;
}): Promise<void> {
  let templateFilename;
  let templateData;

  if (clientProjectName) {
    templateFilename = path.resolve(__dirname, './templates/nbuild.tar.gz.xml');
    templateData = { 'client-project': clientProjectName };
  } else {
    templateFilename = path.resolve(__dirname, './templates/tar.gz.xml');
    templateData = { staticsDir };
  }

  const template = renderTemplate(templateFilename, templateData);

  try {
    const pom = await fs.readFile(path.join(cwd, POM_FILE), 'utf-8');

    const tarGZLocation = new xmldoc.XmlDocument(pom).valueWithPath(
      'build.plugins.plugin.configuration.descriptors.descriptor',
    );

    await fs.outputFile(path.join(cwd, tarGZLocation as string), template);
  } catch (error) {}
}
