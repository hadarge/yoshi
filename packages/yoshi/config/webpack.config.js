const fs = require('fs-extra');
const path = require('path');
const globby = require('globby');
const webpack = require('webpack');
const { isObject } = require('lodash');
const buildUrl = require('build-url');
const importCwd = require('import-cwd');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const StylableWebpackPlugin = require('@stylable/webpack-plugin');
const { resolveNamespaceFactory } = require('@stylable/node');
const TpaStyleWebpackPlugin = require('tpa-style-webpack-plugin');
const RtlCssPlugin = require('rtlcss-webpack-plugin');
const typescriptFormatter = require('react-dev-utils/typescriptFormatter');
const WriteFilePlugin = require('write-file-webpack-plugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlPolyfillPlugin = require('./html-polyfill-plugin');
const { localIdentName } = require('../src/constants');
const EnvironmentMarkPlugin = require('../src/webpack-plugins/environment-mark-plugin');
const ExportDefaultPlugin = require('../src/webpack-plugins/export-default-plugin');
const rootApp = require('yoshi-config/root-app');
const {
  isSingleEntry,
  isProduction: checkIsProduction,
  inTeamCity: checkInTeamCity,
  isTypescriptProject: checkIsTypescriptProject,
  exists,
} = require('yoshi-helpers/queries');
const {
  tryRequire,
  toIdentifier,
  getProjectArtifactId,
  createBabelConfig,
  unprocessedModules,
} = require('yoshi-helpers/utils');
const {
  addEntry,
  overrideRules,
  createServerEntries,
  validateServerEntry,
  calculatePublicPath,
} = require('../src/webpack-utils');

const { defaultEntry } = require('yoshi-helpers/constants');

const reScript = /\.js?$/;
const reStyle = /\.(css|less|scss|sass)$/;
const reAssets = /\.(png|jpg|jpeg|gif|woff|woff2|ttf|otf|eot|wav|mp3)$/;

const extensions = ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.svelte', '.json'];

const babelConfig = createBabelConfig({ modules: false });

const disableModuleConcat = process.env.DISABLE_MODULE_CONCATENATION === 'true';

const isProduction = checkIsProduction();

const inTeamCity = checkInTeamCity();

const isTypescriptProject = checkIsTypescriptProject();

const isDevelopment = process.env.NODE_ENV === 'development';

const computedSeparateCss = app =>
  app.separateCss === 'prod' ? inTeamCity || isProduction : app.separateCss;

const artifactVersion = process.env.ARTIFACT_VERSION;

const sassIncludePaths = ['node_modules', 'node_modules/compass-mixins/lib'];

function addHashToAssetName({ name, hash = 'contenthash:8', app = rootApp }) {
  if (app.experimentalBuildHtml && isProduction) {
    return name.replace('[name]', `[name].[${hash}]`);
  }

  return name;
}

function prependNameWith(filename, prefix) {
  return filename.replace(/\.[0-9a-z]+$/i, match => `.${prefix}${match}`);
}

function createTerserPlugin(app) {
  return new TerserPlugin({
    // Use multi-process parallel running to improve the build speed
    // Default number of concurrent runs: os.cpus().length - 1
    parallel: true,
    // Enable file caching
    cache: true,
    sourceMap: true,
    terserOptions: {
      output: {
        // support emojis
        ascii_only: true,
      },
      keep_fnames: app.keepFunctionNames,
    },
  });
}

function createDefinePlugin(isDebug) {
  // https://webpack.js.org/plugins/define-plugin/
  return new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(
      isProduction ? 'production' : 'development',
    ),
    'process.env.IS_MINIFIED': isDebug ? 'false' : 'true',
    'window.__CI_APP_VERSION__': JSON.stringify(
      artifactVersion ? artifactVersion : '0.0.0',
    ),
    'process.env.ARTIFACT_ID': JSON.stringify(getProjectArtifactId()),
  });
}

function browserDefinePlugin({ isServer }) {
  return new webpack.DefinePlugin({
    'process.env.browser': JSON.stringify(!isServer),
  });
}

