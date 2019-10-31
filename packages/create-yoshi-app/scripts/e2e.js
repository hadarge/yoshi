const tempy = require('tempy');
const execa = require('execa');
const chalk = require('chalk');
const expect = require('expect');
const flatMap = require('lodash/flatMap');
const prompts = require('prompts');
const fs = require('fs');

const { createApp, verifyRegistry } = require('../src/index');
const TemplateModel = require('../src/TemplateModel').default;
const { publishMonorepo } = require('../../../scripts/utils/publishMonorepo');
const { testRegistry } = require('../../../scripts/utils/constants');
const templates = require('../src/templates').default;

// A regex pattern to run a focus test on the matched projects types
const focusProjects = process.env.FOCUS_PROJECTS;

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
      console.log(chalk.cyan(testDirectory));

      // This sets the local registry as the NPM registry to use, so templates are installed from local registry
      process.env['npm_config_registry'] = testRegistry;

      await createApp({ workingDir: testDirectory });
    });

    if (mockedAnswers.language === 'typescript') {
      it('should not have errors on typescript strict check', () => {
        console.log('checking strict typescript...');
        const { all: tscOutput } = execa.sync(
          './node_modules/.bin/tsc --noEmit --strict',
          {
            shell: true,
            cwd: testDirectory,
          },
        );

        console.log(tscOutput);
      });
    }

    it(`should run npm test with no configuration warnings`, () => {
      console.log('running npm test...');

      let result;

      try {
        result = execa.sync('npm test', {
          shell: true,
          cwd: testDirectory,
        });
        console.log(result.all);
      } catch (error) {
        class NpmTestFailureError extends Error {
          constructor(m) {
            super(m);
            this.message = `\n  ${error.message}\n\n  stdout: ${error.stdout}\n  stderr: ${error.stderr}`;
            this.stack = '';
          }
        }

        throw new NpmTestFailureError();
      }

      expect(result.stderr).not.toContain(
        'Warning: Invalid configuration object',
      );
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
          templateDefinition,
          authorName: 'rany',
          authorEmail: 'rany@wix.com',
          language: templateDefinition.title.endsWith('-typescript')
            ? 'typescript'
            : 'javascript',
        }),
    )
    .forEach(testTemplate);
});
