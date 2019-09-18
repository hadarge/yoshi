import fs from 'fs';
import path from 'path';
import childProcess, { ChildProcess } from 'child_process';
import mkdirp from 'mkdirp';
import chokidar from 'chokidar';
import chalk from 'chalk';
import psTree from 'ps-tree';
import detect from 'detect-port';
import config from 'yoshi-config';
import rootApp from 'yoshi-config/root-app';
import xmldoc from 'xmldoc';
// eslint-disable-next-line import/no-unresolved
import { Stats } from 'webpack';
import { inTeamCity } from './queries';
import { staticsDomain } from './constants';

export function logIfAny(log: any) {
  if (log) {
    console.log(log);
  }
}

export const unprocessedModules = (p: string) => {
  const allSourcesButExternalModules = (filePath: string) => {
    filePath = path.normalize(filePath);

    return (
      filePath.startsWith(process.cwd()) && !filePath.includes('node_modules')
    );
  };

  const externalUnprocessedModules = ['wix-style-react/src'].concat(
    config.externalUnprocessedModules,
  );

  const externalRegexList = externalUnprocessedModules.map(
    m => new RegExp(`node_modules/${m}`),
  );

  return (
    externalRegexList.some(regex => regex.test(p)) ||
    allSourcesButExternalModules(p)
  );
};

export const createBabelConfig = (presetOptions = {}) => {
  const pathsToResolve = [__filename];
  try {
    pathsToResolve.push(require.resolve('yoshi'));
  } catch (e) {}
  return {
    presets: [
      [
        require.resolve('babel-preset-yoshi', {
          paths: pathsToResolve,
        }),
        presetOptions,
      ],
    ],
    babelrc: false,
    configFile: false,
  };
};

export const suffix = (ending: string) => (str: string) => {
  const hasSuffix = str.lastIndexOf(ending) === str.length - ending.length;
  return hasSuffix ? str : str + ending;
};

export const reportWebpackStats = (
  buildType: 'development' | 'production',
  stats: Stats,
) => {
  console.log(chalk.magenta(`Webpack summary for ${buildType} build:`));
  logIfAny(
    stats.toString({
      colors: true,
      hash: false,
      chunks: false,
      assets: true,
      children: false,
      version: false,
      timings: false,
      modules: false,
      entrypoints: false,
      warningsFilter: /export .* was not found in/,
      builtAt: false,
    }),
  );
};

export const writeFile = (targetFileName: string, data: string) => {
  mkdirp.sync(path.dirname(targetFileName));
  fs.writeFileSync(path.resolve(targetFileName), data);
};

type callback = (path: string) => void;

export const watch = (
  {
    pattern,
    cwd = process.cwd(),
    ignoreInitial = true,
    ...options
  }: { pattern: string | Array<string>; cwd: string; ignoreInitial?: boolean },
  callback: callback,
) => {
  const watcher = chokidar
    .watch(pattern, { cwd, ignoreInitial, ...options })
    .on('all', (event, filePath) => callback(filePath));

  return watcher;
};

export const getMochaReporter = () => {
  if (inTeamCity()) {
    return 'mocha-teamcity-reporter';
  }

  if (process.env.mocha_reporter) {
    return process.env.mocha_reporter;
  }

  return 'progress';
};

export const getListOfEntries = (entry: any) => {
  if (typeof entry === 'string') {
    return [path.resolve('src', entry)];
  } else if (typeof entry === 'object') {
    return Object.keys(entry).map(name => {
      const file = entry[name];
      return path.resolve('src', file);
    });
  }
  return [];
};

export const shouldTransformHMRRuntime = () => {
  return config.hmr === 'auto' && config.isReactProject;
};

export const getProcessIdOnPort = (port: number) => {
  return childProcess
    .execSync(`lsof -i:${port} -P -t -sTCP:LISTEN`, { encoding: 'utf-8' })
    .toString()
    .split('\n')[0]
    .trim();
};

