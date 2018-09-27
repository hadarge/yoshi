const path = require('path');
const xmldoc = require('xmldoc');
const { renderTemplate, writeFile, readFile } = require('./utils');

module.exports = async ({
  clientProjectName,
  staticsDir,
  base = process.cwd(),
}) => {
  let templateFilename;
  let templateData = {};

  if (clientProjectName) {
    templateFilename = require.resolve('./templates/nbuild.tar.gz.xml');
    templateData = { 'client-project': clientProjectName };
  } else {
    templateFilename = require.resolve('./templates/tar.gz.xml');
    templateData = { staticsDir };
  }

  const template = renderTemplate(templateFilename, templateData);

  try {
    const pom = await readFile(path.join(base, 'pom.xml'));

    const tarGZLocation = new xmldoc.XmlDocument(pom).valueWithPath(
      'build.plugins.plugin.configuration.descriptors.descriptor',
    );

    await writeFile(path.join(base, tarGZLocation), template);
  } catch (error) {}
};
