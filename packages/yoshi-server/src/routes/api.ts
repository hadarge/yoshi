import globby from 'globby';
import importFresh from 'import-fresh';
import { send, json as parseBodyAsJson } from 'micro';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { isLeft } from 'fp-ts/lib/Either';
import rootApp from 'yoshi-config/root-app';
import serializeError from 'serialize-error';
import { requestPayloadCodec, DSL } from '../types';
import { relativeFilePath, get } from '../utils';
import { route } from '..';

const serverChunks = globby.sync('**/*.api.js', {
  cwd: rootApp.BUILD_DIR,
  absolute: true,
});

const functions: {
  [filename: string]:
    | { [functionName: string]: DSL<any, any> | undefined }
    | undefined;
} = serverChunks.reduce((acc, absolutePath) => {
  const chunk = importFresh(absolutePath);
  const filename = relativeFilePath(rootApp.BUILD_DIR, absolutePath);

  return {
    ...acc,
    [filename]: chunk,
  };
}, {});

export default route(async function() {
  const body = await parseBodyAsJson(this.req);
  const validation = requestPayloadCodec.decode(body);

  if (isLeft(validation)) {
    return send(this.res, 406, {
      errors: PathReporter.report(validation),
    });
  }

  const { fileName, functionName, args } = validation.right;
  const fn = get(functions, fileName, functionName, '__fn__');

  if (!fn) {
    return send(this.res, 406, {
      errors: `Function ${functionName}() was not found in file ${fileName}`,
    });
  }

  try {
    const fnThis = {
      context: this.context,
      req: this.req,
      res: this.res,
    };

    return await fn.apply(fnThis, args);
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      return send(this.res, 500, {
        errors: ['internal server error'],
      });
    }

    return send(this.res, 500, {
      errors: [serializeError(error)],
    });
  }
});
