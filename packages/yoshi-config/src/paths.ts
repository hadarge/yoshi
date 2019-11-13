import path from 'path';

export const SRC_DIR = 'src';
export const BUILD_DIR = 'dist';
export const TARGET_DIR = 'target';
export const ROUTES_DIR = path.join(SRC_DIR, 'routes');
export const TEMPLATES_DIR = path.join(SRC_DIR, 'templates');
export const PUBLIC_DIR = path.join(SRC_DIR, 'assets');
export const STATICS_DIR = path.join(BUILD_DIR, 'statics');
export const ROUTES_BUILD_DIR = path.join(BUILD_DIR, 'routes');
export const TEMPLATES_BUILD_DIR = path.join(STATICS_DIR, 'templates');
export const ASSETS_DIR = path.join(STATICS_DIR, 'assets');

export const NODE_PLATFORM_DEFAULT_CONFIGS_DIR = 'test/configs';

export const POM_FILE = 'pom.xml';
export const STATS_FILE = path.join(TARGET_DIR, 'webpack-stats.json');
export const TSCONFIG_FILE = 'tsconfig.json';
export const SERVER_LOG_FILE = path.join(TARGET_DIR, 'server.log');
