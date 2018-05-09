const fs = require('fs');
const path = require('path');
const graphqlLoader = require('graphql-tag/loader');
const { noop } = require('lodash');
const {
  stylableToModuleFactory,
} = require('stylable-integration/dist/src/stylable-to-module-factory');

const stylableToModule = stylableToModuleFactory(fs, require, null);

require.extensions['.css'] = mockCss;
require.extensions['.scss'] = mockCssModules;
require.extensions['.less'] = mockCssModules;

require.extensions['.graphql'] = loadGraphQLModules;
require.extensions['.gql'] = loadGraphQLModules;

require.extensions['.png'] = mockMediaModules;
require.extensions['.svg'] = mockMediaModules;
require.extensions['.jpg'] = mockMediaModules;
require.extensions['.jpeg'] = mockMediaModules;
require.extensions['.gif'] = mockMediaModules;

require.extensions['.wav'] = mockMediaModules;
require.extensions['.mp3'] = mockMediaModules;

function mockCss(module, filename) {
  return module.filename.endsWith('.st.css')
    ? mockStylable(module, filename)
    : mockCssModules(module);
}

function mockStylable(module, filename) {
  const source = fs.readFileSync(filename).toString();
  const code = stylableToModule(source, filename);
  return module._compile(code, filename);
}

function mockCssModules(module) {
  module.exports = conditionedProxy(name => name === 'default');
}

function conditionedProxy(predicate = () => {}) {
  return new Proxy(
    {},
    {
      get: (target, name) => (predicate(name) ? conditionedProxy() : name),
    },
  );
}

function loadGraphQLModules(module) {
  const query = fs.readFileSync(module.filename, 'utf-8');
  const scopedLoader = graphqlLoader.bind({ cacheable: noop });
  const output = scopedLoader(query);
  module.exports = eval(output); // eslint-disable-line no-eval
}

function mockMediaModules(module) {
  module.exports = path.basename(module.filename);
}
