const testKitEnv = require('../environment')
  .environment()
  .then(env => {
    env.start();
    return env;
  });

// We need to stop the testkit explicitly, since it's running in a different process
const stopTestKit = () => testKitEnv.then(tk => tk.stop());

const stopEvents = [
  'SIGINT',
  'SIGUSR1',
  'SIGUSR2',
  'uncaughtException',
  'exit',
];

stopEvents.forEach(ev => process.on(ev, stopTestKit));
