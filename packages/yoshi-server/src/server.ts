import { parse as parseUrl } from 'url';
import { RequestHandler, Request, Response } from 'express';
import Youch from 'youch';
import globby from 'globby';
import SockJS from 'sockjs-client';
import { send } from 'micro';
import importFresh from 'import-fresh';
import rootApp from 'yoshi-config/root-app';
import { RouteFunction } from './types';
import { relativeFilePath, pathMatch } from './utils';

export type Route = {
  route: string;
  handler: (
    req: Request,
    res: Response,
    params: { [param: string]: any },
  ) => void;
};

export default class Server {
  private context: any;
  private routes: Array<Route>;

  constructor(context: any) {
    this.context = context;

    this.routes = this.createRoutes();

    if (process.env.NODE_ENV === 'development') {
      const socket = new SockJS(
        `http://localhost:${process.env.HMR_PORT}/_yoshi_server_hmr_`,
      );

      socket.onmessage = async () => {
        try {
          this.routes = this.createRoutes();
        } catch (error) {
          socket.send(JSON.stringify({ success: false }));
        }

        socket.send(JSON.stringify({ success: true }));
      };
    }
  }

  public handle: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { pathname } = parseUrl(req.url as string, true);

      for (const { handler, route } of this.routes) {
        const params = pathMatch(route, pathname as string);

        if (params) {
          return await handler(req, res, params);
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        return send(res, 500, 'internal server error');
      }

      const youch = new Youch(error, req);
      const html: string = await youch.toHTML();

      return send(res, 500, html);
    }

    return send(res, 404, 'not found');
  };

  private createRoutes(): Array<Route> {
    const serverChunks = globby.sync('**/*.js', {
      cwd: rootApp.ROUTES_BUILD_DIR,
      absolute: true,
    });

    return serverChunks.map(absolutePath => {
      const chunk = importFresh(absolutePath) as RouteFunction<any>;
      const relativePath = `/${relativeFilePath(
        rootApp.ROUTES_BUILD_DIR,
        absolutePath,
      )}`;
      const routePath = relativePath.replace(/\[(\w+)\]/g, ':$1');

      return {
        route: routePath,
        handler: async (req, res, params) => {
          const fnThis = {
            context: this.context,
            req: req,
            res: res,
            params,
          };

          return send(res, 200, await chunk.call(fnThis));
        },
      };
    });
  }
}
