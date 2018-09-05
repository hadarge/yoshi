module.exports = ({ ci } = { ci: true }) => {
  if (ci) {
    return {
      CONTINUOUS_INTEGRATION: true,
      BUILD_NUMBER: true,
      TEAMCITY_VERSION: true,
    };
  }

  return {
    CONTINUOUS_INTEGRATION: '',
    BUILD_NUMBER: '',
    TEAMCITY_VERSION: '',
  };
};
