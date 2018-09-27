const path = require('path');
const webpack = require('webpack');
const { isObject } = require('lodash');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const StylableWebpackPlugin = require('stylable-webpack-plugin');
const TpaStyleWebpackPlugin = require('tpa-style-webpack-plugin');
const RtlCssPlugin = require('rtlcss-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const DynamicPublicPath = require('../src/webpack-plugins/dynamic-public-path');
const { localIdentName, staticsDomain } = require('../src/constants');
const { SRC_DIR, BUILD_DIR } = require('yoshi-config/paths');

const project = require('yoshi-config');
const {
  toIdentifier,
  isSingleEntry,
  isProduction: checkIsProduction,
  inTeamCity: checkInTeamCity,
  getPOM,
} = require('yoshi-helpers');

const reScript = /\.js?$/;
const reStyle = /\.(css|less|scss|sass)$/;
const reAssets = /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|otf|eot|wav|mp3)$/;

const disableTsThreadOptimization =
  process.env.DISABLE_TS_THREAD_OPTIMIZATION === 'true';

const disableModuleConcat = process.env.DISABLE_MODULE_CONCATENATION === 'true';

const isProduction = checkIsProduction();

const inTeamCity = checkInTeamCity();

const isDevelopment = process.env.NODE_ENV === 'development';

const computedSeparateCss =
  project.separateCss === 'prod'
    ? inTeamCity || isProduction
    : project.separateCss;

const artifactVersion = process.env.ARTIFACT_VERSION;

// Projects that uses `wnpm-ci` have their package.json version field on a fixed version which is not their real version
// These projects determine their version on the "release" step, which means they will have a wrong public path
// We currently can't support static public path of packages that deploy to unpkg
const getPublicPath = () => {
  if (inTeamCity && artifactVersion) {
    const artifactName = getPOM().valueWithPath('artifactId');

    return `${staticsDomain}/${artifactName}/${artifactVersion.replace(
      '-SNAPSHOT',
      '',
    )}/`;
  }

  return '/';
};

const publicPath = getPublicPath();

const stylableSeparateCss = project.enhancedTpaStyle;

const defaultSplitChunksConfig = {
  chunks: 'all',
  name: 'commons',
  minChunks: 2,
};

const useSplitChunks = project.splitChunks;

const splitChunksConfig = isObject(useSplitChunks)
  ? useSplitChunks
  : defaultSplitChunksConfig;

const entry = project.entry || project.defaultEntry;

// Common function to get style loaders
const getStyleLoaders = ({
  embedCss,
  isDebug,

  // Allow overriding defaults
  separateCss = computedSeparateCss,
  hmr = project.hmr,
  tpaStyle = project.tpaStyle,
}) => {
  const cssLoaderOptions = {
    camelCase: true,
    sourceMap: !!separateCss,
    localIdentName: isDebug ? localIdentName.long : localIdentName.short,
    // Make sure every package has unique class names
    hashPrefix: project.name,
    // https://github.com/css-modules/css-modules
    modules: project.cssModules,
    // PostCSS, less-loader, sass-loader and resolve-url-loader, so
    // composition will work with import
    importLoaders: 4 + Number(tpaStyle),
  };

  return [
    {
      test: reStyle,
      exclude: /\.st\.css$/,
      rules: [
        ...(embedCss
          ? [
              // https://github.com/shepherdwind/css-hot-loader
              ...(hmr ? [{ loader: 'css-hot-loader' }] : []),

              // Process every style asset with either `style-loader`
              // or `mini-css-extract-plugin`
              ...(separateCss
                ? [
                    {
                      loader: MiniCssExtractPlugin.loader,
                    },
                  ]
                : [
                    {
                      loader: 'style-loader',
                      options: {
                        // Reuses a single `<style></style>` element
                        singleton: true,
                      },
                    },
                  ]),

              {
                oneOf: [
                  // Files ending with `.global.(css|sass|scss|less)` will be transpiled with
                  // `modules: false`
                  {
                    test: /\.global\.[A-z]*$/,
                    loader: 'css-loader',
                    options: {
                      ...cssLoaderOptions,
                      modules: false,
                    },
                  },
                  {
                    // https://github.com/webpack/css-loader
                    loader: 'css-loader',
                    options: cssLoaderOptions,
                  },
                ],
              },
              {
                loader: 'postcss-loader',
                options: {
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  ident: 'postcss',
                  plugins: [require('autoprefixer')],
                  sourceMap: isDebug,
                },
              },

              // https://github.com/bholloway/resolve-url-loader
              {
                loader: 'resolve-url-loader',
                options: { attempts: 1 },
              },
            ]
          : [
              {
                loader: 'css-loader/locals',
                options: {
                  ...cssLoaderOptions,
                  importLoaders: 2 + Number(tpaStyle),
                  sourceMap: false,
                },
              },
            ]),

        // https://github.com/wix/wix-tpa-style-loader
        ...(tpaStyle ? [{ loader: 'wix-tpa-style-loader' }] : []),

        // https://github.com/webpack-contrib/less-loader
        {
          test: /\.less$/,
          loader: 'less-loader',
          options: {
            sourceMap: embedCss,
            paths: ['.', 'node_modules'],
          },
        },

        // https://github.com/webpack-contrib/sass-loader
        {
          test: /\.(scss|sass)$/,
          loader: 'sass-loader',
          options: {
            sourceMap: embedCss,
            includePaths: ['node_modules', 'node_modules/compass-mixins/lib'],
          },
        },
      ],
    },
  ];
};

