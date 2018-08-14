const JEST_WORKER_ID = parseInt(process.env.JEST_WORKER_ID, 10);

let COUNTER = 1;

module.exports.getPort = () => {
  return 1000 + JEST_WORKER_ID * 300 + COUNTER++;
};
