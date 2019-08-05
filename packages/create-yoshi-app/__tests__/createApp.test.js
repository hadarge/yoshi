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
  require('../src/runPrompt').mockReturnValue(minimalTemplateModel());
  require('../src/verifyRegistry').mockReturnValue(undefined);
  await createApp({ workingDir: tempDir, install: false, lint: false });

  expect(() => {
    console.log('Checking git status...');
    execa.shellSync('git status', {
      cwd: tempDir,
    });
  }).not.toThrow();
});

test('it should not create a git repo if the target directory is contained in a git repo', async () => {
  require('../src/runPrompt').mockReturnValue(minimalTemplateModel());
  require('../src/verifyRegistry').mockReturnValue(undefined);

  const tempDir = tempy.directory();
  const projectDir = path.join(tempDir, 'project');

  gitInit(tempDir);
  fs.ensureDirSync(projectDir);
  await createApp({ workingDir: projectDir, install: false, lint: false });

  expect(() => fs.statSync(path.join(projectDir, '.git'))).toThrow();
});

test('it uses a template model', async () => {
  const templateModel = minimalTemplateModel();

  const tempDir = tempy.directory();
  const projectDir = path.join(tempDir, 'project');

  fs.ensureDirSync(projectDir);

  await createApp({
    workingDir: projectDir,
    templateModel,
    install: false,
    lint: false,
  });

  const packageJson = fs.readJSONSync(
    path.join(tempDir, 'project', 'package.json'),
  );
  expect(packageJson.name).toBe('minimal-template');
});

function minimalTemplateModel() {
  return TemplateModel.fromJSON({
    projectName: `test-project`,
    authorName: 'rany',
    authorEmail: 'rany@wix.com',
    transpiler: 'babel',
    templateDefinition: {
      name: 'minimal-template',
      path: path.join(__dirname, './__fixtures__/minimal-template/'),
    },
  });
}
