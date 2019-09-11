import path from 'path';
import findUp from 'find-up';

export const ROOT_DIR = process.cwd();

const resolvePath = (...args: Array<string>) => path.resolve(ROOT_DIR, ...args);

export const SRC_DIR = resolvePath('src');
export const BUILD_DIR = resolvePath('dist');
export const TARGET_DIR = resolvePath('target');
export const ROUTES_DIR = path.join(SRC_DIR, 'routes');
export const TEMPLATES_DIR = path.join(SRC_DIR, 'templates');
export const PUBLIC_DIR = path.join(SRC_DIR, 'assets');
export const STATICS_DIR = path.join(BUILD_DIR, 'statics');
export const ROUTES_BUILD_DIR = path.join(BUILD_DIR, 'routes');
export const TEMPLATES_BUILD_DIR = path.join(STATICS_DIR, 'templates');
export const ASSETS_DIR = path.join(STATICS_DIR, 'assets');

export const LERNA_JSON = findUp.sync('lerna.json');
export const MONOREPO_ROOT = LERNA_JSON && path.dirname(LERNA_JSON);

export const NODE_PLATFORM_DEFAULT_CONFIGS_DIR = resolvePath('test/configs');

export const POM_FILE = resolvePath('pom.xml');
export const STATS_FILE = resolvePath(TARGET_DIR, 'webpack-stats.json');
export const TSCONFIG_FILE = resolvePath('tsconfig.json');
export const SERVER_LOG_FILE = resolvePath(TARGET_DIR, 'server.log');
