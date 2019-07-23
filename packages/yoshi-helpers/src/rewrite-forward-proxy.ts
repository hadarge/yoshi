import net from 'net';
import http, { IncomingMessage, ServerResponse } from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import url from 'url';
import { createProxyServer } from 'http-proxy';
import enableDestroy from 'server-destroy';

export default async function startRewriteForwardProxy({
  search,
  rewrite,
  port,
}: {
  search: string;
  rewrite: string;
  port: number;
}) {
  const regularProxy = createProxyServer({ ignorePath: true, secure: false });

  const options = {
    key: fs.readFileSync(path.join(__dirname, '../certificates/server.key')),
    cert: fs.readFileSync(path.join(__dirname, '../certificates/server.cert')),
  };

  function proxyRequest(protocol: 'http' | 'https') {
    return (req: IncomingMessage, res: ServerResponse) => {
      let target =
        protocol + '://' + req.headers.host + url.parse(req.url || '').path;
      if (target.startsWith(search)) {
        target = target.replace(search, rewrite);
      }

      regularProxy.web(req, res, { target }, err => {
        if (err) {
          res.statusCode = 500;
          res.end();
        }
      });
    };
  }

  const httpsReverseProxyServer = https.createServer(
    options,
    proxyRequest('https'),
  );

  // @ts-ignore
  enableDestroy(httpsReverseProxyServer);

  // start an https server to proxy requests
  const httpsReverseProxyPort = await new Promise(resolve => {
    const listener = httpsReverseProxyServer.listen(0, () => {
      // @ts-ignore
      resolve(listener.address().port);
    });
  });

  const server = http.createServer(proxyRequest('http'));

  enableDestroy(server);

  server.on('connect', (_, socket) => {
    // open a TCP connection to the remote host
    // @ts-ignore
    const conn = net.connect(httpsReverseProxyPort, '127.0.0.1', function() {
      // respond to the client that the connection was made
      socket.write('HTTP/1.1 200 OK\r\n\r\n');
      // create a tunnel between the two hosts
      socket.pipe(conn);
      socket.on('error', () => {});
      conn.pipe(socket);
    });

    conn.on('error', () => {});
  });

  server.listen(port);

  return async () => {
    await closePromise(server);
    await closePromise(httpsReverseProxyServer);
  };
}

function closePromise(closable: any) {
  return new Promise((resolve, reject) => {
    closable.destroy((err: Error | null) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
