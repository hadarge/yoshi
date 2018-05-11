const path = require('path');
const { merge } = require('lodash/fp');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { cssModulesPattren } = require('yoshi-runtime');

module.exports = ({ separateCss, cssModules, tpaStyle, projectName, hmr }) => {
  const cssLoaderOptions = {
    camelCase: true,
    sourceMap: !!separateCss,
    localIdentName: cssModulesPattren(),
    hashPrefix: projectName,
    modules: cssModules,
    importLoaders: tpaStyle ? 4 : 3,
  };

  const lessLoaderOptions = {
    sourceMap: true,
    paths: ['.', 'node_modules'],
  };

  const globalRegex = /\.global.less$/;

  const getLessRule = (ruleConfig, loaderConfig) =>
    merge(ruleConfig, {
      test: /\.less$/,
      use: clientLoader(
        separateCss,
        hmr,
        { loader: 'style-loader', options: { singleton: true } },
        [
          {
            loader: 'css-loader',
            options: merge(cssLoaderOptions, loaderConfig),
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.join(
                  __dirname,
                  '..',
                  '..',
                  'config',
                  'postcss.config.js',
                ),
              },
              sourceMap: true,
            },
          },
          ...(tpaStyle ? ['wix-tpa-style-loader'] : []),
          {
            loader: 'less-loader',
            options: lessLoaderOptions,
          },
        ],
      ),
    });

  return {
    client: [
      getLessRule(
        { include: globalRegex, exclude: /\.st\.css$/ },
        { modules: false },
      ),
      getLessRule({ exclude: [globalRegex, /\.st\.css$/] }),
    ],
    specs: {
      test: /\.less$/,
      exclude: /\.st\.css$/,
      use: [
        {
          loader: 'css-loader/locals',
          options: cssLoaderOptions,
        },
        ...(tpaStyle ? ['wix-tpa-style-loader'] : []),
        {
          loader: 'less-loader',
          options: lessLoaderOptions,
        },
      ],
    },
  };
};

function clientLoader(separateCss, hmr, l1, l2) {
  const fallbackLoader = separateCss ? MiniCssExtractPlugin.loader : l1;
  const hmrLoader = hmr ? ['css-hot-loader'] : [];
  return hmrLoader.concat(fallbackLoader).concat(l2);
}
