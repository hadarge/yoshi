const express = require('express');
const { join } = require('path');
const { fork } = require('child_process');
const { writeFileSync } = require('fs');

module.exports = {
  takePort(port) {
    return new Promise(resolve => {
      const server = express().listen(port, () => resolve(server));
    });
  },
  takePortFromAnotherProcess(cwd, port) {
    return new Promise(resolve => {
      const toExecute = `
          const http = require('http');
          const server = http.createServer();
          server.listen(${port}, 'localhost', () => {
            process.send({});
          });

          process.on('SIGINT', () => {
            server.close(() => {
              process.exit();
            });
          });
        `;

      writeFileSync(join(cwd, 'use-port.js'), toExecute, {
        encoding: 'utf-8',
      });

      const child = fork('use-port.js', { cwd });
      child.on('message', () => resolve(child));
    });
  },
};
