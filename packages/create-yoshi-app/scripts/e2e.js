const tempy = require('tempy');
const execa = require('execa');
const chalk = require('chalk');
const expect = require('expect');
const flatMap = require('lodash/flatMap');
const prompts = require('prompts');
const fs = require('fs');

const { createApp, verifyRegistry } = require('../src/index');
const TemplateModel = require('../src/TemplateModel');
const { publishMonorepo } = require('../../../scripts/utils/publishMonorepo');
const { testRegistry } = require('../../../scripts/utils/constants');
const templates = require('../templates');

// verbose logs and output
const verbose = process.env.VERBOSE_TESTS;

// A regex pattern to run a focus test on the matched projects types
const focusProjects = process.env.FOCUS_PROJECTS;

verbose && console.log(`using ${chalk.yellow('VERBOSE')} mode`);

const stdio = verbose ? 'inherit' : 'pipe';

verifyRegistry();

// add `${template}-typescript` to support legacy filter by title
const templatesWithTitles = flatMap(templates, templateDefinition => {
  return [
    { title: templateDefinition.name, ...templateDefinition },
    { title: `${templateDefinition.name}-typescript`, ...templateDefinition },
  ];
});

const filteredTemplates = templatesWithTitles.filter(({ title }) =>
  !focusProjects ? true : focusProjects.split(',').includes(title),
);

if (filteredTemplates.length === 0) {
  console.log(
    chalk.red('Could not find any project for the specified projects:'),
  );
  console.log();
  console.log(chalk.cyan(focusProjects));
  console.log();
  console.log('try to use one for the following:');
  console.log();
  console.log(
    templatesWithTitles.map(p => `> ${chalk.magenta(p.title)}`).join('\n'),
  );
  console.log();
  process.exit(1);
}

console.log('Running e2e tests for the following templates:\n');
filteredTemplates.forEach(({ title }) => console.log(`> ${chalk.cyan(title)}`));

const testTemplate = mockedAnswers => {
  describe(mockedAnswers.getTitle(), () => {
    const testDirectory = `${tempy.directory()}/${mockedAnswers.projectName}`;
    fs.mkdirSync(testDirectory);

    // Important Notice: this test case sets up the environment
    // for the following test cases. So test case execution order is important!
    // If you nest a describe here (and the tests are run by mocha) the test cases
    // in the describe block will run first!
    it('should generate project successfully', async () => {
      prompts.inject(mockedAnswers);
      verbose && console.log(chalk.cyan(testDirectory));

      // This sets the local registry as the NPM registry to use, so templates are installed from local registry
      process.env['npm_config_registry'] = testRegistry;

      await createApp({ workingDir: testDirectory });
    });

    if (mockedAnswers.transpiler === 'typescript') {
      it('should not have errors on typescript strict check', () => {
        console.log('checking strict typescript...');
        execa.shellSync('./node_modules/.bin/tsc --noEmit --strict', {
          cwd: testDirectory,
          stdio,
        });
      });
    }

    it(`should run npm test with no configuration warnings`, () => {
      console.log('running npm test...');
      const { stderr } = execa.shellSync('npm test', {
        cwd: testDirectory,
        stdio,
      });

      expect(stderr).not.toContain('Warning: Invalid configuration object');
    });
  });
};

describe('create-yoshi-app + yoshi e2e tests', () => {
  let cleanup;

  before(() => {
    cleanup = publishMonorepo();
  });

  after(() => cleanup());

  filteredTemplates
    .map(
      templateDefinition =>
        new TemplateModel({
          projectName: `test-${templateDefinition.title}`,
          authorName: 'rany',
          authorEmail: 'rany@wix.com',
          templateDefinition,
          transpiler: templateDefinition.title.endsWith('-typescript')
            ? 'typescript'
            : 'babel',
        }),
    )
    .forEach(testTemplate);
});
