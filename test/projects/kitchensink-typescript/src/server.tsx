import path from 'path';
import express from 'express';

const app = express();

app.get('/other', (req, res) => {
  res.sendFile(path.resolve('./src/other.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve('./src/index.html'));
});

app.listen(process.env.PORT);