// NOTE ABOUT PUBLIC PATH USING UNPKG SERVICE
// Projects that uses `wnpm-ci` have their package.json version field on a fixed version which is not their real version
// These projects determine their version on the "release" step, which means they will have a wrong public path
// We currently can't support static public path of packages that deploy to unpkg

const stylableSeparateCss = rootApp.enhancedTpaStyle;

const defaultSplitChunksConfig = {
  chunks: 'all',
  name: 'commons',
  minChunks: 2,
};

const svelteOptions = {
  // enables the hydrate: true runtime option, which allows a component to
  // upgrade existing DOM rather than creating new DOM from scratch
  hydratable: true,
  // Supress redundant CSS warnings on development
  // https://github.com/sveltejs/svelte-loader/issues/67
  onwarn: (warning, onwarn) => {
    warning.code === 'css-unused-selector' || onwarn(warning);
  },
  // https://github.com/ls-age/svelte-preprocess-sass
  preprocess: {
    style:
      importCwd.silent('svelte-preprocess-sass') &&
      importCwd.silent('svelte-preprocess-sass').sass({
        includePaths: sassIncludePaths,
      }),
  },
};

const useSplitChunks = rootApp.splitChunks;

const splitChunksConfig = isObject(useSplitChunks)
  ? useSplitChunks
  : defaultSplitChunksConfig;

