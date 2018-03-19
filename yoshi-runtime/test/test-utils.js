let originalEnv = Object.assign({}, process.env);

module.exports.cleanMocks = () => {
  process.env = originalEnv;
};

module.exports.mockEnvironment = ({production} = {production: true}) => {
  if (production) {
    process.env.NODE_ENV = 'production';
  } else {
    delete process.env.NODE_ENV;
  }
};

module.exports.mockCI = ({ci} = {ci: true}) => {
  if (ci) {
    process.env.CONTINUOUS_INTEGRATION = true;
    process.env.BUILD_NUMBER = true;
    process.env.TEAMCITY_VERSION = true;
  } else {
    delete process.env.CONTINUOUS_INTEGRATION;
    delete process.env.BUILD_NUMBER;
    delete process.env.TEAMCITY_VERSION;
  }
};
