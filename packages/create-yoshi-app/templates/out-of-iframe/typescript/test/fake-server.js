const httpTestkit = require('@wix/wix-http-testkit');
const renderVM = require('./vm');
const velocityData = require('../velocity.data.json');
const velocityDataPrivate = require('../velocity.private.data.json');
const fs = require('fs');

const server = httpTestkit.server({
  port: process.env.PORT,
  ssl: {
    cert: fs.readFileSync('./test/certificates/cert.pem', 'utf-8'),
    key: fs.readFileSync('./test/certificates/key.pem', 'utf-8'),
    passphrase: '1234',
  },
});

const app = server.getApp();

app.get(
  '/_api/wix-laboratory-server/laboratory/conductAllInScope',
  (req, res) => {
    const experiments = {
      ...velocityData.experiments,
      ...velocityDataPrivate.experiments,
    };
    res.json(experiments);
  },
);

app.use('/editorExampleWidget', (req, res) => {
  res.send(renderVM('./src/editorExampleWidget.entry.vm'));
});

app.use('/settingsExampleWidget', (req, res) => {
  res.send(renderVM('./src/settingsExampleWidget.entry.vm'));
});

// Launch the server
server.start().then(
  () => {
    console.info(`Fake server is running on port ${server.getUrl()}`);
  },
  err => {
    console.error(
      `Fake server failed to start on port ${process.env.PORT}: ${err.message}`,
    );
  },
);