// Common function to get style loaders
const getStyleLoaders = ({
  app = rootApp,
  embedCss,
  isDebug,
  isHmr,

  // Allow overriding defaults
  separateCss = computedSeparateCss(app),
  tpaStyle = app.tpaStyle,
}) => {
  const cssLoaderOptions = {
    camelCase: true,
    sourceMap: !!separateCss,
    localIdentName: isProduction ? localIdentName.short : localIdentName.long,
    // Make sure every package has unique class names
    hashPrefix: app.name,
    // https://github.com/css-modules/css-modules
    modules: app.cssModules,
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
              ...(isHmr
                ? [{ loader: 'yoshi-style-dependencies/css-hot-loader' }]
                : []),

              // Process every style asset with either `style-loader`
              // or `mini-css-extract-plugin`
              ...(separateCss
                ? [
                    {
                      loader: MiniCssExtractPlugin.loader,
                      options: {
                        // By default it use publicPath in webpackOptions.output
                        // We are overriding it to restore relative paths in url() calls
                        publicPath: '',
                      },
                    },
                  ]
                : [
                    {
                      loader: 'yoshi-style-dependencies/style-loader',
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
                    loader: 'yoshi-style-dependencies/css-loader',
                    options: {
                      ...cssLoaderOptions,
                      modules: false,
                    },
                    sideEffects: true,
                  },
                  {
                    // https://github.com/webpack/css-loader
                    loader: 'yoshi-style-dependencies/css-loader',
                    options: cssLoaderOptions,
                  },
                ],
              },
              {
                loader: 'yoshi-style-dependencies/postcss-loader',
                options: {
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  ident: 'postcss',
                  plugins: [
                    rootApp.experimentalRtlCss && require('postcss-rtl')(),
                    require('autoprefixer')({
                      // https://github.com/browserslist/browserslist
                      overrideBrowserslist: [
                        '> 0.5%',
                        'last 2 versions',
                        'Firefox ESR',
                        'not dead',
                        'ie >= 11',
                      ].join(','),
                      flexbox: 'no-2009',
                    }),
                  ].filter(Boolean),
                  sourceMap: isDebug,
                },
              },

              // https://github.com/bholloway/resolve-url-loader
              {
                loader: 'yoshi-style-dependencies/resolve-url-loader',
              },
            ]
          : [
              {
                loader: 'yoshi-style-dependencies/css-loader',
                options: {
                  ...cssLoaderOptions,
                  importLoaders: 2 + Number(tpaStyle),
                  exportOnlyLocals: true,
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
          loader: 'yoshi-style-dependencies/sass-loader',
          options: {
            sourceMap: embedCss,
            implementation: tryRequire('yoshi-style-dependencies/node-sass'),
            includePaths: sassIncludePaths,
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
function createCommonWebpackConfig({
  app = rootApp,
  isDebug = true,
  isHmr = false,
  withLocalSourceMaps,
} = {}) {
  const staticAssetName = addHashToAssetName({
    name: 'media/[name].[hash:8].[ext]',
    hash: 'hash:8',
    app,
  });

  const config = {
    context: app.SRC_DIR,

    mode: isProduction ? 'production' : 'development',

    output: {
      path: app.STATICS_DIR,
      publicPath: calculatePublicPath(app),
      pathinfo: isDebug,
      filename: isDebug
        ? addHashToAssetName({ name: '[name].bundle.js', app })
        : addHashToAssetName({ name: '[name].bundle.min.js', app }),
      chunkFilename: isDebug
        ? addHashToAssetName({ name: '[name].chunk.js', app })
        : addHashToAssetName({ name: '[name].chunk.min.js', app }),
      hotUpdateMainFilename: 'updates/[hash].hot-update.json',
      hotUpdateChunkFilename: 'updates/[id].[hash].hot-update.js',
    },

    resolve: {
      modules: ['node_modules', app.SRC_DIR],

      extensions,

      alias: app.resolveAlias,

      mainFields: ['svelte', 'browser', 'module', 'main'],

      // Whether to resolve symlinks to their symlinked location.
      symlinks: rootApp.experimentalMonorepo,
    },

    // Since Yoshi does not depend on every loader it uses directly, we first look
    // for loaders in Yoshi's `node_modules` and then look at the root `node_modules`
    //
    // See https://github.com/wix/yoshi/pull/392
    resolveLoader: {
      modules: [path.join(__dirname, '../node_modules'), 'node_modules'],
    },

    plugins: [
      // This gives some necessary context to module not found errors, such as
      // the requesting resource
      new ModuleNotFoundPlugin(app.ROOT_DIR),
      // https://github.com/Urthen/case-sensitive-paths-webpack-plugin
      new CaseSensitivePathsPlugin(),
      // Way of communicating to `babel-preset-yoshi` or `babel-preset-wix` that
      // it should optimize for Webpack
      new EnvironmentMarkPlugin(),
      // https://github.com/Realytics/fork-ts-checker-webpack-plugin
      ...(isTypescriptProject && app.projectType === 'app' && isDebug
        ? [
            // Since `fork-ts-checker-webpack-plugin` requires you to have
            // TypeScript installed when its required, we only require it if
            // this is a TypeScript project
            new (require('fork-ts-checker-webpack-plugin'))({
              tsconfig: app.TSCONFIG_FILE,
              async: false,
              silent: true,
              checkSyntacticErrors: true,
              formatter: typescriptFormatter,
            }),
          ]
        : []),
      ...(isHmr ? [new webpack.HotModuleReplacementPlugin()] : []),
    ],

    module: {
      // Makes missing exports an error instead of warning
      strictExportPresence: true,

      rules: [
        // https://github.com/wix/externalize-relative-module-loader
        ...(app.features.externalizeRelativeLodash
          ? [
              {
                test: /[\\/]node_modules[\\/]lodash/,
                loader: 'externalize-relative-module-loader',
              },
            ]
          : []),

        // https://github.com/huston007/ng-annotate-loader
        ...(app.isAngularProject
          ? [
              {
                test: reScript,
                loader: 'yoshi-angular-dependencies/ng-annotate-loader',
                include: unprocessedModules,
              },
            ]
          : []),

        {
          test: /\.inline\.worker\.(js|tsx?)$/,
          use: [
            {
              loader: 'worker-loader',
              options: {
                inline: true,
              },
            },
          ],
        },

        // Rules for TS / TSX
        {
          test: /\.(ts|tsx)$/,
          include: unprocessedModules,
          use: [
            {
              loader: 'thread-loader',
              options: {
                workers: require('os').cpus().length - 1,
              },
            },

            // https://github.com/huston007/ng-annotate-loader
            ...(app.isAngularProject
              ? [{ loader: 'yoshi-angular-dependencies/ng-annotate-loader' }]
              : []),

            {
              loader: 'ts-loader',
              options: {
                // This implicitly sets `transpileOnly` to `true`
                happyPackMode: true,
                compilerOptions: app.isAngularProject
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

        // Optimize JS processing
        // Worker stuff excluded due to https://github.com/webpack-contrib/worker-loader/issues/177
        {
          test: reScript,
          include: unprocessedModules,
          exclude: /\.inline\.worker\.js/,
          use: [
            {
              loader: 'thread-loader',
              options: {
                workers: require('os').cpus().length - 1,
              },
            },
          ],
        },

        // Rules for JS
        {
          test: reScript,
          include: unprocessedModules,
          use: [
            {
              loader: 'babel-loader',
              options: {
                ...babelConfig,
              },
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

            // Allows you to use two kinds of imports for SVG:
            // import logoUrl from './logo.svg'; gives you the URL.
            // import { ReactComponent as Logo } from './logo.svg'; gives you a component.
            {
              test: /\.svg$/,
              issuer: {
                test: /\.(j|t)sx?$/,
              },
              use: [
                {
                  loader: '@svgr/webpack',
                  options: {
                    svgoConfig: {
                      plugins: {
                        removeViewBox: false,
                      },
                    },
                  },
                },
                {
                  loader: 'svg-url-loader',
                  options: {
                    iesafe: true,
                    noquotes: true,
                    limit: 10000,
                    name: staticAssetName,
                  },
                },
              ],
            },
            {
              test: /\.svg$/,
              use: [
                {
                  loader: 'svg-url-loader',
                  options: {
                    iesafe: true,
                    limit: 10000,
                    name: staticAssetName,
                  },
                },
              ],
            },

            {
              test: /\.carmi.js$/,
              exclude: /node_modules/,
              // Not installed by Yoshi and should be installed by the project that needs it.
              // https://github.com/wix-incubator/carmi
              loader: 'carmi/loader',
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
              loader: 'graphql-tag/loader',
            },

            // Try to inline assets as base64 or return a public URL to it if it passes
            // the 10kb limit
            {
              test: reAssets,
              loader: 'url-loader',
              options: {
                name: staticAssetName,
                limit: 10000,
              },
            },
          ],
        },
      ],
    },

    // https://webpack.js.org/configuration/stats/
    stats: 'none',

    // https://github.com/webpack/node-libs-browser/tree/master/mock
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      __dirname: true,
    },

    // https://webpack.js.org/configuration/devtool
    // If we are in CI or requested explicitly we create full source maps
    // Once we are in a local build, we create cheap eval source map only
    // for a development build (hence the !isProduction)
    devtool:
      inTeamCity || withLocalSourceMaps
        ? 'source-map'
        : !isProduction
        ? 'cheap-module-eval-source-map'
        : false,
  };

  return config;
}

//
// Configuration for the client-side bundle (client.js)
// -----------------------------------------------------------------------------
function createClientWebpackConfig({
  app = rootApp,
  isAnalyze = false,
  isDebug = true,
  isHmr,
  withLocalSourceMaps,
} = {}) {
  const config = createCommonWebpackConfig({
    app,
    isDebug,
    isHmr,
    withLocalSourceMaps,
  });

  const styleLoaders = getStyleLoaders({ app, embedCss: true, isHmr, isDebug });

  const entry = app.entry || defaultEntry;

  const clientConfig = {
    ...config,

    name: 'client',

    target: 'web',

    entry: isSingleEntry(entry) ? { app: entry } : entry,

    optimization: {
      minimize: !isDebug,
      // https://webpack.js.org/plugins/module-concatenation-plugin
      concatenateModules: isProduction && !disableModuleConcat,
      minimizer: [
        createTerserPlugin(app),
        // https://github.com/NMFR/optimize-css-assets-webpack-plugin
        new OptimizeCSSAssetsPlugin(),
      ],

      // https://webpack.js.org/plugins/split-chunks-plugin
      splitChunks: useSplitChunks ? splitChunksConfig : false,
    },

    output: {
      ...config.output,

      // https://github.com/wix/yoshi/pull/497
      jsonpFunction: `webpackJsonp_${toIdentifier(app.name)}`,

      // Bundle as UMD format if the user configured that this is a library
      ...(app.exports
        ? {
            library: app.exports,
            libraryTarget: 'umd',
            globalObject: "(typeof self !== 'undefined' ? self : this)",
          }
        : {}),

      // https://webpack.js.org/configuration/output/#output-umdnameddefine
      umdNamedDefine: app.umdNamedDefine,
    },

    plugins: [
      ...config.plugins,

      createDefinePlugin(isDebug),

      browserDefinePlugin({ isServer: false }),

      // https://github.com/jantimon/html-webpack-plugin
      ...(app.experimentalBuildHtml && exists(app.TEMPLATES_DIR)
        ? [
            ...globby
              .sync('**/*.+(ejs|vm)', {
                cwd: app.TEMPLATES_DIR,
                absolute: true,
              })
              .map(templatePath => {
                const basename = path.basename(templatePath);
                const filename = path.resolve(
                  app.TEMPLATES_BUILD_DIR,
                  basename,
                );

                return new HtmlWebpackPlugin({
                  // Generate a `filename.debug.ejs` for non-minified compilation
                  filename: isDebug
                    ? prependNameWith(filename, 'debug')
                    : prependNameWith(filename, 'prod'),
                  // Only use chunks from the entry with the same name as the template
                  // file
                  chunks: [basename.replace(/\.[0-9a-z]+$/i, '')],
                  template: `html-loader!${templatePath}`,
                  minify: !isDebug,
                });
              }),

            // Polyfill via https://polyfill.io
            new HtmlPolyfillPlugin(HtmlWebpackPlugin, [
              buildUrl(
                'https://static.parastorage.com/polyfill/v2/polyfill.min.js',
                {
                  queryParams: {
                    features: ['default', 'es6', 'es7', 'es2017'],
                    flags: ['gated'],
                    unknown: 'polyfill',
                    rum: 0,
                  },
                },
              ),
            ]),

            new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
              PUBLIC_PATH: calculatePublicPath(app),
            }),
          ]
        : []),

      // https://github.com/gajus/write-file-webpack-plugin
      new WriteFilePlugin({
        exitOnErrors: false,
        log: false,
        useHashIndex: false,
      }),

      // https://webpack.js.org/plugins/loader-options-plugin
      new webpack.LoaderOptionsPlugin({
        minimize: !isDebug,
      }),

      ...(computedSeparateCss(app)
        ? [
            // https://github.com/webpack-contrib/mini-css-extract-plugin
            new MiniCssExtractPlugin({
              filename: isDebug
                ? addHashToAssetName({ name: '[name].css', app })
                : addHashToAssetName({ name: '[name].min.css', app }),
              chunkFilename: isDebug
                ? addHashToAssetName({ name: '[name].chunk.css', app })
                : addHashToAssetName({ name: '[name].chunk.min.css', app }),
            }),
            // https://github.com/wix-incubator/tpa-style-webpack-plugin
            ...(app.enhancedTpaStyle ? [new TpaStyleWebpackPlugin()] : []),
            // https://github.com/wix/rtlcss-webpack-plugin
            ...(!app.experimentalBuildHtml && !rootApp.experimentalRtlCss
              ? [
                  new RtlCssPlugin(
                    isDebug ? '[name].rtl.css' : '[name].rtl.min.css',
                  ),
                ]
              : []),
          ]
        : []),

      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      // https://github.com/wix/stylable
      new StylableWebpackPlugin({
        outputCSS: stylableSeparateCss,
        filename: '[name].stylable.bundle.css',
        includeCSSInJS: !stylableSeparateCss,
        optimize: { classNameOptimizations: false, shortNamespaces: false },
        runtimeMode: 'shared',
        globalRuntimeId: '__stylable_yoshi__',
        generate: {
          runtimeStylesheetId: 'namespace',
        },
        resolveNamespace: resolveNamespaceFactory(app.name),
      }),

      // https://github.com/th0r/webpack-bundle-analyzer
      ...(isAnalyze
        ? [
            new BundleAnalyzerPlugin({
              openAnalyzer: process.env.BROWSER !== 'none',
            }),
          ]
        : []),
    ],

    module: {
      ...config.module,

      rules: [
        ...config.module.rules,

        {
          test: /\.svelte$/,
          // Both, `svelte-loader` and `svelte-preprocess-sass` should be installed
          // by the project that needs it.
          //
          // If more users use `svelte` we'll consider adding it to everyone by default.
          loader: 'svelte-loader',
          options: {
            ...svelteOptions,
            dev: isDebug,
            // https://github.com/sveltejs/svelte-loader#extracting-css
            emitCss: true,
          },
        },

        // Rules for Style Sheets
        ...styleLoaders,

        ...(app.yoshiServer
          ? [
              {
                test: /\.api\.(js|ts)$/,
                loader: require.resolve('yoshi-server-tools/loader'),
              },
            ]
          : []),
      ],
    },

    externals: app.externals,

    // https://webpack.js.org/configuration/performance
    performance: {
      ...(isProduction
        ? app.performanceBudget || { hints: false }
        : {
            hints: false,
          }),
    },
  };

  if (isHmr) {
    clientConfig.entry = addEntry(clientConfig.entry, [
      require.resolve('webpack/hot/dev-server'),
      // Adding the query param with the CDN URL allows HMR when working with a production site
      // because the bundle is requested from "parastorage" we need to specify to open the socket to localhost
      `${require.resolve('webpack-dev-server/client')}?${app.servers.cdn.url}`,
    ]);
  }

  return clientConfig;
}

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------
function createServerWebpackConfig({
  app = rootApp,
  isDebug = true,
  isHmr = false,
  hmrPort,
} = {}) {
  const config = createCommonWebpackConfig({ app, isDebug, isHmr });

  const styleLoaders = getStyleLoaders({
    app,
    embedCss: false,
    isHmr: false,
    isDebug,
  });

  const serverConfig = {
    ...config,

    name: 'server',

    target: 'node',

    entry: async () => {
      const serverEntry = validateServerEntry(app, extensions);

      let entryConfig = app.yoshiServer
        ? createServerEntries(config.context, app)
        : {};

      if (serverEntry) {
        entryConfig = { ...entryConfig, server: serverEntry };
      }

      return entryConfig;
    },

    output: {
      ...config.output,
      path: app.BUILD_DIR,
      filename: '[name].js',
      chunkFilename: 'chunks/[name].js',
      libraryTarget: 'umd',
      globalObject: "(typeof self !== 'undefined' ? self : this)",
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: info =>
        path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },

    // Webpack mutates resolve object, so clone it to avoid issues
    // https://github.com/webpack/webpack/issues/4817
    resolve: {
      ...config.resolve,
    },

    module: {
      ...config.module,

      rules: [
        {
          test: /\.svelte$/,
          // Both, `svelte-loader` and `svelte-preprocess-sass` should be installed
          // by the project that needs it.
          //
          // If more users use `svelte` we'll consider adding it to everyone by default.
          loader: 'svelte-loader',
          options: {
            ...svelteOptions,
            dev: isDebug,
            // Generate SSR specific code
            generate: 'ssr',
          },
        },

        ...overrideRules(config.module.rules, rule => {
          // Override paths to static assets
          if (rule.loader === 'file-loader' || rule.loader === 'url-loader') {
            return {
              ...rule,
              options: {
                ...rule.options,
                emitFile: false,
              },
            };
          }

          if (rule.loader === 'babel-loader') {
            const serverBabelConfig = createBabelConfig({
              modules: false,
              targets: 'current node',
            });

            return {
              ...rule,
              options: {
                ...serverBabelConfig,
              },
            };
          }

          return rule;
        }),

        // Rules for Style Sheets
        ...styleLoaders,

        ...(app.yoshiServer
          ? [
              {
                test: /\.api\.(js|ts)$/,
                // The loader shouldn't be applied to entry files, only to files that
                // are imported by other files and passed to `yoshi-server/client`
                issuer: () => true,
                loader: require.resolve('yoshi-server-tools/loader'),
              },
            ]
          : []),
      ],
    },

    externals: [
      // Treat node modules as external for a small (and fast) server
      // bundle
      nodeExternals({
        whitelist: [
          reStyle,
          reAssets,
          /bootstrap-hot-loader/,
          /yoshi-server/,
          ...(rootApp.experimentalMonorepo
            ? require('yoshi-config/packages').libs.map(
                lib => new RegExp(lib.name),
              )
            : []),
        ],
      }),
      // Here for local integration tests as Yoshi's `node_modules`
      // are symlinked locally
      nodeExternals({
        modulesDir: path.resolve(__dirname, '../node_modules'),
      }),
      // Here for local integration tests as `yoshi-server` `node_modules`
      // is symlinked locally and isn't a Yoshi dependency
      nodeExternals({
        modulesDir: path.resolve(__dirname, '../../yoshi-server/node_modules'),
        whitelist: [/yoshi-server/],
      }),
      // Treat monorepo (hoisted) dependencies as external
      rootApp.experimentalMonorepo &&
        nodeExternals({
          modulesDir: path.resolve(app.ROOT_DIR, 'node_modules'),
        }),
    ].filter(Boolean),

    plugins: [
      ...config.plugins,

      // Export the server's default export (without a `default` prop) only if
      // it exists, for backward compatibilty
      new ExportDefaultPlugin(),

      // https://webpack.js.org/plugins/banner-plugin/
      new webpack.BannerPlugin({
        // https://github.com/evanw/node-source-map-support
        banner: fs.readFileSync(
          path.join(__dirname, 'source-map-support.js'),
          'utf-8',
        ),
        raw: true,
        entryOnly: false,
      }),

      browserDefinePlugin({ isServer: true }),
    ],

    // https://webpack.js.org/configuration/optimization
    optimization: {
      // Do not modify/set the value of `process.env.NODE_ENV`
      nodeEnv: false,
      // Don't minimize server code at all
      // Faster build time and possibly easier debugging
      minimize: false,
    },

    // Do not replace node globals with polyfills
    // https://webpack.js.org/configuration/node/
    node: {
      console: false,
      global: false,
      process: false,
      Buffer: false,
      __filename: false,
      __dirname: false,
    },

    devtool: 'cheap-module-inline-source-map',
  };

  if (isHmr) {
    serverConfig.entry = addEntry(serverConfig.entry, [
      `${require.resolve('./hot')}?${hmrPort}`,
    ]);
  }

  return serverConfig;
}

//
// Configuration for the web-worker bundle
// -----------------------------------------------------------------------------
function createWebWorkerWebpackConfig({
  app = rootApp,
  isDebug = true,
  isHmr = false,
}) {
  const config = createCommonWebpackConfig({ isDebug, isHmr });

  const webWorkerConfig = {
    ...config,

    name: 'web-worker',

    target: 'webworker',

    entry: app.webWorkerEntry,

    optimization: {
      minimize: !isDebug,
      // https://webpack.js.org/plugins/module-concatenation-plugin
      concatenateModules: isProduction && !disableModuleConcat,
      minimizer: [createTerserPlugin(app)],

      // https://webpack.js.org/plugins/split-chunks-plugin
      splitChunks: useSplitChunks ? splitChunksConfig : false,
    },

    output: {
      ...config.output,

      // Bundle as UMD format
      library: '[name]',
      libraryTarget: 'umd',
      globalObject: 'self',
    },

    plugins: [
      ...config.plugins,
      createDefinePlugin(isDebug),
      browserDefinePlugin({ isServer: false }),
    ],

    externals: [app.webWorkerExternals].filter(Boolean),
  };

  return webWorkerConfig;
}

module.exports = {
  createCommonWebpackConfig,
  createClientWebpackConfig,
  createServerWebpackConfig,
  createWebWorkerWebpackConfig,
  getStyleLoaders,
};
