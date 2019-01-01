const { expect } = require('chai');
const uniq = require('lodash/uniq');
const buildStoryBookConfig = require('../config/webpack.config.storybook');
const { createCommonWebpackConfig } = require('../config/webpack.config');

const commonConfig = createCommonWebpackConfig({ isDebug: true });

describe('Webpack config storybook', () => {
  let originalConfig;
  let resultConfig;

  beforeEach(() => {
    originalConfig = {
      resolve: {
        extensions: ['.js', '.jsx', '.abc'],
      },
      module: {},
      node: {
        net: true,
      },
    };
  });

  beforeEach(() => {
    resultConfig = buildStoryBookConfig(originalConfig);
  });

  describe('Extensions', () => {
    it('should add all the extensions from the common config', () => {
      const expectedExtensions = commonConfig.resolve.extensions;
      expect(resultConfig.resolve.extensions).to.include.members(
        expectedExtensions,
      );
    });

    it('should NOT add duplicate extensions', () => {
      const uniqueOccurrences = uniq(resultConfig.resolve.extensions).length;
      expect(resultConfig.resolve.extensions.length).to.equal(
        uniqueOccurrences,
      );
    });

    it('should keep the original extensions', () => {
      expect(resultConfig.resolve.extensions).to.include('.abc');
    });
  });

  describe('Node lib mocks', () => {
    it('should add all the node lib mock definitions from common config', () => {
      expect(resultConfig.node).to.eql({
        ...commonConfig.node,
        net: true,
      });
    });
  });
});
