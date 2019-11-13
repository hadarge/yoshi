import http from 'http';
import https from 'https';
import path from 'path';
import cors from 'cors';
import OriginalWebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import { STATICS_DIR } from 'yoshi-config/paths';
import express from 'express';

export function redirectMiddleware(
  hostname: string,
  port: number,
): express.Handler {
  return (req, res, next) => {
    if (!/\.min\.(js|css)/.test(req.originalUrl)) {
      return next();
    }

    const httpModule = req.protocol === 'http' ? http : https;

    const options = {
      port,
      hostname,
      path: req.originalUrl.replace('.min', ''),
      rejectUnauthorized: false,
    };

    const request = httpModule.request(options, proxiedResponse => {
      for (const header in proxiedResponse.headers) {
        // @ts-ignore
        res.setHeader(header, proxiedResponse.headers[header]);
      }
      proxiedResponse.pipe(res);
    });

    request.on('error', () => next()).end();
  };
}

// The server should be accessible externally
export const host = '0.0.0.0';

export class WebpackDevServer extends OriginalWebpackDevServer {
  public port: number;
  public https: boolean;
  public compiler: webpack.Compiler;

  constructor(
    compiler: webpack.Compiler,
    {
      publicPath,
      https,
      port,
      cwd = process.cwd(),
    }: {
      publicPath: string;
      https: boolean;
      port: number;
      cwd?: string;
    },
  ) {
    super(compiler, {
      // Enable gzip compression for everything served
      compress: true,
      clientLogLevel: 'error',
      contentBase: path.join(cwd, STATICS_DIR),
      watchContentBase: true,
      hot: true,
      publicPath,
      writeToDisk: true,
      // We write our own errors/warnings to the console
      quiet: true,
      noInfo: true,
      https,
      host,
      overlay: true,
      // https://github.com/wix/yoshi/pull/1191
      allowedHosts: [
        '.wix.com',
        '.wixsite.com',
        '.ooidev.com',
        '.deviantart.lan',
      ],
      before(expressApp) {
        // Send cross origin headers
        expressApp.use(cors());
        // Redirect `.min.(js|css)` to `.(js|css)`
        expressApp.use(redirectMiddleware(host, port));
      },
    });

    this.port = port;
    this.https = https;
    this.compiler = compiler;
  }

  // Update sockets with new stats, we use the sockWrite() method
  // to update the hot client with server data
  send(type: string, data: any) {
    // @ts-ignore
    return this.sockWrite(this.sockets, type, data);
  }

  listenPromise() {
    return new Promise((resolve, reject) => {
      super.listen(this.port, host, err => (err ? reject(err) : resolve()));
    });
  }
}
