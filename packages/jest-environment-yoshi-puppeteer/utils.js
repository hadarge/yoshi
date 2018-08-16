const { execSync } = require('child_process');
const globby = require('globby');

const execOptions = {
  encoding: 'utf8',
  stdio: [
    'pipe', // stdin (default)
    'pipe', // stdout (default)
    'ignore', // stderr
  ],
};

const getProcessIdOnPort = port => {
  return execSync('lsof -i:' + port + ' -P -t -sTCP:LISTEN', execOptions)
    .split('\n')[0]
    .trim();
};

const getDirectoryOfProcessById = processId => {
  return execSync(
    'lsof -p ' +
      processId +
      ' | awk \'$4=="cwd" {for (i=9; i<=NF; i++) printf "%s ", $i}\'',
    execOptions,
  ).trim();
};

module.exports.getProcessForPort = port => {
  try {
    const processId = getProcessIdOnPort(port);
    const directory = getDirectoryOfProcessById(processId);

    return { directory };
  } catch (e) {
    return null;
  }
};

const { MATCH_ENV } = process.env;

module.exports.shouldRunE2Es = async () => {
  const filesPaths = await globby('test/e2e/**/*.spec.(ts|js){,x}');

  return (
    filesPaths.length > 0 &&
    (!MATCH_ENV || MATCH_ENV.split(',').includes('e2e'))
  );
};
