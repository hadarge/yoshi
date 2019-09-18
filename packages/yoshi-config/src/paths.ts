import path from 'path';
import findUp from 'find-up';

export function getPaths(ROOT_DIR: string) {
  const resolvePath = (...args: Array<string>) =>
    path.resolve(ROOT_DIR, ...args);

  const SRC_DIR = resolvePath('src');
  const BUILD_DIR = resolvePath('dist');
  const TARGET_DIR = resolvePath('target');
  const ROUTES_DIR = path.join(SRC_DIR, 'routes');
  const TEMPLATES_DIR = path.join(SRC_DIR, 'templates');
  const PUBLIC_DIR = path.join(SRC_DIR, 'assets');
  const STATICS_DIR = path.join(BUILD_DIR, 'statics');
  const ROUTES_BUILD_DIR = path.join(BUILD_DIR, 'routes');
  const TEMPLATES_BUILD_DIR = path.join(STATICS_DIR, 'templates');
  const ASSETS_DIR = path.join(STATICS_DIR, 'assets');

  const LERNA_JSON = findUp.sync('lerna.json');

  const NODE_PLATFORM_DEFAULT_CONFIGS_DIR = resolvePath('test/configs');

  const POM_FILE = resolvePath('pom.xml');
  const STATS_FILE = resolvePath(TARGET_DIR, 'webpack-stats.json');
  const TSCONFIG_FILE = resolvePath('tsconfig.json');
  const SERVER_LOG_FILE = resolvePath(TARGET_DIR, 'server.log');

  return {
    ROOT_DIR,
    SRC_DIR,
    BUILD_DIR,
    TARGET_DIR,
    ROUTES_DIR,
    TEMPLATES_DIR,
    PUBLIC_DIR,
    STATICS_DIR,
    ROUTES_BUILD_DIR,
    TEMPLATES_BUILD_DIR,
    ASSETS_DIR,
    POM_FILE,
    STATS_FILE,
    TSCONFIG_FILE,
    SERVER_LOG_FILE,

    LERNA_JSON,

    NODE_PLATFORM_DEFAULT_CONFIGS_DIR,
  };
}
