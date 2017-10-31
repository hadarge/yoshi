'use strict';

const fs = require('fs-extra');
const path = require('path');
const {expect} = require('chai');
const tempy = require('tempy');
const petriSpecsTask = require('../src/index');
const destFile = 'petri-experiments.json';
const destDir = path.join('dist', 'statics');

const writeFsObject = (tempDir, fsObj) => {
  for (let filePath in fsObj) {
    if (fsObj[filePath]) {
      fs.outputFileSync(path.join(tempDir, filePath), fsObj[filePath]);
    }
  }
};

describe('haste-task-petri-specs', () => {
  it('should create petri-experiments.json file inside destination directory', async () => {
    const tempDir = tempy.directory();

    const fsObj = {
      'package.json': '',
      'pom.xml': fs.readFileSync(require.resolve('./fixtures/pom.xml')),
      'petri-specs/specs.infra.Dummy.json': fs.readFileSync(require.resolve('./fixtures/specs.infra.Dummy'))
    };

    writeFsObject(tempDir, fsObj);

    await petriSpecsTask({
      base: tempDir,
      destDir,
      config: {},
    })();

    const staticDirContent = fs.readdirSync(path.join(tempDir, destDir));
    expect(staticDirContent).to.contain(destFile);
  });

  it('should create petri-experiments.json from translation keys with config', async () => {
    const tempDir = tempy.directory();

    const fsObj = {
      'package.json': '',
      'pom.xml': fs.readFileSync(require.resolve('./fixtures/pom.xml')),
      'src/assets/messages_en.json': fs.readFileSync(require.resolve('./fixtures/messages-en')),
    };

    writeFsObject(tempDir, fsObj);

    await petriSpecsTask({
      base: tempDir,
      destDir,
      config: {
        scopes: ['alt-scope', 'alt-scope2'],
        onlyForLoggedInUsers: false
      },
    })();

    const staticDirContent = fs.readdirSync(path.join(tempDir, destDir));
    expect(staticDirContent).to.contain(destFile);

    const petriExperimentsJson = fs.readJsonSync(path.join(tempDir, destDir, destFile));
    expect(petriExperimentsJson).to.eql(fs.readJsonSync(require.resolve('./fixtures/petri-experiments'), 'utf8'));
  });

  it('should fail with an error when converting deprecated json files', async () => {
    const tempDir = tempy.directory();

    const fsObj = {
      'package.json': '',
      'pom.xml': fs.readFileSync(require.resolve('./fixtures/pom.xml')),
      'petri-specs/specs.infra.Dummy.json': fs.readFileSync(require.resolve('./fixtures/single-scope-spec')),
    };

    writeFsObject(tempDir, fsObj);

    try {
      await petriSpecsTask({
        base: tempDir,
        destDir,
        config: {},
      })();

      throw new Error('TestFailed');
    } catch (err) {
      expect(err.message).to.equal('Error: yoshi-petri detected 1 deprecated specs that got converted. More info: https://github.com/wix-private/petri-specs/docs/CONVERT_SPECS.md');
    }
  });
});
