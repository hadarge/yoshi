const path = require('path');
const {parseXml, renderTemplate, writeFile, readFile} = require('./utils');

module.exports = async ({clientProjectName, staticsDir, base = process.cwd()}) => {
  let templateFilename;
  let templateData = {};

  if (clientProjectName) {
    templateFilename = require.resolve('./templates/nbuild.tar.gz.xml');
    templateData = {'client-project': clientProjectName};
  } else {
    templateFilename = require.resolve('./templates/tar.gz.xml');
    templateData = {staticsDir};
  }

  const template = renderTemplate(templateFilename, templateData);

  try {
    const pomFilename = await readFile(path.join(base, 'pom.xml'));
    const pom = await parseXml(pomFilename);
    const tarGZLocation = pom.project.build[0].plugins[0].plugin[0].configuration[0].descriptors[0].descriptor[0];

    await writeFile(path.join(base, tarGZLocation), template);
  } catch (error) {}
};
