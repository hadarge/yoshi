const testKitEnv = require('./environment')
  .environment()
  .then(env => {
    env.start();
    return env;
  });

// We need to stop the testkit explicitly, since it's running in a different process
const stopTestKit = () => testKitEnv.then(tk => tk.stop());

const signals: Array<'SIGINT' | 'SIGUSR1' | 'SIGUSR2'> = [
  'SIGINT',
  'SIGUSR1',
  'SIGUSR2',
];

signals.forEach(ev => process.on(ev, stopTestKit));

process.on('uncaughtException', stopTestKit);
process.on('exit', stopTestKit);
