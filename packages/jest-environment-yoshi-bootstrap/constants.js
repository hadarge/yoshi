const childProcess = require('child_process');
const { getProcessIdOnPort } = require('yoshi-helpers');

const JEST_WORKER_ID = parseInt(process.env.JEST_WORKER_ID, 10);

let COUNTER = 1;

module.exports.appConfDir = `./target/configs-${process.env.JEST_WORKER_ID}`;

module.exports.getPort = () => {
  const generatedPort = 1000 + JEST_WORKER_ID * 300 + COUNTER++;

  try {
    const processId = getProcessIdOnPort(generatedPort);

    if (processId) {
      childProcess.execSync(`kill -9 ${processId}`);
    }
  } catch (err) {
    // we don't care if we "getProcessIdOnPort" fails
  }

  return generatedPort;
};
