const loadJestYoshiConfig = require('yoshi-config/jest');

const jestYoshiConfig = loadJestYoshiConfig();

const bootstrapConfig = jestYoshiConfig.bootstrap;

global.__setup__ = bootstrapConfig && bootstrapConfig.setup;
global.__teardown__ = bootstrapConfig && bootstrapConfig.teardown;
