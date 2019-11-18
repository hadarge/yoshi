import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import webpack from 'webpack';
import {
  SRC_DIR,
  STATICS_DIR,
  TSCONFIG_FILE,
  BUILD_DIR,
  PUBLIC_DIR,
  ASSETS_DIR,
  TEMPLATES_DIR,
  TEMPLATES_BUILD_DIR,
} from 'yoshi-config/paths';
import {
  isProduction as checkIsProduction,
  inTeamCity as checkInTeamCity,
} from 'yoshi-helpers/queries';
import ModuleNotFoundPlugin from 'react-dev-utils/ModuleNotFoundPlugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import {
  unprocessedModules,
  createBabelConfig,
  toIdentifier,
  getProjectArtifactId,
  getProjectArtifactVersion,
} from 'yoshi-helpers/utils';
import TerserPlugin from 'terser-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { resolveNamespaceFactory } from '@stylable/node';
import CopyPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import StylableWebpackPlugin from '@stylable/webpack-plugin';
import importCwd from 'import-cwd';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import globby from 'globby';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import buildUrl from 'build-url';
import nodeExternals, { WhitelistOption } from 'webpack-node-externals';
import RtlCssPlugin from 'rtlcss-webpack-plugin';
import TpaStyleWebpackPlugin from 'tpa-style-webpack-plugin';
import { localIdentName } from './utils/constants';
import ExportDefaultPlugin from './export-default-plugin';
import { calculatePublicPath } from './webpack-utils';
import HtmlPolyfillPlugin from './html-polyfill-plugin';

const isProduction = checkIsProduction();
const inTeamCity = checkInTeamCity();

const disableModuleConcat = process.env.DISABLE_MODULE_CONCATENATION === 'true';

const reScript = /\.js?$/;
const reStyle = /\.(css|less|scss|sass)$/;
const reAssets = /\.(png|jpg|jpeg|gif|woff|woff2|ttf|otf|eot|wav|mp3)$/;

const staticAssetName = 'media/[name].[hash:8].[ext]';

const sassIncludePaths = ['node_modules', 'node_modules/compass-mixins/lib'];

const artifactVersion = getProjectArtifactVersion();

function prependNameWith(filename: string, prefix: string) {
  return filename.replace(/\.[0-9a-z]+$/i, match => `.${prefix}${match}`);
}

export const getStyleLoaders = ({
  name,
  embedCss = false,
  isDev = false,
  isHot = false,
  cssModules = true,
  experimentalRtlCss = false,
  separateCss = false,
  tpaStyle = false,
}: {
  name: string;
  embedCss?: boolean;
  isDev?: boolean;
  isHot?: boolean;
  cssModules?: boolean;
  experimentalRtlCss?: boolean;
  separateCss?: boolean;
  tpaStyle?: boolean;
}): Array<webpack.Rule> => {
  const cssLoaderOptions = {
    camelCase: true,
    sourceMap: separateCss,
    localIdentName: isProduction ? localIdentName.short : localIdentName.long,
    // Make sure every package has unique class names
    hashPrefix: name,
    modules: cssModules,
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
              ...(isHot
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
                    experimentalRtlCss && require('postcss-rtl')(),
                    require('autoprefixer')({
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
                  sourceMap: isDev,
                },
              },

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

        ...(tpaStyle ? [{ loader: 'wix-tpa-style-loader' }] : []),

        {
          test: /\.less$/,
          loader: 'less-loader',
          options: {
            sourceMap: embedCss,
            paths: ['.', 'node_modules'],
          },
        },

        {
          test: /\.(scss|sass)$/,
          loader: 'yoshi-style-dependencies/sass-loader',
          options: {
            sourceMap: embedCss,
            implementation: importCwd.silent(
              'yoshi-style-dependencies/node-sass',
            ),
            includePaths: sassIncludePaths,
          },
        },
      ],
    },
  ];
};

