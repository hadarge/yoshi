const DEFAULT_ENV = 'development';
const env = process.env.BABEL_ENV || process.env.NODE_ENV || DEFAULT_ENV;
const envChecker = env => (...envsToMatch) =>
  envsToMatch.some(envToMatch => envToMatch === env);
const isMatchEnvs = envChecker(env);

const normaliseOptions = opts => {
  return {
    ...opts,
    include: opts.include || [],
    exclude: opts.exclude || [],
  };
};

module.exports = function(api, opts = {}) {
  const options = normaliseOptions(opts);

  return {
    presets: [
      [
        require('babel-preset-env'),
        {
          modules: options.modules,
          // Display targets to compile for.
          debug: options.debug,
          // Always use destructuring b/c of import/export support.
          include: ['transform-es2015-destructuring', ...options.include],
          exclude: options.exclude,
          // We don't need be fully spec compatiable, bundle size is matter.
          loose: true,
          // Allow users to provide own targets
          targets: options.targets,
        },
      ],
      !options.ignoreReact && [
        require('babel-preset-react'),
        // Uncomment for babel 7.x.
        // {
        //   development: isMatchEnvs('development', 'test')
        // }
      ],
    ].filter(Boolean),
    plugins: [
      [
        // Use class properties.
        require('babel-plugin-transform-class-properties'),
        {
          // Bundle size and perf is more prior than tiny ES spec incompatibility.
          loose: true,
        },
      ],
      [
        // Add helpers for generators and async/await.
        require('babel-plugin-transform-runtime'),
        {
          // 2 options above are usualy handled by pollyfil.io.
          helpers: false,
          polyfill: false,
          regenerator: true,
        },
      ],
      // Use legacy decorators.
      require('babel-plugin-transform-decorators'),
      // Remove PropTypes from production build
      isMatchEnvs('production') &&
        !options.ignoreReact && [
          require('babel-plugin-transform-react-remove-prop-types'),
          {
            removeImport: true,
          },
        ],
      // Just add syntax for dynamic imports. Other part is handled by webpack.
      require('babel-plugin-syntax-dynamic-import'),
    ].filter(Boolean),
  };
};