function getDirectoryOfProcessById(pid: number) {
  return childProcess
    .execSync(`lsof -p ${pid} | grep cwd | awk '{print $9}'`, {
      encoding: 'utf-8',
    })
    .toString()
    .trim();
}

const getCommandArgByPid = (pid: number, argIndex = 0) => {
  return childProcess
    .execSync(`ps -p ${pid} | awk '{print $${4 + argIndex}}'`, {
      encoding: 'utf-8',
    })
    .toString()
    .trim();
};

export const processIsJest = (pid: number) => {
  const commandArg = getCommandArgByPid(pid, 1);
  return commandArg.split('/').pop() === 'jest';
};

export const getProcessOnPort = async (
  port: number,
  shouldCheckTestResult?: boolean,
) => {
  if (shouldCheckTestResult) {
    const portTestResult = await detect(port);

    if (port === portTestResult) {
      return null;
    }
  }
  try {
    const pid = getProcessIdOnPort(port);
    const cwd = getDirectoryOfProcessById(parseInt(pid, 10));

    return {
      pid,
      cwd,
    };
  } catch (e) {
    return null;
  }
};

export const toIdentifier = (str: string) => {
  const IDENTIFIER_NAME_REPLACE_REGEX = /^([^a-zA-Z$_])/;
  const IDENTIFIER_ALPHA_NUMERIC_NAME_REPLACE_REGEX = /[^a-zA-Z0-9$]+/g;

  return str
    .replace(IDENTIFIER_NAME_REPLACE_REGEX, '_$1')
    .replace(IDENTIFIER_ALPHA_NUMERIC_NAME_REPLACE_REGEX, '_');
};

export const tryRequire = (name: string) => {
  let absolutePath;

  try {
    absolutePath = require.resolve(name);
  } catch (e) {
    // The module has not found
    return null;
  }

  return require(absolutePath);
};

// Gets the artifact id of the project at the current working dir
export const getProjectArtifactId = () => {
  if (fs.existsSync(rootApp.POM_FILE)) {
    const content = fs.readFileSync(rootApp.POM_FILE, 'utf-8');
    const artifactId = new xmldoc.XmlDocument(content).valueWithPath(
      'artifactId',
    );

    return artifactId;
  }

  return '';
};

export const getProjectArtifactVersion = () => {
  return (process.env.ARTIFACT_VERSION
    ? // Dev CI
      process.env.ARTIFACT_VERSION.replace('-SNAPSHOT', '')
    : // PR CI won't have a version, only BUILD_NUMBER and BUILD_VCS_NUMBER
      process.env.BUILD_VCS_NUMBER) as string;
};

// Gets the CDN base path for the project at the current working dir
export const getProjectCDNBasePath = () => {
  const artifactName = getProjectArtifactId();

  let artifactPath = '';

  if (config.experimentalBuildHtml) {
    // Not to be confused with Yoshi's `dist` directory.
    //
    // Static assets are deployed to two locations on the CDN:
    //
    // - `https://static.parastorage.com/services/service-name/dist/asset.f43a1.js`
    // - `https://static.parastorage.com/services/service-name/1.2.3/asset.js`
    //
    // If this experimental feature is enabled, we can benefit from better caching by configuring
    // Webpack's `publicUrl` to use the first option.
    artifactPath = 'dist';
  } else {
    artifactPath = getProjectArtifactVersion();
  }

  return `${staticsDomain}/${artifactName}/${artifactPath}/`;
};

export const killSpawnProcessAndHisChildren = (child: ChildProcess) => {
  return new Promise(resolve => {
    if (!child) {
      return resolve();
    }

    const pid = child.pid;

    psTree(pid, (err, children) => {
      [pid]
        .concat(children.map(p => parseInt(p.PID, 10)))
        .forEach((tpid: number) => {
          try {
            process.kill(tpid, 'SIGKILL');
          } catch (e) {}
        });
      resolve();
    });
  });
};