export function createBaseWebpackConfig({
  configName,
  name,
  target,
  isDev = false,
  isHot = false,
  useTypeScript = false,
  typeCheckTypeScript = false,
  useAngular = false,
  separateCss = false,
  keepFunctionNames = false,
  stylableSeparateCss = false,
  experimentalRtlCss = false,
  cssModules = true,
  cwd = process.cwd(),
  contentHash = false,
  devServerUrl,
  externalizeRelativeLodash = false,
  isAnalyze = false,
  createEjsTemplates = false,
  performanceBudget,
  includeStyleLoaders = true,
  enhancedTpaStyle = false,
  tpaStyle = false,
  forceEmitSourceMaps = false,
  exportAsLibraryName,
  nodeExternalsWhitelist = [],
}: {
  name: string;
  configName: 'client' | 'server' | 'web-worker';
  target: 'web' | 'node' | 'webworker';
  isDev?: boolean;
  isHot?: boolean;
  useTypeScript?: boolean;
  typeCheckTypeScript?: boolean;
  useAngular?: boolean;
  separateCss?: boolean;
  keepFunctionNames?: boolean;
  stylableSeparateCss?: boolean;
  experimentalRtlCss?: boolean;
  cssModules?: boolean;
  cwd?: string;
  contentHash?: boolean;
  devServerUrl: string;
  externalizeRelativeLodash?: boolean;
  isAnalyze?: boolean;
  createEjsTemplates?: boolean;
  performanceBudget?: webpack.PerformanceOptions;
  includeStyleLoaders?: boolean;
  enhancedTpaStyle?: boolean;
  tpaStyle?: boolean;
  forceEmitSourceMaps?: boolean;
  exportAsLibraryName?: string;
  nodeExternalsWhitelist?: Array<WhitelistOption>;
}): webpack.Configuration {
  const join = (...dirs: Array<string>) => path.join(cwd, ...dirs);

  const styleLoaders = getStyleLoaders({
    name,
    embedCss: target !== 'node',
    cssModules,
    isDev,
    isHot,
    experimentalRtlCss,
    separateCss,
    tpaStyle,
  });

  const publicPath = calculatePublicPath({
    cwd,
    devServerUrl,
  });

  const babelConfig = createBabelConfig({
    modules: false,
    targets: target === 'node' ? 'current node' : undefined,
  });

  const config: webpack.Configuration = {
    context: join(SRC_DIR),

    name: configName,

    target,

    mode: isProduction ? 'production' : 'development',

    output: {
      path: join(STATICS_DIR),
      publicPath,
      pathinfo: isDev,
      filename: isDev
        ? '[name].bundle.js'
        : contentHash
        ? '[name].[contenthash:8].bundle.min.js'
        : '[name].bundle.min.js',
      chunkFilename: isDev
        ? '[name].chunk.js'
        : contentHash
        ? '[name].[contenthash:8].chunk.min.js'
        : '[name].chunk.min.js',
      hotUpdateMainFilename: 'updates/[hash].hot-update.json',
      hotUpdateChunkFilename: 'updates/[id].[hash].hot-update.js',

      ...(exportAsLibraryName
        ? {
            library: exportAsLibraryName,
            libraryTarget: 'umd',
            globalObject: "(typeof self !== 'undefined' ? self : this)",
          }
        : {}),

      ...(target === 'node'
        ? {
            path: join(BUILD_DIR),
            filename: '[name].js',
            chunkFilename: 'chunks/[name].js',
            libraryTarget: 'umd',
            globalObject: "(typeof self !== 'undefined' ? self : this)",
            // Point sourcemap entries to original disk location (format as URL on Windows)
            devtoolModuleFilenameTemplate: info =>
              path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
          }
        : {}),

      // https://github.com/wix/yoshi/pull/497
      jsonpFunction: `webpackJsonp_${toIdentifier(name)}`,
    },

    resolve: {
      modules: ['node_modules', join(SRC_DIR)],
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.svelte', '.json'],
      mainFields: ['svelte', 'browser', 'module', 'main'],
    },

    resolveLoader: {
      modules: [
        path.join(__dirname, '../node_modules'),
        // Since Yoshi does not depend on every loader it uses directly, we first look
        // for loaders in `yoshi-common`'s `node_modules` and then look at the root `node_modules`
        path.join(__dirname, '../../yoshi-flow-legacy/node_modules'),
        'node_modules',
      ],
    },

    optimization:
      target !== 'node'
        ? {
            minimize: !isDev,
            concatenateModules: isProduction && !disableModuleConcat,
            minimizer: [
              new TerserPlugin({
                parallel: true,
                cache: true,
                sourceMap: true,
                terserOptions: {
                  output: {
                    ascii_only: true,
                  },
                  keep_fnames: keepFunctionNames,
                },
              }),
              new OptimizeCSSAssetsPlugin(),
            ],

            splitChunks: false,
          }
        : {
            // Do not modify/set the value of `process.env.NODE_ENV`
            nodeEnv: false,
            // Faster build time and possibly easier debugging
            minimize: false,
          },

    plugins: [
      new ModuleNotFoundPlugin(cwd),
      new CaseSensitivePathsPlugin(),

      ...(useTypeScript && typeCheckTypeScript && isDev
        ? [
            new (require('fork-ts-checker-webpack-plugin'))({
              tsconfig: join(TSCONFIG_FILE),
              async: false,
              silent: true,
              checkSyntacticErrors: true,
              formatter: require('react-dev-utils/typescriptFormatter'),
            }),
          ]
        : []),

      ...(isHot ? [new webpack.HotModuleReplacementPlugin()] : []),

      ...(target === 'web'
        ? [
            ...(createEjsTemplates && fs.pathExistsSync(join(TEMPLATES_DIR))
              ? [
                  ...globby
                    .sync('**/*.+(ejs|vm)', {
                      cwd: join(TEMPLATES_DIR),
                      absolute: true,
                    })
                    .map(templatePath => {
                      const basename = path.basename(templatePath);
                      const filename = join(TEMPLATES_BUILD_DIR, basename);

                      return new HtmlWebpackPlugin({
                        filename: isDev
                          ? prependNameWith(filename, 'debug')
                          : prependNameWith(filename, 'prod'),
                        chunks: [basename.replace(/\.[0-9a-z]+$/i, '')],
                        template: `html-loader!${templatePath}`,
                        minify: !isDev as false,
                      });
                    }),

                  new HtmlPolyfillPlugin(HtmlWebpackPlugin, [
                    buildUrl(
                      'https://static.parastorage.com/polyfill/v2/polyfill.min.js',
                      {
                        queryParams: {
                          features: ['default', 'es6', 'es7', 'es2017'],
                          flags: ['gated'],
                          unknown: 'polyfill',
                          rum: '0',
                        },
                      },
                    ),
                  ]),

                  new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
                    PUBLIC_PATH: publicPath,
                  }),
                ]
              : []),

            ...(fs.pathExistsSync(PUBLIC_DIR)
              ? [
                  new CopyPlugin([
                    { from: join(PUBLIC_DIR), to: join(ASSETS_DIR) },
                  ]),
                ]
              : []),

            new webpack.LoaderOptionsPlugin({
              minimize: !isDev,
            }),

            ...(separateCss
              ? [
                  new MiniCssExtractPlugin({
                    filename: isDev
                      ? '[name].css'
                      : contentHash
                      ? '[name].[contenthash:8].min.css'
                      : '[name].min.css',
                    chunkFilename: isDev
                      ? '[name].chunk.css'
                      : contentHash
                      ? '[name].[contenthash:8].chunk.min.css'
                      : '[name].chunk.min.css',
                  }),

                  ...(enhancedTpaStyle
                    ? [
                        // @ts-ignore
                        new TpaStyleWebpackPlugin(),
                      ]
                    : []),

                  ...(!createEjsTemplates && !experimentalRtlCss
                    ? [
                        new RtlCssPlugin(
                          isDev ? '[name].rtl.css' : '[name].rtl.min.css',
                        ),
                      ]
                    : []),
                ]
              : []),

            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

            new StylableWebpackPlugin({
              outputCSS: stylableSeparateCss,
              filename: '[name].stylable.bundle.css',
              includeCSSInJS: !stylableSeparateCss,
              optimize: {
                classNameOptimizations: false,
                shortNamespaces: false,
              },
              runtimeMode: 'shared',
              globalRuntimeId: '__stylable_yoshi__',
              generate: {
                runtimeStylesheetId: 'namespace',
              },
              resolveNamespace: resolveNamespaceFactory(name),
            }),

            new ManifestPlugin({
              fileName: inTeamCity
                ? `${artifactVersion}/manifest.${isDev ? 'debug' : 'prod'}.json`
                : `manifest.dev.json`,
              filter: ({
                isModuleAsset,
                isInitial,
                path: filePath,
              }: {
                isModuleAsset: boolean;
                isInitial: boolean;
                path: string;
              }) =>
                // Do not include assets
                !isModuleAsset &&
                // Only initial chunks included
                isInitial &&
                !filePath.endsWith('.rtl.min.css') &&
                !filePath.endsWith('.rtl.css') &&
                !filePath.endsWith('.map'),
            }),
          ]
        : []),

      new webpack.DefinePlugin({
        ...(target !== 'node'
          ? {
              'process.env.NODE_ENV': JSON.stringify(
                isProduction ? 'production' : 'development',
              ),
              'process.env.IS_MINIFIED': isDev ? 'false' : 'true',
              'window.__CI_APP_VERSION__': JSON.stringify(
                process.env.ARTIFACT_VERSION
                  ? process.env.ARTIFACT_VERSION
                  : '0.0.0',
              ),
              'process.env.ARTIFACT_ID': JSON.stringify(getProjectArtifactId()),
            }
          : {}),
        'process.env.browser': JSON.stringify(target !== 'node'),
      }),

      ...(target === 'node'
        ? [
            new ExportDefaultPlugin(),

            new webpack.BannerPlugin({
              banner: fs.readFileSync(
                path.join(__dirname, 'utils/source-map-support.js'),
                'utf-8',
              ),
              raw: true,
              entryOnly: false,
            }),
          ]
        : []),

      ...(isAnalyze
        ? [
            new BundleAnalyzerPlugin({
              openAnalyzer: process.env.BROWSER !== 'none',
            }),
          ]
        : []),
    ],

    module: {
      // Makes missing exports an error instead of warning
      strictExportPresence: true,

      rules: [
        ...(includeStyleLoaders ? styleLoaders : []),

        ...(externalizeRelativeLodash
          ? [
              {
                test: /[\\/]node_modules[\\/]lodash/,
                loader: 'externalize-relative-module-loader',
              },
            ]
          : []),

        {
          test: /\.svelte$/,
          // Both, `svelte-loader` and `svelte-preprocess-sass` should be installed
          // by the project that needs it.
          //
          // If more users use `svelte` we'll consider adding it to everyone by default.
          loader: 'svelte-loader',
          options: {
            hydratable: true,
            // https://github.com/sveltejs/svelte-loader/issues/67
            onwarn: (warning: any, onwarn: any) => {
              warning.code === 'css-unused-selector' || onwarn(warning);
            },
            preprocess: {
              style:
                importCwd.silent('svelte-preprocess-sass') &&
                (importCwd.silent('svelte-preprocess-sass') as any).sass({
                  includePaths: sassIncludePaths,
                }),
            },
            dev: isDev,
            emitCss: target !== 'node',
            generate: target === 'node' ? 'ssr' : 'dom',
          },
        },

        ...(useAngular
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

        {
          test: /\.(ts|tsx)$/,
          include: unprocessedModules,
          use: [
            {
              loader: 'thread-loader',
              options: {
                workers: os.cpus().length - 1,
              },
            },

            ...(useAngular
              ? [{ loader: 'yoshi-angular-dependencies/ng-annotate-loader' }]
              : []),

            {
              loader: 'ts-loader',
              options: {
                happyPackMode: true,
                compilerOptions: useAngular
                  ? {}
                  : {
                      module: 'esnext',
                      moduleResolution: 'node',
                      ...(process.env.NODE_ENV === 'development'
                        ? {
                            lib: ['es2017'],
                            target: 'es2017',
                          }
                        : {}),
                    },
              },
            },
          ],
        },

        {
          test: reScript,
          include: unprocessedModules,
          // Optimize JS processing worker stuff excluded due to
          // https://github.com/webpack-contrib/worker-loader/issues/177
          exclude: /\.inline\.worker\.js/,
          use: [
            {
              loader: 'thread-loader',
              options: {
                workers: os.cpus().length - 1,
              },
            },
          ],
        },

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

        {
          oneOf: [
            {
              test: /\.inline\.svg$/,
              loader: 'svg-inline-loader',
            },

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
              loader: 'carmi/loader',
            },

            {
              test: /\.md$/,
              loader: 'raw-loader',
            },

            {
              test: /\.haml$/,
              loader: 'ruby-haml-loader',
            },

            {
              test: /\.html$/,
              loader: 'html-loader',
            },

            {
              test: /\.(graphql|gql)$/,
              loader: 'graphql-tag/loader',
            },

            {
              test: reAssets,
              loader: 'url-loader',
              options: {
                name: staticAssetName,
                limit: 10000,
                emitFile: target !== 'node',
              },
            },
          ],
        },
      ],
    },

    stats: 'none',

    node:
      target !== 'node'
        ? {
            fs: 'empty',
            net: 'empty',
            tls: 'empty',
            __dirname: true,
          }
        : {
            console: false,
            global: false,
            process: false,
            Buffer: false,
            __filename: false,
            __dirname: false,
          },

    devtool:
      target !== 'node'
        ? inTeamCity || forceEmitSourceMaps
          ? 'source-map'
          : !isProduction
          ? 'cheap-module-eval-source-map'
          : false
        : 'inline-source-map',

    ...(target === 'node'
      ? {
          externals: [
            nodeExternals({
              whitelist: [
                reStyle,
                reAssets,
                /bootstrap-hot-loader/,
                /yoshi-server/,
                // Temporary work-around for thunderbolt
                /thunderbolt-elements/,
                ...nodeExternalsWhitelist,
              ],
            }),
            // Local integration tests as Yoshi's `node_modules` are symlinked locally
            nodeExternals({
              modulesDir: path.resolve(__dirname, '../node_modules'),
            }),
          ],
        }
      : {}),

    ...(target === 'web'
      ? {
          performance: {
            ...(isProduction
              ? performanceBudget || { hints: false }
              : {
                  hints: false,
                }),
          },
        }
      : {}),
  };

  return config;
}
