const { bootstrapServer, emitConfigs } = require('./test/environment');

const port = parseInt(process.env.PORT, 10);
const appConfDir = './target/dev/configs';

(async () => {
  const app = bootstrapServer({
    port,
    managementPort: port + 1,
    appConfDir,
  });

  await emitConfigs({ targetFolder: appConfDir });
  await app.start();
})();
