'use strict';

const fs = require('fs-extra');
const path = require('path');
const {expect} = require('chai');
const tempy = require('tempy');
const petriSpecsTask = require('../src/index');
const petriSpecsTestkit = require('petri-specs/test/testkit');
const petriTestUtils = require('petri-specs/test/test-utils'); // eslint-disable-line
const destFile = 'petri-experiments.json';
const staticsDir = 'statics';

const writeFsObject = (tempDir, fsObj) => {
  for (let filePath in fsObj) {
    if (fsObj[filePath]) {
      fs.outputFileSync(path.join(tempDir, filePath), fsObj[filePath]);
    }
  }
};

describe('haste-task-petri-specs', () => {
  it('should create petri-experiments.json file inside statics directory', async () => {
    const tempDir = tempy.directory();

    const fsObj = petriSpecsTestkit.baseFsWith({
      'petri-specs/specs.infra.Dummy.json': JSON.stringify(petriSpecsTestkit.spec('specs.infra.Dummy'))
    });

    writeFsObject(tempDir, fsObj);

    await petriSpecsTask({
      base: tempDir,
      staticsDir,
      config: {},
    })();

    const staticDirContent = fs.readdirSync(path.join(tempDir, staticsDir));
    expect(staticDirContent).to.contain(destFile);
  });

  it.skip('should create petri-experiments.json from translation keys with config', async () => {
    const tempDir = tempy.directory();

    const fsObj = petriSpecsTestkit.baseFsWith({
      'src/assets/messages_en.json': JSON.stringify(petriSpecsTestkit.translationWithSpecs('translation1')),
    });

    writeFsObject(tempDir, fsObj);

    await petriSpecsTask({
      base: tempDir,
      staticsDir,
      config: {
        scopes: ['alt-scope', 'alt-scope2'],
        onlyForLoggedInUsers: false
      },
    })();

    const staticDirContent = fs.readdirSync(path.join(tempDir, staticsDir));
    expect(staticDirContent).to.contain(destFile);

    const petriExperimentsJson = fs.readJsonSync(path.join(tempDir, staticsDir, destFile));
    expect(petriExperimentsJson).to.eql(
      Object.assign({},
        petriSpecsTestkit.translationSpec(
          'specs.abTranslate.alt-scope.translation1',
          petriTestUtils.and({
            scopes: ['alt-scope', 'alt-scope2'],
            onlyForLoggedInUsers: false
          })
        )
      ));
  });

  it('should fail with an error when converting deprecated json files', async () => {
    const tempDir = tempy.directory();

    const fsObj = petriSpecsTestkit.baseFsWith({
      'petri-specs/specs.infra.Dummy.json': JSON.stringify(petriSpecsTestkit.singleScopeSpec('specs.infra.Dummy'))
    });

    writeFsObject(tempDir, fsObj);

    try {
      await petriSpecsTask({
        base: tempDir,
        staticsDir,
        config: {},
      })();

      throw new Error('TestFailed');
    } catch (err) {
      expect(err.message).to.equal('Error: yoshi-petri detected 1 deprecated specs that got converted. More info: https://github.com/wix-private/petri-specs/docs/CONVERT_SPECS.md');
    }
  });
});
