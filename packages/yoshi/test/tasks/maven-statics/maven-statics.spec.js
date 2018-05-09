const fs = require('fs');
const path = require('path');
const tempy = require('tempy');
const { expect } = require('chai');
const mavenStatics = require('../../../src/tasks/maven-statics');

const clientProjectName = 'some-client-project';
const staticsDir = 'dist/statics';

const correctPom = fs.readFileSync(
  require.resolve('./fixtures/pom.xml'),
  'utf-8',
);
const noTarGzLocationPom = fs.readFileSync(
  require.resolve('./fixtures/no-tar-gz-location.xml'),
  'utf-8',
);

describe('haste-maven-statics', () => {
  let base;

  beforeEach(async () => {
    base = await tempy.directory();
  });

  describe('with correct pom.xml', () => {
    beforeEach(() => {
      fs.writeFileSync(path.join(base, 'pom.xml'), correctPom);
    });

    it('should create tar.gz.xml based on client project name', async () => {
      const task = mavenStatics({ base, clientProjectName });

      return task.then(() => {
        const pom = fs.readFileSync(
          path.join(base, 'maven/assembly/tar.gz.xml'),
          'utf-8',
        );
        const expected = fs.readFileSync(
          require.resolve('./expected/pom.xml'),
          'utf-8',
        );

        expect(pom).to.equal(expected);
      });
    });

    it('should create tar.gz.xml for universal app, using default directory for statics', async () => {
      const task = mavenStatics({ base, staticsDir });

      return task.then(() => {
        const pom = fs.readFileSync(
          path.join(base, 'maven/assembly/tar.gz.xml'),
          'utf-8',
        );
        const expected = fs.readFileSync(
          require.resolve('./expected/universal.xml'),
          'utf-8',
        );

        expect(pom).to.equal(expected);
      });
    });
  });

  describe('with pom.xml without tar.gz location', () => {
    beforeEach(() => {
      fs.writeFileSync(path.join(base, 'pom.xml'), noTarGzLocationPom);
    });

    it('should not fail', async () => {
      return mavenStatics({ base, staticsDir });
    });
  });

  describe('without pom.xml', () => {
    it('should not fail', async () => {
      return mavenStatics({ base, staticsDir });
    });
  });
});
