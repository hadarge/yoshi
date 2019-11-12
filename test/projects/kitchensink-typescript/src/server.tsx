import ejs from 'ejs';
import path from 'path';
import express from 'express';

const app = express();

app.get('/other', async (req, res) => {
  res.send(await ejs.renderFile('./src/other.ejs'));
});

app.get('/web-worker-bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'statics/worker.bundle.js'));
});

app.get('/web-worker.js', async (req, res) => {
  res.sendFile(path.join(__dirname, '../src/web-worker-wrapper.js'));
});

app.get('/env-var-browser', async (req, res) => {
  res.send(process.env.browser);
});

app.get('*', async (req, res) => {
  res.send(
    await ejs.renderFile('./src/index.ejs', {
      title: 'Some title',
    }),
  );
});

app.listen(process.env.PORT);
