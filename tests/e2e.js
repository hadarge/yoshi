const fs = require('fs');
const path = require('path');
const tempy = require('tempy');
const expect = require('expect');
const execa = require('execa');
const chalk = require('chalk');
const { generateProject } = require('../packages/create-yoshi-app/src/index');

// verbose logs and output
const verbose = process.env.VERBOSE_TESTS;
// A regex pattern to run a focus test on the matched projects types
const focusProjectPattern = process.env.FOCUS_PATTERN;

verbose && console.log(`using ${chalk.yellow('VERBOSE')} mode`);

const stdio = verbose ? 'inherit' : 'pipe';

const projectTypes = fs
  .readdirSync(path.join(__dirname, '../packages/create-yoshi-app/templates'))
  .filter(
    projectType =>
      !focusProjectPattern ? true : projectType.match(focusProjectPattern),
  );

focusProjectPattern &&
  console.log(
    `using the pattern ${chalk.magenta(
      focusProjectPattern,
    )} to filter projects`,
  );

console.log('Running e2e tests for the following projects:\n');
projectTypes.forEach(type => console.log(`> ${chalk.cyan(type)}`));

const testTemplate = mockedAnswers => {
  describe(`${mockedAnswers.projectType}`, () => {
    const tempDir = tempy.directory();

    it(`should create the project`, async () => {
      verbose && console.log(chalk.cyan(tempDir));
      await generateProject(mockedAnswers, tempDir);

      if (fs.readdirSync(tempDir).length === 0) {
        throw new Error(
          `project dir ${tempDir} is empty, project generation failed`,
        );
      }
    });

    it(`should run npm install`, () => {
      console.log('running npm install...');
      execa.shellSync('npm install', {
        cwd: tempDir,
        stdio,
      });
    });

    it(`should run npm test`, () => {
      console.log('running npm test...');
      execa.shellSync('npm test', {
        cwd: tempDir,
        stdio,
      });
    });
  });
};

describe('create-yoshi-app + yoshi e2e tests', () => {
  projectTypes
    .map(projectType => ({
      projectName: `test-${projectType}`,
      authorName: 'rany',
      authorEmail: 'rany@wix.com',
      organization: 'wix',
      projectType: projectType.replace('-typescript', ''),
      transpiler: projectType.endsWith('-typescript') ? 'typescript' : 'babel',
    }))
    .forEach(testTemplate);
});
