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
    importLoaders:
      3 /* postcss, sass-loader, resolve url loader (so composition will work with import) */ +
      Number(tpaStyle),
  };

  const sassLoaderOptions = {
    sourceMap: true,
    includePaths: ['node_modules', 'node_modules/compass-mixins/lib'],
  };

  const globalRegex = /\.global\.s?css$/;

  const getScssRule = (ruleConfig, loaderConfig) =>
    merge(ruleConfig, {
      test: /\.s?css$/,
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
          {
            loader: 'resolve-url-loader',
            options: { attempts: 1 },
          },
          ...(tpaStyle ? ['wix-tpa-style-loader'] : []),
          {
            loader: 'sass-loader',
            options: sassLoaderOptions,
          },
        ],
      ),
    });

  return {
    client: [
      getScssRule(
        { include: globalRegex, exclude: /\.st\.css$/ },
        { modules: false },
      ),
      getScssRule({ exclude: [globalRegex, /\.st\.css$/] }),
    ],
    specs: {
      test: /\.s?css$/,
      exclude: /\.st\.css$/,
      use: [
        {
          loader: 'css-loader/locals',
          options: cssLoaderOptions,
        },
        ...(tpaStyle ? ['wix-tpa-style-loader'] : []),
        {
          loader: 'sass-loader',
          options: sassLoaderOptions,
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