//
// Common configuration chunk to be used for both
// client-side (client.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------
function createCommonWebpackConfig({ isDebug = true } = {}) {
  const config = {
    context: SRC_DIR,

    mode: isProduction ? 'production' : 'development',

    output: {
      path: path.join(BUILD_DIR, 'statics'),
      publicPath,
      pathinfo: isDebug,
      filename: isDebug ? '[name].bundle.js' : '[name].bundle.min.js',
      chunkFilename: isDebug ? '[name].chunk.js' : '[name].chunk.min.js',
    },

    resolve: {
      modules: ['node_modules', SRC_DIR],

      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],

      alias: project.resolveAlias,

      // Whether to resolve symlinks to their symlinked location.
      symlinks: false,
    },

    // Since Yoshi doesn't depend on every loader it uses directly, we first look
    // for loaders in Yoshi's `node_modules` and then look at the root `node_modules`
    //
    // See https://github.com/wix/yoshi/pull/392
    resolveLoader: {
      modules: [path.join(__dirname, '../node_modules'), 'node_modules'],
    },

    plugins: [
      // https://github.com/Urthen/case-sensitive-paths-webpack-plugin
      new CaseSensitivePathsPlugin(),
      // Way of communicating to `babel-preset-yoshi` or `babel-preset-wix` that
      // it should optimize for Webpack
      { apply: () => (process.env.IN_WEBPACK = 'true') },
    ],

    module: {
      rules: [
        // https://github.com/wix/externalize-relative-module-loader
        ...(project.features.externalizeRelativeLodash
          ? [
              {
                test: /[\\/]node_modules[\\/]lodash/,
                loader: 'externalize-relative-module-loader',
              },
            ]
          : []),

        // https://github.com/huston007/ng-annotate-loader
        ...(project.isAngularProject
          ? [
              {
                test: reScript,
                loader: 'ng-annotate-loader',
                include: project.unprocessedModules,
              },
            ]
          : []),

        // Rules for TS / TSX
        {
          test: /\.(ts|tsx)$/,
          exclude: /(node_modules)/,
          use: [
            ...(disableTsThreadOptimization
              ? []
              : [
                  {
                    loader: 'thread-loader',
                    options: {
                      workers: require('os').cpus().length - 1,
                    },
                  },
                ]),

            // https://github.com/huston007/ng-annotate-loader
            ...(project.isAngularProject
              ? [{ loader: 'ng-annotate-loader' }]
              : []),

            {
              loader: 'ts-loader',
              options: {
                // This implicitly sets `transpileOnly` to `true`
                happyPackMode: !disableTsThreadOptimization,
                compilerOptions: project.isAngularProject
                  ? {}
                  : {
                      // force es modules for tree shaking
                      module: 'esnext',
                      // use same module resolution
                      moduleResolution: 'node',
                      // optimize target to latest chrome for local development
                      ...(isDevelopment
                        ? {
                            // allow using Promises, Array.prototype.includes, String.prototype.padStart, etc.
                            lib: ['es2017'],
                            // use async/await instead of embedding polyfills
                            target: 'es2017',
                          }
                        : {}),
                    },
              },
            },
          ],
        },

        // Rules for JS
        {
          test: reScript,
          include: project.unprocessedModules,
          use: [
            {
              loader: 'thread-loader',
              options: {
                workers: require('os').cpus().length - 1,
              },
            },
            {
              loader: 'babel-loader',
            },
          ],
        },

        // Rules for assets
        {
          oneOf: [
            // Inline SVG images into CSS
            {
              test: /\.inline\.svg$/,
              loader: 'svg-inline-loader',
            },

            // Try to inline assets as base64 or return a public URL to it if it passes
            // the 10kb limit
            {
              test: reAssets,
              loader: 'url-loader',
              options: {
                name: '[path][name].[ext]?[hash]',
                limit: 10000,
              },
            },
          ],
        },

        // Rules for Markdown
        {
          test: /\.md$/,
          loader: 'raw-loader',
        },

        // Rules for HAML
        {
          test: /\.haml$/,
          loader: 'ruby-haml-loader',
        },

        // Rules for HTML
        {
          test: /\.html$/,
          loader: 'html-loader',
        },

        // Rules for GraphQL
        {
          test: /\.(graphql|gql)$/,
          include: [SRC_DIR],
          loader: 'graphql-tag/loader',
        },
      ],
    },

    // https://webpack.js.org/configuration/stats/
    stats: 'none',

    // https://webpack.js.org/configuration/devtool
    devtool: inTeamCity ? 'source-map' : 'cheap-module-source-map',
  };

  return config;
}

