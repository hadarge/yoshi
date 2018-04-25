const envinfo = require('envinfo');

module.exports = async () => {
  console.log(
    await envinfo.run(
      {
        System: ['OS', 'CPU'],
        Binaries: ['Node', 'Yarn', 'npm', 'Watchman'],
        Browsers: ['Chrome', 'Firefox', 'Safari'],
        npmPackages: ['yoshi', 'webpack', 'storybook'],
      }
    )
  );
};
