const { bootstrapServer, emitConfigs } = require('./test/environment');

const targetFolder = './target/dev/configs';
(async () => {
  const app = bootstrapServer({
    port: process.env.PORT,
    managementPort: 3001,
    appConfDir: targetFolder,
  });

  await emitConfigs({targetFolder});
  await app.start();
})()
