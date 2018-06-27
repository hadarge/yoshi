const DEFAULT_ENV = 'development';
const env = process.env.BABEL_ENV || process.env.NODE_ENV || DEFAULT_ENV;

const isDevelopment = env === 'development';
const isProduction = env === 'production';
const isTest = env === 'test';

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
          modules:
            options.modules || process.env.IN_WEBPACK ? false : 'commonjs',
          // Display targets to compile for.
          debug: options.debug,
          // Always use destructuring b/c of import/export support.
          include: ['transform-es2015-destructuring', ...options.include],
          exclude: options.exclude,
          // We don't need to be fully spec compatible, bundle size is more important.
          loose: true,
          // Allow users to provide its own targets and supply target node for test environment by default.
          targets: options.targets || (isTest && { node: 'current' }),
        },
      ],
      !options.ignoreReact && [
        require('babel-preset-react'),
        // Uncomment for babel 7.x.
        // {
        //   development: isDevelopment || isTest
        // }
      ],
    ].filter(Boolean),
    plugins: [
      [
        // Allow the usage of class properties.
        require('babel-plugin-transform-class-properties'),
        {
          // Bundle size and perf is prior to tiny ES spec incompatibility.
          loose: true,
        },
      ],
      [
        // Add helpers for generators and async/await.
        require('babel-plugin-transform-runtime'),
        {
          // 2 options blow are usualy handled by pollyfil.io.
          helpers: false,
          polyfill: false,
          regenerator: true,
        },
      ],
      // Enable legacy decorators.
      require('babel-plugin-transform-decorators'),
      // Transform dynamic import in test environment,
      // in all other cases Webpack will handle the transformation.
      isTest
        ? require('babel-plugin-dynamic-import-node').default // https://github.com/airbnb/babel-plugin-dynamic-import-node/issues/27
        : require('babel-plugin-syntax-dynamic-import'),
      // Current Node and new browsers (in development environment) already implement it so
      // just add the syntax of Object { ...rest, ...spread }
      (isDevelopment || isTest) &&
        require('babel-plugin-syntax-object-rest-spread'),

      ...(!isProduction
        ? []
        : [
            // Transform Object { ...rest, ...spread } to support old browsers
            require('babel-plugin-transform-object-rest-spread'),
            !options.ignoreReact && [
              // Remove PropTypes on react projects.
              require('babel-plugin-transform-react-remove-prop-types'),
              {
                removeImport: true,
              },
            ],
          ]),
    ].filter(Boolean),
  };
};
