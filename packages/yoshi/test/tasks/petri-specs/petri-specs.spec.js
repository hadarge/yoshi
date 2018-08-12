const path = require('path');
const fs = require('fs-extra');
const { expect } = require('chai');
const tempy = require('tempy');
const petriSpecsTask = require('../../../src/tasks/petri-specs');

const destFile = 'petri-experiments.json';
const destDir = path.join('dist', 'statics');

const writeFsObject = (tempDir, fsObj) => {
  for (const filePath in fsObj) {
    if (fsObj[filePath]) {
      fs.outputFileSync(path.join(tempDir, filePath), fsObj[filePath]);
    }
  }
};

const pomPath = require.resolve('./fixtures/pom.xml');

describe('haste-task-wix-petri-specs', () => {
  it('should create petri-experiments.json file inside destination directory', async () => {
    const tempDir = tempy.directory();

    const fsObj = {
      'package.json': '',
      'pom.xml': fs.readFileSync(pomPath),
      'petri-specs/specs.infra.Dummy.json': fs.readFileSync(
        require.resolve('./fixtures/specs.infra.Dummy'),
      ),
    };

    writeFsObject(tempDir, fsObj);

    await petriSpecsTask({
      base: tempDir,
      destDir,
      config: {
        pom: pomPath,
      },
    });

    const staticDirContent = fs.readdirSync(path.join(tempDir, destDir));
    expect(staticDirContent).to.contain(destFile);
  });

  it('should create petri-experiments.json from translation keys with config', async () => {
    const tempDir = tempy.directory();

    const fsObj = {
      'package.json': '',
      'pom.xml': fs.readFileSync(pomPath),
      'src/assets/messages_en.json': fs.readFileSync(
        require.resolve('./fixtures/messages-en'),
      ),
    };

    writeFsObject(tempDir, fsObj);

    await petriSpecsTask({
      base: tempDir,
      destDir,
      config: {
        scopes: ['alt-scope', 'alt-scope2'],
        onlyForLoggedInUsers: false,
        pom: pomPath,
      },
    });

    const staticDirContent = fs.readdirSync(path.join(tempDir, destDir));
    expect(staticDirContent).to.contain(destFile);

    const petriExperimentsJson = fs.readJsonSync(
      path.join(tempDir, destDir, destFile),
    );
    expect(petriExperimentsJson).to.eql(
      fs.readJsonSync(require.resolve('./fixtures/petri-experiments'), 'utf8'),
    );
  });
});