//
// Configuration for the client-side bundle (client.js)
// -----------------------------------------------------------------------------
function createClientWebpackConfig({ isAnalyze = false, isDebug = true } = {}) {
  const config = createCommonWebpackConfig({ isDebug });

  const styleLoaders = getStyleLoaders({ embedCss: true, isDebug });

  const clientConfig = {
    ...config,

    name: 'client',

    target: 'web',

    entry: isSingleEntry(entry) ? { app: entry } : entry,

    optimization: {
      minimize: !isDebug,
      splitChunks: useSplitChunks ? splitChunksConfig : false,
      concatenateModules: isProduction && !disableModuleConcat,
      minimizer: [
        new UglifyJsPlugin({
          // Use multi-process parallel running to improve the build speed
          // Default number of concurrent runs: os.cpus().length - 1
          parallel: true,
          // Enable file caching
          cache: true,
          sourceMap: true,
          uglifyOptions: {
            output: {
              // support emojis
              ascii_only: true,
            },
            keep_fnames: project.keepFunctionNames,
          },
        }),
      ],
    },

    output: {
      ...config.output,

      // https://github.com/wix/yoshi/pull/497
      jsonpFunction: `webpackJsonp_${toIdentifier(project.name)}`,

      // Bundle as UMD format if the user configured that this is a library
      ...(project.exports
        ? {
            library: project.exports,
            libraryTarget: 'umd',
            globalObject: "(typeof self !== 'undefined' ? self : this)",
          }
        : {}),

      // https://webpack.js.org/configuration/output/#output-umdnameddefine
      umdNamedDefine: project.umdNamedDefine,
    },

    plugins: [
      ...config.plugins,

      // https://webpack.js.org/plugins/loader-options-plugin
      new webpack.LoaderOptionsPlugin({
        minimize: !isDebug,
      }),

      ...(computedSeparateCss
        ? [
            // https://github.com/webpack-contrib/mini-css-extract-plugin
            new MiniCssExtractPlugin({
              filename: isDebug ? '[name].css' : '[name].min.css',
            }),
            // https://github.com/wix-incubator/tpa-style-webpack-plugin
            ...(project.enhancedTpaStyle ? [new TpaStyleWebpackPlugin()] : []),
            // https://github.com/wix/rtlcss-webpack-plugin
            new RtlCssPlugin(isDebug ? '[name].rtl.css' : '[name].rtl.min.css'),
          ]
        : []),

      // Hacky way of correcting Webpack's publicPath
      new DynamicPublicPath(),

      // https://github.com/darrenscerri/duplicate-package-checker-webpack-plugin
      new DuplicatePackageCheckerPlugin({ verbose: true }),

      // https://webpack.js.org/plugins/define-plugin/
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          isProduction ? 'production' : 'development',
        ),
        'window.__CI_APP_VERSION__': JSON.stringify(
          artifactVersion ? artifactVersion : '0.0.0',
        ),
      }),

      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      // https://github.com/wix/stylable
      new StylableWebpackPlugin({
        outputCSS: stylableSeparateCss,
        filename: '[name].stylable.bundle.css',
        includeCSSInJS: !stylableSeparateCss,
        optimize: { classNameOptimizations: false, shortNamespaces: false },
      }),

      // https://github.com/th0r/webpack-bundle-analyzer
      ...(isAnalyze
        ? [
            new BundleAnalyzerPlugin({
              generateStatsFile: true,
              // Path is relative to the output dir
              statsFilename: '../../target/webpack-stats.min.json',
            }),
          ]
        : []),
    ],

    module: {
      ...config.module,

      rules: [
        ...config.module.rules,

        // Rules for Style Sheets
        ...styleLoaders,
      ],
    },

    // https://github.com/webpack/node-libs-browser/tree/master/mock
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      __dirname: true,
    },

    externals: project.externals,

    // https://webpack.js.org/configuration/performance
    performance: {
      ...(isProduction
        ? project.performanceBudget || { hints: false }
        : {
            hints: false,
          }),
    },
  };

  return clientConfig;
}

module.exports = {
  createCommonWebpackConfig,
  createClientWebpackConfig,
  getStyleLoaders,
};
