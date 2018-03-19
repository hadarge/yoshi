const {expect} = require('chai');
const {cleanMocks, mockEnvironment, mockCI} = require('./test-utils');
const {create} = require('./test-phases');
const {cssModulesPattren, patterns} = require('../index');

const {short: shortPattern, long: longPattern} = patterns;

describe('CSS modules pattern', () => {

  afterEach(() => cleanMocks());

  it('should return short pattern for production mode', () => {
    mockEnvironment({production: true});
    mockCI({ci: false});
    expect(cssModulesPattren()).to.equal(shortPattern);
  });

  it('should return long pattern for local mode', () => {
    mockEnvironment({production: false});
    mockCI({ci: false});
    expect(cssModulesPattren()).to.equal(longPattern);
  });

  it('should return short pattern in CI', () => {
    mockEnvironment({production: false});
    mockCI({ci: true});
    expect(cssModulesPattren()).to.equal(shortPattern);
  });
});

describe('CSS modules runtime', () => {
  const generateCssModulesPattern = (name, path, pattern = shortPattern) => {
    const genericNames = require('generic-names');
    const generate = genericNames(pattern, {hashPrefix: 'pkg'});
    return generate(name, path);
  };

  afterEach(() => {
    cleanMocks();
  });

  it('should generate css modules', () => {
    mockEnvironment({production: true});
    const hash = generateCssModulesPattern('a', 'styles/my-file.css');
    const expectedCssMap = `{ a: '${hash}' }\n`;
    const myTest = create('dist/src/index');
    const res = myTest
      .setup({
        'dist/src/index.js': `const {wixCssModulesRequireHook} = require('${require.resolve('../index')}');
          wixCssModulesRequireHook('./dist/src');
          const s = require('./styles/my-file.css')
          console.log(s);
        `,
        'dist/src/styles/my-file.css': `.a {color: red;}`,
        'package.json': '{"name": "pkg"}'
      })
      .execute('');
    expect(res.code).to.equal(0);
    expect(res.stdout).to.equal(expectedCssMap);
    myTest.teardown();
  });

  it('should allow custom config', () => {
    mockEnvironment({production: true});
    const hash = generateCssModulesPattern('class-name', 'styles/my-file.css');
    const expectedCssMap = `{ 'class-name': '${hash}' }\n`;
    const myTest = create('dist/src/index');
    const res = myTest
      .setup({
        'dist/src/index.js': `const {wixCssModulesRequireHook} = require('${require.resolve('../index')}');
          wixCssModulesRequireHook('./dist/src', {
            camelCase: false
          });
          const s = require('./styles/my-file.css')
          console.log(s);
        `,
        'dist/src/styles/my-file.css': `.class-name {color: red;}`,
        'package.json': '{"name": "pkg"}'
      })
      .execute('');
    expect(res.code).to.equal(0);
    expect(res.stdout).to.equal(expectedCssMap);
    myTest.teardown();
  });

  it('should generate css modules with default rootDir', () => {
    mockEnvironment({production: true});
    const hash = generateCssModulesPattern('a', 'styles/my-file.css');
    const expectedCssMap = `{ a: '${hash}' }\n`;
    const myTest = create('dist/src/index');
    const res = myTest
      .setup({
        'dist/src/index.js': `const {wixCssModulesRequireHook} = require('${require.resolve('../index')}');
          wixCssModulesRequireHook();
          const s = require('./styles/my-file.css')
          console.log(s);
        `,
        'dist/src/styles/my-file.css': `.a {color: red;}`,
        'package.json': '{"name": "pkg"}'
      })
      .execute('');

    expect(res.code).to.equal(0);
    expect(res.stdout).to.equal(expectedCssMap);
    myTest.teardown();
  });

  it('should generate css modules for node_modules', () => {
    mockEnvironment({production: true});
    const hash = generateCssModulesPattern('a', '../node_modules/module/styles/my-file.css');
    const expectedCssMap = `{ a: '${hash}' }\n`;
    const myTest = create('dist/src/index');
    const res = myTest
      .setup({
        'dist/src/index.js': `const {wixCssModulesRequireHook} = require('${require.resolve('../index')}');
          wixCssModulesRequireHook('./dist/src');
          const s = require('module/styles/my-file.css')
          console.log(s);
        `,
        'node_modules/module/styles/my-file.css': `.a {color: red;}`,
        'package.json': '{"name": "pkg"}'
      })
      .execute('');

    expect(res.code).to.equal(0);
    expect(res.stdout).to.equal(expectedCssMap);
    myTest.teardown();
  });

  describe('Long CSS pattern FT', () => {
    it('should generate css modules with long pattern when toggled', () => {
      mockEnvironment({production: true});
      const hash = generateCssModulesPattern('a', 'styles/my-file.css', longPattern);
      const expectedCssMap = `{ a: '${hash}' }\n`;
      const myTest = create('dist/src/index');
      const res = myTest
        .setup({
          'dist/src/index.js': `const {wixCssModulesRequireHook} = require('${require.resolve('../index')}');
          wixCssModulesRequireHook('./dist/src');
          const s = require('./styles/my-file.css')
          console.log(s);
        `,
          'dist/src/styles/my-file.css': `.a {color: red;}`,
          'package.json': '{"name": "pkg"}'
        })
      .execute('', [], {NODE_ENV: 'production', LONG_CSS_PATTERN: true});

      expect(res.code).to.equal(0);
      expect(res.stdout).to.equal(expectedCssMap);
      myTest.teardown();
    });
  });
});
