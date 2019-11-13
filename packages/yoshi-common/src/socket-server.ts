import EventEmitter from 'events';
import http from 'http';
import detect from 'detect-port';
import sockjs from 'sockjs';

export default class SocketServer extends EventEmitter {
  public hmrPort: number;
  private socket: sockjs.Server;
  private server: http.Server;
  private connections: Array<sockjs.Connection>;

  constructor({ hmrPort }: { hmrPort: number }) {
    super();

    this.connections = [];

    this.hmrPort = hmrPort;
    this.server = http.createServer();
    this.socket = sockjs.createServer({
      // Limit useless logs
      log(severity, line) {
        if (severity === 'error') {
          console.error(line);
        }
      },
    });

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

  send(message: any) {
    this.connections.forEach(connection => {
      connection.write(JSON.stringify(message));
    });
  }

  async initialize() {
    if (!this.server.listening) {
      await new Promise(resolve => this.server.listen(this.hmrPort, resolve));
    }
  }

  static async create() {
    const hmrPort = await detect(0);

    return new SocketServer({ hmrPort });
  }
}
