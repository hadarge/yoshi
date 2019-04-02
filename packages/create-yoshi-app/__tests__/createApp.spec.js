const tempy = require('tempy');
const createApp = require('../src/createApp');
const execa = require('execa');
const TemplateModel = require('../src/TemplateModel');
const path = require('path');
const { gitInit } = require('../src/utils');
const fs = require('fs-extra');

jest.mock('../src/runPrompt');
jest.mock('../src/verifyRegistry');
jest.mock('../src/utils', () => ({
  ...require.requireActual('../src/utils'),
  install: jest.fn(),
  lintFix: jest.fn(),
  clearConsole: jest.fn(),
}));

const consoleLog = console.log;

beforeEach(() => {
  // mock console.log to reduce noise from the tests
  console.log = jest.fn();
});

afterEach(() => {
  console.log = consoleLog;
});

test('it should generate a git repo', async () => {
  const tempDir = tempy.directory();
  require('../src/runPrompt').mockReturnValue(minimalTemplateAnswers());
  require('../src/verifyRegistry').mockReturnValue(undefined);
  await createApp({ workingDir: tempDir });

  expect(() => {
    console.log('Checking git status...');
    execa.shellSync('git status', {
      cwd: tempDir,
    });
  }).not.toThrow();
});

test('it should not create a git repo if the target directory is contained in a git repo', async () => {
  require('../src/runPrompt').mockReturnValue(minimalTemplateAnswers());
  require('../src/verifyRegistry').mockReturnValue(undefined);

  const tempDir = tempy.directory();
  const projectDir = path.join(tempDir, 'project');

  gitInit(tempDir);
  fs.ensureDirSync(projectDir);
  await createApp({ workingDir: projectDir });

  expect(() => fs.statSync(path.join(projectDir, '.git'))).toThrow();
});

test('it uses answers from a file', async () => {
  const answersFile = tempy.file();
  fs.outputFileSync(answersFile, JSON.stringify(minimalTemplateAnswers()));

  const tempDir = tempy.directory();
  const projectDir = path.join(tempDir, 'project');

  gitInit(tempDir);
  fs.ensureDirSync(projectDir);

  await createApp({ workingDir: projectDir, answersFile });

  const packageJson = fs.readJSONSync(
    path.join(tempDir, 'project', 'package.json'),
  );
  expect(packageJson.name).toBe('minimal-template');
});

function minimalTemplateAnswers() {
  const answers = TemplateModel.fromJSON({
    projectName: `test-project`,
    authorName: 'rany',
    authorEmail: 'rany@wix.com',
    organization: 'wix',
    transpiler: 'babel',
    templateDefinition: {
      name: 'minimal-template',
      path: path.join(__dirname, './__fixtures__/minimal-template/'),
    },
  });

  return answers;
}
