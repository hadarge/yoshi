const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');

const execOptions = {
  encoding: 'utf8',
  stdio: [
    'pipe', // stdin (default)
    'pipe', // stdout (default)
    'ignore', //stderr
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

module.exports.loadConfig = () => {
  const configPath = path.join(process.cwd(), 'jest-yoshi.config.js');

  if (!fs.existsSync(configPath)) {
    throw new Error(
      `Could't find config file at: '${configPath}', please create one.`,
    );
  }

  const config = require(configPath);

  return config;
};
