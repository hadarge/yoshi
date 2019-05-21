const EventEmitter = require('events');
const http = require('http');
const sockjs = require('sockjs');

module.exports = class SocketServer extends EventEmitter {
  constructor() {
    super();

    this.connections = [];

    this.server = http.createServer();
    this.socket = sockjs.createServer();

    this.socket.installHandlers(this.server, { prefix: '/_yoshi_server_hmr_' });

    this.socket.on('connection', connection => {
      this.connections.push(connection);

      connection.on('data', message => {
        this.emit('message', JSON.parse(message));
      });

      connection.on('close', () => {
        const index = this.connections.indexOf(connection);

        if (index >= 0) {
          this.connections.splice(index, 1);
        }
      });
    });
  }

  send(message) {
    this.connections.forEach(connection => {
      connection.write(JSON.stringify(message));
    });
  }

  async initialize() {
    if (!this.server.listening) {
      await new Promise((resolve, reject) => {
        this.server.listen(9318, err => (err ? reject(err) : resolve()));
      });
    }
  }
};
