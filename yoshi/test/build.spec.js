const expect = require('chai').expect;
const tp = require('./helpers/test-phases');
const fx = require('./helpers/fixtures');
const hooks = require('./helpers/hooks');
const getMockedCI = require('./helpers/get-mocked-ci');
const {outsideTeamCity, insideTeamCity} = require('./helpers/env-variables');
const retryPromise = require('retry-promise').default;
const fetch = require('node-fetch');

describe('Aggregator: Build', () => {
  const defaultOutput = 'statics';
  let test;

  beforeEach(() => test = tp.create());
  afterEach(() => test.teardown());

  describe('yoshi-sass', () => {
    it('should use yoshi-sass', () => {
      const compiledStyle = '.a .b {\n  color: red; }';
      const resp = test
        .setup({
          'src/client.js': '',
          'app/a/style.scss': fx.scss(),
          'src/b/style.scss': fx.scss(),
          'test/c/style.scss': fx.scss(),
          'package.json': fx.packageJson()
        })
        .execute('build');
      expect(resp.code).to.equal(0);
      expect(resp.stdout).to.contain(`Finished 'sass'`);
      expect(test.content('dist/app/a/style.scss')).to.contain(compiledStyle);
      expect(test.content('dist/src/b/style.scss')).to.contain(compiledStyle);
      expect(test.content('dist/test/c/style.scss')).to.contain(compiledStyle);
    });

    it('should fail with exit code 1', () => {
      const resp = test
        .setup({
          'src/client.js': '',
          'app/a/style.scss': fx.scssInvalid(),
          'package.json': fx.packageJson()
        })
        .execute('build');

      expect(resp.code).to.equal(1);
      expect(resp.stdout).to.contain(`Failed 'sass'`);
      expect(resp.stderr).to.contain('Invalid CSS after ".a {');
    });
  });

  describe('with --analyze flag', () => {
    it('should serve webpack-bundle-analyzer server', () => {
      const analyzerServerPort = '8888';
      const analyzerContentPart = 'window.chartData = [{"label":"app.bundle.min.js"';
      test
        .setup({
          'src/client.js': '',
          'package.json': fx.packageJson()
        })
        .spawn('build', ['--analyze']);

      return checkServerIsServing({port: analyzerServerPort})
        .then(content => expect(content).to.contain(analyzerContentPart));
    });
  });

  describe('Less', () => {
    it('should transpile to dist/, preserve folder structure, extensions and exit with code 0', () => {
      const compiledStyle = '.a .b {\n  color: red;\n}';
      const resp = test
        .setup({
          'src/client.js': '',
          'app/a/style.less': '.a {\n.b {\ncolor: red;\n}\n}\n',
          'src/b/style.less': '.a {\n.b {\ncolor: red;\n}\n}\n',
          'test/c/style.less': '.a {\n.b {\ncolor: red;\n}\n}\n',
          'package.json': fx.packageJson()
        })
        .execute('build');

      expect(resp.code).to.equal(0);
      expect(resp.stdout).to.contain(`Finished 'less'`);
      expect(test.content('dist/app/a/style.less')).to.contain(compiledStyle);
      expect(test.content('dist/src/b/style.less')).to.contain(compiledStyle);
      expect(test.content('dist/test/c/style.less')).to.contain(compiledStyle);
    });

    it('should disable css modules for .global.less files', () => {
      const res = test
        .setup({
          'src/client.js': 'require(\'./styles/my-file.global.less\');',
          'src/styles/my-file.global.less': `.a {.b {color: red;}}`,
          'package.json': fx.packageJson({
            separateCss: true
          }),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.content(`dist/${defaultOutput}/app.css`)).to.contain('.a .b {');
    });

    it('should fail with exit code 1', () => {
      const resp = test
        .setup({
          'src/client.js': '',
          'app/a/style.less': '.a {\n.b\ncolor: red;\n}\n}\n',
          'package.json': fx.packageJson()
        })
        .execute('build');

      expect(resp.code).to.equal(1);
      expect(resp.stdout).to.contain(`Failed 'less'`);
      expect(resp.stderr).to.contain(`Unrecognised input`);
    });

    it('should handle @import statements', () => {
      const resp = test
        .setup({
          'src/client.js': '',
          'src/style.less': `@import (once) './foobar.less';`,
          'src/foobar.less': `.a { color: black; }`,
          'package.json': fx.packageJson()
        })
        .execute('build');

      expect(resp.code).to.equal(0);
      expect(resp.stdout).to.contain(`Finished 'less'`);
      expect(test.content('dist/src/style.less')).to.contain('.a {\n  color: black;\n}');
    });

    it('should consider node_modules for path', () => {
      const resp = test
        .setup({
          'src/client.js': '',
          'node_modules/some-module/style.less': `.a { color: black; }`,
          'src/a/style.less': `@import (once) 'some-module/style.less';`,
          'package.json': fx.packageJson()
        })
        .execute('build');

      expect(resp.code).to.equal(0);
      expect(resp.stdout).to.contain(`Finished 'less'`);
      expect(test.content('dist/src/a/style.less')).to.contain('.a {\n  color: black;\n}');
    });
  });

  describe('yoshi-babel', () => {
    it('should use yoshi-babel', () => {
      const resp = test
        .setup({
          '.babelrc': '{}',
          'app/b.jsx': 'const b = 2;',
          'src/a/a.js': 'const a = 1;',
          'test/a/a.spec.js': 'const test = \'test\';',
          'testkit/a.js': 'const a = 1;',
          'bin/a.js': 'const a = 1;',
          'index.js': 'const name = \'name\';',
          'package.json': fx.packageJson(),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(resp.stdout).to.contain(`Finished 'babel'`);
      expect(resp.code).to.equal(0);
      expect(test.list('dist')).to.include.members(['src', 'app', 'test', 'testkit', 'bin', 'index.js']);
    });

    it('should fail with exit code 1', () => {
      const resp = test
        .setup({
          '.babelrc': '{}',
          'src/a.js': 'function ()',
          'package.json': fx.packageJson(),
          'pom.xml': fx.pom()
        })
        .execute('build');
      expect(resp.code).to.equal(1);
      expect(resp.stderr).to.contain('Unexpected token (1:9)');
      expect(resp.stderr).to.contain('1 | function ()');
    });
  });

  describe('yoshi-typescript', () => {
    it('should use yoshi-typescript', () => {
      const resp = test
        .setup({
          'app/a.ts': 'const a = 1;',
          'app/b.tsx': 'const b = 2',
          'tsconfig.json': fx.tsconfig(),
          'package.json': fx.packageJson(),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(resp.stdout).to.contain(`Finished 'typescript'`);
      expect(resp.code).to.equal(0);
      expect(test.content('dist/app/a.js')).to.contain('var a = 1');
      expect(test.content('dist/app/b.js')).to.contain('var b = 2');
    });

    it('should fail with exit code 1', () => {
      const resp = test
        .setup({
          'src/a.ts': 'function ()',
          'tsconfig.json': fx.tsconfig(),
          'package.json': fx.packageJson(),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(resp.code).to.equal(1);
      expect(resp.stderr).to.contain('error TS1003: Identifier expected');
    });

    it('should not transpile with babel if there is tsconfig', () => {
      const resp = test
        .setup({
          'src/a.js': 'const a = 1;',
          'src/b.ts': 'const b = 2;',
          'tsconfig.json': fx.tsconfig(),
          '.babelrc': `{"plugins": ["${require.resolve('babel-plugin-transform-es2015-block-scoping')}"]}`,
          'pom.xml': fx.pom(),
          'package.json': `{
              "name": "a",\n
              "version": "1.0.4",\n
              "yoshi": {
                "entry": "./a.js"
              }}`

        })
        .execute('build');

      expect(resp.code).to.equal(0);
      expect(test.list('dist/src')).not.to.contain('a.js');
      expect(test.content('dist/src/b.js')).to.contain('var b = 2');
    });
  });

  describe('No individual transpilation', () => {
    it('should not transpile if no tsconfig/babelrc', () => {
      const resp = test
        .setup({
          'src/b.ts': 'const b = 2;',
          'src/a/a.js': 'const a = 1;',
          'package.json': fx.packageJson()
        })
        .execute('build');

      expect(resp.stdout).to.not.contain(`Finished 'babel'`);
      expect(resp.code).to.equal(0);
      expect(test.list('/')).not.to.include('dist');
    });

    it('should not transpile if runIndividualTranspiler = false', () => {
      const resp = test
        .setup({
          '.babelrc': '{}',
          'src/b.ts': 'const b = 2;',
          'src/a/a.js': 'const a = 1;',
          'package.json': fx.packageJson({
            runIndividualTranspiler: false
          })
        })
        .execute('build');

      expect(resp.stdout).to.not.contain(`Finished 'babel'`);
      expect(resp.code).to.equal(0);
      expect(test.list('/')).not.to.include('dist');
    });
  });

  describe('Commons chunk plugin', () => {
    it('should generate an additional commons.bundle.js when commonsChunks option in package.json is true, commons chunk should have the common parts and the other chunks should not', () => {
      const res = test
        .setup({
          'src/dep.js': `module.exports = function(a){return a + 1;};`,
          'src/app1.js': `const thisIsWorks = true; const aFunction = require('./dep');const a = aFunction(1);`,
          'src/app2.js': `const hello = "world"; const aFunction = require('./dep');const a = aFunction(1);`,
          'package.json': fx.packageJson({
            commonsChunk: true,
            entry: {
              first: './app1.js',
              second: './app2.js'
            }
          }),
          'pom.xml': fx.pom()
        })
        .execute('build');
      expect(res.code).to.equal(0);
      expect(test.list('dist/statics')).to.contain('first.bundle.js');
      expect(test.list('dist/statics')).to.contain('second.bundle.js');
      expect(test.list('dist/statics')).to.contain('commons.bundle.js');
      expect(test.list('dist/statics')).to.contain('commons.bundle.min.js');
      expect(test.list('dist/statics')).to.contain('commons.bundle.js.map');
      expect(test.content('dist/statics/commons.bundle.js')).to.contain('module.exports = function (a) {\n  return a + 1;\n};');
      expect(test.content('dist/statics/first.bundle.js')).to.not.contain('module.exports = function (a) {\n  return a + 1;\n};');
      expect(test.content('dist/statics/second.bundle.js')).to.not.contain('module.exports = function (a) {\n  return a + 1;\n};');
    });

    it('should add commons.css if there is any common css/scss required, the common css should be in the commons.css chunk while not in the other chunks', () => {
      const res = test
        .setup({
          'src/styles.scss': `body { background: red; }`,
          'src/first.scss': `div { background: blue; }`,
          'src/second.scss': `div { background: yellow; }`,
          'src/app1.js': `const thisIsWorks = true; require('./first.scss'); require('./styles.scss');`,
          'src/app2.js': `const hello = "world"; require('./second.scss'); require('./styles.scss');`,
          'package.json': fx.packageJson({
            commonsChunk: true,
            entry: {
              first: './app1.js',
              second: './app2.js'
            }
          }),
          'pom.xml': fx.pom()
        })
        .execute('build');
      expect(res.code).to.equal(0);
      expect(test.list('dist/statics')).to.contain('first.css');
      expect(test.list('dist/statics')).to.contain('second.css');
      expect(test.list('dist/statics')).to.contain('commons.css');
      expect(test.list('dist/statics')).to.contain('commons.min.css');
      expect(test.list('dist/statics')).to.contain('commons.css.map');
      expect(test.content('dist/statics/commons.css')).to.contain('body {\n  background: red; }');
      expect(test.content('dist/statics/first.css')).to.not.contain('body {\n  background: red; }');
      expect(test.content('dist/statics/second.css')).to.not.contain('body {\n  background: red; }');
    });

    it('should pass a custom configuration if an object is passed to the commonsChunk configuration', () => {
      const res = test
        .setup({
          'src/dep.js': `module.exports = function(a){return a + 1;};`,
          'src/app1.js': `const thisIsWorks = true; const aFunction = require('./dep');const a = aFunction(1);`,
          'src/app2.js': `const hello = "world"; const aFunction = require('./dep');const a = aFunction(1);`,
          'package.json': fx.packageJson({
            commonsChunk: {
              name: 'myCustomCommonsName',
              minChunks: 2,
            },
            entry: {
              first: './app1.js',
              second: './app2.js'
            }
          }),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.list('dist/statics')).to.not.contain('commons.bundle.js');
      expect(test.list('dist/statics')).to.contain('myCustomCommonsName.bundle.js');
    });
  });

  describe('Bundle', () => {
    ['fs', 'net', 'tls'].forEach(moduleName => {
      it(`should not fail to require node built-ins such as ${moduleName}`, () => {
        const res = test
          .setup({
            'src/client.js': `require('${moduleName}');`,
            'package.json': fx.packageJson(),
            'pom.xml': fx.pom()
          })
          .execute('build');

        expect(res.code).to.equal(0);
      });
    });

    it('should generate a bundle', () => {
      const res = test
        .setup({
          'src/client.js': `const aFunction = require('./dep');const a = aFunction(1);`,
          'src/dep.js': `module.exports = function(a){return a + 1;};`,
          'package.json': fx.packageJson(),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.list('dist/statics')).to.contain('app.bundle.js');
      expect(test.content('dist/statics/app.bundle.js')).to.contain('const a = aFunction(1);');
      expect(test.content('dist/statics/app.bundle.js')).to.contain('module.exports = function (a)');
    });

    it('should fail with exit code 1', () => {
      const res = test
        .setup({
          'src/client.js': `const aFunction = require('./dep');const a = aFunction(1);`,
          'src/dep.js': `module.exports = a => {`,
          'package.json': fx.packageJson(),
          'pom.xml': fx.pom()
        })
        .execute('build');
      expect(res.code).to.equal(1);
      expect(res.stdout).to.contain('Module build failed:');
      expect(res.stderr).to.contain('Unexpected token (2:0)');
    });

    it('should generate a bundle using different entry', () => {
      const res = test
        .setup({
          'src/app-final.js': `const aFunction = require('./dep');const a = aFunction(1);`,
          'src/dep.js': `module.exports = function(a){return a + 1;};`,
          'package.json': fx.packageJson({
            entry: './app-final.js'
          }),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.list('dist/statics').indexOf('app.bundle.js')).to.be.at.least(0);
      expect(test.content('dist/statics/app.bundle.js')).to.contain('const a = aFunction(1);');
      expect(test.content('dist/statics/app.bundle.js')).to.contain('module.exports = function (a)');
    });

    it('should support single entry point in package.json', () => {
      const res = test
        .setup({
          'src/app1.js': `const thisIsWorks = true;`,
          'package.json': fx.packageJson({
            entry: './app1.js'
          }),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.content('dist/statics/app.bundle.js')).to.contain('thisIsWorks');
    });

    it('should support multiple entry points in package.json', () => {
      const res = test
        .setup({
          'src/app1.js': `const thisIsWorks = true;`,
          'src/app2.js': `const hello = "world";`,
          'package.json': fx.packageJson({
            entry: {
              first: './app1.js',
              second: './app2.js'
            }
          }),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.content('dist/statics/first.bundle.js')).to.contain('thisIsWorks');
      expect(test.content('dist/statics/second.bundle.js')).to.contain('const hello');
    });

    it('should create sourceMaps for both bundle and specs', () => {
      const res = test
        .setup({
          'src/app.js': `const thisIsWorks = true;`,
          'src/app.spec.js': `const thisIsWorksAgain = true;`,
          'package.json': fx.packageJson({
            entry: './app.js'
          }),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(res.code).to.equal(0);

      expect(test.content('dist/statics/app.bundle.js')).to.contain('thisIsWorks');
      expect(test.list('dist/statics')).to.contain('app.bundle.js.map');
    });

    it('should bundle the app given importing json file', () => {
      test
        .setup({
          'src/app.js': `require('./some.json')`,
          'src/some.json': `{"json-content": 42}`,
          'package.json': fx.packageJson({
            entry: './app.js'
          }),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(test.content('dist/statics/app.bundle.js')).to.contain(`"json-content":42`);
    });

    it('should consider babel\'s sourceMaps for bundle', function () {
      this.timeout(120000); // 2min, may be even shorter

      const res = test
        .setup({
          'src/app.js': `const thisIsWorks = true;`,
          'src/app.spec.js': `const thisIsWorksAgain = true;`,
          '.babelrc': `{"plugins": ["${require.resolve('babel-plugin-transform-es2015-block-scoping')}"]}`,
          'pom.xml': fx.pom(),
          'package.json': `{\n
              "name": "a",\n
              "version": "1.0.4",\n
              "yoshi": {
                "entry": "./app.js"
              }
            }`
        })
        .execute('build');

      expect(res.code).to.equal(0);

      expect(test.content('dist/statics/app.bundle.js')).to.contain('var thisIsWorks');
      expect(test.content('dist/statics/app.bundle.js.map')).to.contain('const thisIsWorks');
    });

    it('should generate bundle if entry is a typescript file', () => {
      const res = test
        .setup({
          'src/app.ts': 'console.log("hello");',
          'tsconfig.json': fx.tsconfig(),
          'package.json': fx.packageJson({
            entry: './app.ts'
          }),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.list('dist/statics')).to.contain('app.bundle.js');
    });

    it('should generate bundle if entry extension is omitted by looking for existing .ts or .js files', () => {
      const res = test
        .setup({
          'src/app.ts': 'console.log("hello");',
          'tsconfig.json': fx.tsconfig(),
          'package.json': fx.packageJson({
            entry: './app'
          }),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.list('dist/statics')).to.contain('app.bundle.js');
    });

    it('should allow generating a bundle by default with both .js and .ts extensions', () => {
      const res = test
        .setup({
          'src/client.ts': 'console.log("hello");',
          'tsconfig.json': fx.tsconfig(),
          'package.json': fx.packageJson(),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.list('dist/statics')).to.contain('app.bundle.js');
    });

    it('should generate stats files', () => {
      const res = test
        .setup({
          'src/client.js': 'console.log("hello");',
          'package.json': fx.packageJson(),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.list('target')).to.contain('webpack-stats.prod.json');
      expect(test.list('target')).to.contain('webpack-stats.dev.json');
    });

    describe('moment js', () => {
      it('should ignore locale modules from within moment', () => {
        const res = test
          .setup({
            'src/client.js': `import 'moment';`,
            'node_modules/moment/index.js': `function load() {return require('./locale/' + lang);}`,
            'node_modules/moment/locale/en.js': `module.exports = 'english'`,
            'package.json': fx.packageJson(),
            'pom.xml': fx.pom()
          })
          .execute('build');

        expect(res.code).to.equal(0);
        expect(test.list('dist/statics')).to.contain('app.bundle.js');
        expect(test.content('dist/statics/app.bundle.js')).not.to.contain('english');
      });

      it('should bundle locale modules from outside of moment', () => {
        const res = test
          .setup({
            'src/client.js': `require('moment/locale/en')`,
            'node_modules/moment/locale/en.js': `module.exports = 'english';`,
            'package.json': fx.packageJson(),
            'pom.xml': fx.pom()
          })
          .execute('build');

        expect(res.code).to.equal(0);
        expect(test.list('dist/statics')).to.contain('app.bundle.js');
        expect(test.content('dist/statics/app.bundle.js')).to.contain('english');
      });
    });

    it('should generate a minified bundle on ci', () => {
      const res = test
        .setup({
          'src/client.js': `const aFunction = require('./dep');const a = aFunction(1);`,
          'src/dep.js': `module.exports = function(a){return a + 1;};`,
          'package.json': fx.packageJson(),
          'pom.xml': fx.pom()
        })
        .execute('build', [], insideTeamCity);

      expect(res.code).to.equal(0);

      expect(test.list('dist/statics')).to.contain('app.bundle.js');
      expect(test.list('dist/statics')).to.contain('app.bundle.min.js');

      expect(test.list('dist/statics')).to.contain('app.bundle.min.js.map');
      expect(test.list('dist/statics')).to.contain('app.bundle.min.js.map');
    });

    it('should exit with code 1 with a custom entry that does not exist', () => {
      const res = test
        .setup({
          'tsconfig.json': fx.tsconfig(),
          'package.json': fx.packageJson({
            entry: './hello'
          }),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(res.code).to.equal(1);
      expect(test.list('dist/statics')).not.to.contain('app.bundle.js');
    });

    it('should exit with code 0 and not create bundle.js when there is no custom entry configures and default entry does not exist', () => {
      const res = test
        .setup({
          'tsconfig.json': fx.tsconfig({files: ['src/example.ts']}),
          'package.json': fx.packageJson(),
          'pom.xml': fx.pom(),
          'src/example.ts': `console.log('horrey')`,
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.list('dist/statics')).not.to.contain('app.bundle.js');
    });
  });

  describe('Bundle output with library support', () => {
    it('should generate a bundle with umd library support', () => {
      const res = test
        .setup({
          'src/client.js': '',
          'package.json': fx.packageJson({
            exports: 'MyLibraryEndpoint'
          })
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.content('dist/statics/app.bundle.js')).to.contain('exports["MyLibraryEndpoint"]');
      expect(test.content('dist/statics/app.bundle.js')).to.contain('root["MyLibraryEndpoint"]');
    });

    it('should generate a bundle with named amd library support', () => {
      const res = test
        .setup({
          'src/client.js': '',
          'package.json': fx.packageJson({
            exports: 'MyLibraryEndpoint'
          })
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.content('dist/statics/app.bundle.js')).to.contain('define("MyLibraryEndpoint", [], factory)');
    });
  });

  describe('Bundle - sass', () => {
    const generateCssModulesPattern = (name, path, pattern = `[hash:base64:5]`) => {
      const genericNames = require('generic-names');
      const generate = genericNames(pattern, {hashPrefix: 'a'});
      return generate(name, path);
    };

    it('should generate a bundle with css', () => {
      const res = test
        .setup({
          'src/client.js': 'require(\'./style.scss\');',
          'src/style.scss': `.a {.b {color: red;}}`,
          'package.json': fx.packageJson({
            separateCss: false,
            cssModules: false
          })
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.content('dist/statics/app.bundle.js')).to.contain('.a .b');
    });

    it('should fail with exit code 1', () => {
      const res = test
        .setup({
          'src/client.js': 'require(\'./style1.scss\');',
          'src/style.scss': `.a {.b {color: red;}}`,
          'package.json': fx.packageJson()
        })
        .execute('build');

      expect(res.code).to.equal(1);
    });

    it('should separate Css from bundle by default', () => {
      const res = test
        .setup({
          'src/client.js': 'require(\'./style.scss\');',
          'src/style.scss': `.a {.b {color: red;}}`,
          'package.json': fx.packageJson(),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.content('dist/statics/app.bundle.js')).not.to.contain('{\n  color: red; }');
      expect(test.content('dist/statics/app.css')).to.contain('{\n  color: red; }');
    });

    it('should separate Css with prod setting on production', () => {
      const res = test
        .setup({
          'src/client.js': 'require(\'./style.scss\');',
          'src/style.scss': `.a {.b {color: red;}}`,
          'package.json': fx.packageJson({
            separateCss: 'prod'
          }),
          'pom.xml': fx.pom()
        })
        .execute('build', [], {NODE_ENV: 'PRODUCTION'});

      expect(res.code).to.equal(0);
      expect(test.content('dist/statics/app.bundle.js')).not.to.contain('{\n  color: red; }');
      expect(test.content('dist/statics/app.css')).to.contain('{\n  color: red; }');
    });

    it('should separate Css with prod setting on teamcity', () => {
      const res = test
        .setup({
          'src/client.js': 'require(\'./style.scss\');',
          'src/style.scss': `.a {.b {color: red;}}`,
          'package.json': fx.packageJson({
            separateCss: 'prod'
          }),
          'pom.xml': fx.pom()
        })
        .execute('build', [], insideTeamCity);

      expect(res.code).to.equal(0);
      expect(test.content('dist/statics/app.bundle.js')).not.to.contain('{\n  color: red; }');
      expect(test.content('dist/statics/app.css')).to.contain('{\n  color: red; }');
    });

    it('should generate RTL Css from bundle', () => {
      const res = test
        .setup({
          'src/client.js': 'require(\'./style.scss\');',
          'src/style.scss': `.a {.b {float: left;}}`,
          'package.json': fx.packageJson(),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.content('dist/statics/app.bundle.js')).not.to.contain('{\n  float: left; }');
      expect(test.content('dist/statics/app.css')).to.contain('{\n  float: left; }');
      expect(test.content('dist/statics/app.rtl.css')).to.contain('{\n  float: right; }');
      expect(test.content('dist/statics/app.rtl.min.css')).to.contain('{float:right}');
    });

    it('should create a separate css file for each entry', () => {
      const res = test
        .setup({
          'src/client.js': 'require(\'./client-styles.scss\');',
          'src/settings.js': 'require(\'./settings-styles.scss\');',
          'src/client-styles.scss': `.a {.b {color: red;}}`,
          'src/settings-styles.scss': `.c {.d {color: purple;}}`,
          'package.json': fx.packageJson({
            entry: {
              app: './client.js',
              settings: './settings.js'
            }
          }),
          'pom.xml': fx.pom()
        })
        .execute('build');
      expect(res.code).to.equal(0);
      expect(test.list('./dist/statics')).to.contain.members(['app.css', 'settings.css']);
    });

    it('should generate (runtime) css modules on production with hash only', function () {
      this.timeout(60000);

      const hash = generateCssModulesPattern('a', 'styles/my-file.css');
      const expectedCssMap = `{ a: '${hash}' }\n`;
      const myTest = tp.create('src/index');
      const res = myTest
        .setup({
          'src/index.js': `
            const {wixCssModulesRequireHook} = require('${require.resolve('yoshi-runtime')}');
            wixCssModulesRequireHook('./src');
            const s = require('./styles/my-file.css')
            console.log(s);
          `,
          'src/styles/my-file.css': `.a {color: red;}`,
          'package.json': `{
            "name": "a",\n
            "version": "1.0.4",\n
            "yoshi": {
              "cssModules": true,
              "separateCss": true
            }
          }`,
          'pom.xml': fx.pom()
        })
        .execute('', [], {NODE_ENV: 'production'});

      expect(res.code).to.equal(0);
      expect(res.stdout).to.equal(expectedCssMap);
      myTest.teardown();
    });

    it('should generate css modules on CI with hash only', () => {
      const hashA = generateCssModulesPattern('a', 'styles/my-file.scss');
      const hashB = generateCssModulesPattern('b', 'styles/my-file.scss');

      const expectedCssPattern = `.${hashA} .${hashB} {`;
      const res = test
        .setup({
          'src/client.js': 'require(\'./styles/my-file.scss\');',
          'src/styles/my-file.scss': `.a {.b {color: red;}}`,
          'package.json': fx.packageJson({
            cssModules: true,
            separateCss: true
          }),
          'pom.xml': fx.pom()
        })
        .execute('build', [], insideTeamCity);

      expect(res.code).to.equal(0);
      expect(test.content(`dist/${defaultOutput}/app.css`)).to.contain(expectedCssPattern);
    });

    it('should generate css modules on separate css file', () => {
      const regex = /\.styles-my-file__a__.{5}\s.styles-my-file__b__.{5}\s{/;
      const res = test
        .setup({
          'src/client.js': 'require(\'./styles/my-file.scss\');',
          'src/styles/my-file.scss': `.a {.b {color: red;}}`,
          'package.json': fx.packageJson({
            cssModules: true,
            separateCss: true
          }),
          'pom.xml': fx.pom()
        })
        .execute('build', [], getMockedCI({ci: false}));

      expect(res.code).to.equal(0);
      expect(test.content(`dist/${defaultOutput}/app.bundle.js`)).not.to.match(regex);
      expect(test.content(`dist/${defaultOutput}/app.css`)).to.match(regex);
    });

    it('should generate css modules as default', () => {
      const regex = /\.styles-my-file__a__.{5}\s.styles-my-file__b__.{5}\s{/;
      const res = test
        .setup({
          'src/client.js': 'require(\'./styles/my-file.scss\');',
          'src/styles/my-file.scss': `.a {.b {color: red;}}`,
          'package.json': fx.packageJson(),
          'pom.xml': fx.pom()
        })
        .execute('build', [], getMockedCI({ci: false}));

      expect(res.code).to.equal(0);
      expect(test.content(`dist/${defaultOutput}/app.bundle.js`)).not.to.match(regex);
      expect(test.content(`dist/${defaultOutput}/app.css`)).to.match(regex);
    });

    it('should disable css modules', () => {
      const res = test
        .setup({
          'src/client.js': 'require(\'./styles/my-file.scss\');',
          'src/styles/my-file.scss': `.a {.b {color: red;}}`,
          'package.json': fx.packageJson({
            cssModules: false,
            separateCss: true
          }),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.content(`dist/${defaultOutput}/app.css`)).to.contain('.a .b {');
    });

    it('should disable css modules for .global.scss files', () => {
      const res = test
        .setup({
          'src/client.js': 'require(\'./styles/my-file.global.scss\');',
          'src/styles/my-file.global.scss': `.a {.b {color: red;}}`,
          'package.json': fx.packageJson({
            separateCss: true
          }),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.content(`dist/${defaultOutput}/app.css`)).to.contain('.a .b {');
    });

    describe('autoprefixer', () => {
      it('should generate css attributes prefixes', () => {
        const res = test
          .setup({
            'src/client.js': 'require(\'./style.scss\');',
            'src/style.scss': `.a {
                                display: flex;
                              }`,
            'package.json': fx.packageJson({
              separateCss: false
            })
          })
          .execute('build');

        expect(res.code).to.equal(0);
        expect(test.content(`dist/${defaultOutput}/app.bundle.js`)).to.match(/display: -webkit-box;/g);
        expect(test.content(`dist/${defaultOutput}/app.bundle.js`)).to.match(/display: -ms-flexbox;/g);
        expect(test.content(`dist/${defaultOutput}/app.bundle.js`)).to.match(/display: flex;/g);
      });

      it('should generate css attributes prefixes for on separate css file', () => {
        const res = test
          .setup({
            'src/client.js': 'require(\'./style.scss\');',
            'src/style.scss': `.a {
                                display: flex;
                              }`,
            'package.json': fx.packageJson({
              cssModules: true,
              separateCss: true
            }),
            'pom.xml': fx.pom()
          })
          .execute('build');

        expect(res.code).to.equal(0);
        expect(test.content(`dist/${defaultOutput}/app.css`)).to.match(/display: -webkit-box;/g);
        expect(test.content(`dist/${defaultOutput}/app.css`)).to.match(/display: -ms-flexbox;/g);
        expect(test.content(`dist/${defaultOutput}/app.css`)).to.match(/display: flex;/g);
      });

      it('should generate separated minified Css from bundle on ci', () => {
        const res = test
          .setup({
            'src/client.js': 'require(\'./style.scss\');',
            'src/style.scss': `.a {.b {color: red;}}`,
            'package.json': fx.packageJson(),
            'pom.xml': fx.pom()
          })
          .execute('build', [], insideTeamCity);

        expect(res.code).to.equal(0);
        expect(test.content('dist/statics/app.bundle.js')).not.to.contain('{\n  color: red; }');
        expect(test.content('dist/statics/app.min.css')).to.contain('{color:red}');
      });
    });
  });

  describe('yoshi-copy', () => {
    it('should use yoshi-copy', () => {
      const res = test
        .setup({
          'app/assets/some-file': 'a',
          'src/assets/some-file': 'a',
          'test/assets/some-file': 'a',
          'package.json': fx.packageJson(),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.list(`dist/src/assets`)).to.include('some-file');
    });
  });

  describe('yoshi-maven-statics', () => {
    it('should use yoshi-maven-statics', () => {
      const res = test
        .setup({
          'package.json': fx.packageJson({
            clientProjectName: 'some-client-proj'
          }),
          'pom.xml': fx.pom()
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.content('maven/assembly/tar.gz.xml').replace(/\s/g, '')).to.contain(`
        <assembly xmlns="http://maven.apache.org/plugins/maven-assembly-plugin/assembly/1.1.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/plugins/maven-assembly-plugin/assembly/1.1.0 http://maven.apache.org/xsd/assembly-1.1.0.xsd">
            <id>wix-angular</id>
            <baseDirectory>/</baseDirectory>
            <formats>
                <format>tar.gz</format>
            </formats>
            <fileSets>
                <fileSet>
                    <directory>\${project.basedir}/node_modules/some-client-proj/dist</directory>
                    <outputDirectory>/</outputDirectory>
                    <includes>
                        <include>*</include>
                        <include>*/**</include>
                    </includes>
                </fileSet>
            </fileSets>
        </assembly>
      `.replace(/\s/g, ''));
    });
  });

  describe('yoshi-clean', () => {
    it('should use yoshi-clean', () => {
      const res = test
        .setup({
          '.babelrc': '{}',
          'dist/old.js': `const hello = "world!";`,
          'src/new.js': 'const world = "hello!";',
          'package.json': fx.packageJson()
        })
        .execute('build');

      expect(res.code).to.be.equal(0);
      expect(res.stdout).to.include(`Finished 'clean'`);
      expect(test.list('dist')).to.not.include('old.js');
      expect(test.list('dist/src')).to.include('new.js');
    });
  });

  describe('yoshi-update-node-version', () => {
    it('should use yoshi-update-node-version', () => {
      const res = test
        .setup({'package.json': fx.packageJson()})
        .execute('build', [], outsideTeamCity);

      expect(res.code).to.be.equal(0);
      expect(test.contains('.nvmrc')).to.be.true;
    });
  });

  describe('yoshi-petri', () => {
    it('should use yoshi-petri', () => {
      test
        .setup({
          'petri-specs/specs.infra.Dummy.json': fx.petriSpec(),
          'package.json': fx.packageJson()
        })
        .execute('build');

      expect(test.list('dist', '-R')).to.contain('statics/petri-experiments.json');
    });
  });

  describe.skip('yoshi-check-deps', () => {
    it('should run yoshi-check-deps and do nothing because yoshi isn\'t installed', () => {
      const resp = test
        .setup({'package.json': fx.packageJson()})
        .execute('build');
      expect(resp.stdout).to.contain('checkDeps');
    });
  });

  describe('symlinks', () => {
    it('should not resolve symlinks to their symlinked location', () => {
      const module1 = '.call(exports, "../node_modules/awesome-module1")';
      const module2 = '.call(exports, "../node_modules/awesome-module2")';

      const res = test
        .setup({
          'node_modules/awesome-module1/entry.js': 'module.exports = function() { return __dirname }',
          'node_modules/awesome-module2/entry.js': 'module.exports = function() { return __dirname }',
          'src/client.js': `require('awesome-module1/entry.js')`,
          'package.json': fx.packageJson()
        }, [
          hooks.createSymlink('node_modules/awesome-module2/entry.js', 'node_modules/awesome-module1/entry.js')
        ])
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.content(`dist/${defaultOutput}/app.bundle.js`)).to.contain(module1);
      expect(test.content(`dist/${defaultOutput}/app.bundle.js`)).to.not.contain(module2);
    });
  });

  describe('Migrate Bower Artifactory', () => {
    it('should migrate .bowerrc', () => {
      const bowerrc = {
        registry: {
          search: ['https://bower.herokuapp.com', 'http://wix:wix@mirror.wixpress.com:3333'],
          register: 'http://wix:wix@mirror.wixpress.com:3333',
          publish: 'http://wix:wix@mirror.wixpress.com:3333'
        }
      };

      test
        .setup({
          'package.json': fx.packageJson(),
          '.bowerrc': JSON.stringify(bowerrc, null, 2),
        })
        .execute('build');

      const newBowerrc = JSON.parse(test.content('.bowerrc'));
      const newPj = JSON.parse(test.content('package.json'));

      expect(newBowerrc).to.eql({
        registry: 'https://bower.dev.wixpress.com',
        resolvers: [
          'bower-art-resolver'
        ]
      });

      expect(newPj.devDependencies['bower-art-resolver']).to.exist;
    });
  });

  describe('externalize relative lodash (lodash/map -> lodash.map)', function () {
    this.timeout(30000);

    it('should be disabled when features.externalizeRelativeLodash = false', () => {
      const res = test
        .setup({
          'src/client.js': `require('lodash/map')`,
          'package.json': fx.packageJson({
            features: {
              externalizeRelativeLodash: false
            },
            externals: ['lodash/map']
          })
        }, [hooks.installDependency('lodash')])
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.content('dist/statics/app.bundle.js')).not.to.contain(').map');
    });

    it('should be enabled when features.externalizeRelativeLodash = true', () => {
      const res = test
        .setup({
          'src/client.js': `require('lodash/map')`,
          'package.json': fx.packageJson({
            features: {
              externalizeRelativeLodash: true
            },
            externals: ['lodash']
          })
        }, [hooks.installDependency('lodash')])
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.content('dist/statics/app.bundle.js')).to.contain(').map');
    });
  });

  describe('angular ngInject annotations', function () {
    const $inject = 'something.$inject = ["$http"];';
    it('are not executed when project is not Angular and TypeScript', () => {
      const res = test
        .setup({
          'src/something.ts': fx.angularJs(),
          'something/something.js': fx.angularJs(),
          'something.js': fx.angularJs(),
          'tsconfig.json': fx.tsconfig(),
          'package.json': fx.packageJson({
          }, {
          })
        }, [])
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.content('dist/src/something.js')).not.to.contain($inject);
      expect(test.content('dist/something/something.js')).not.to.contain($inject);
      expect(test.content('something.js')).not.to.contain($inject);
    });
    it('are executed when project is Angular and TypeScript', () => {
      const res = test
        .setup({
          'src/something.ts': fx.angularJs(),
          'something/something.js': fx.angularJs(),
          'something.js': fx.angularJs(),
          'tsconfig.json': fx.tsconfig(),
          'package.json': fx.packageJson({
          }, {
            angular: '1.5.0'
          })
        }, [])
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.content('dist/src/something.js')).to.contain($inject);
      expect(test.content('dist/something/something.js')).not.to.contain($inject);
      expect(test.content('something.js')).not.to.contain($inject);
    });
    it('are executed when project is Angular and EcmaScript', () => {
      const res = test
        .setup({
          'src/something.js': fx.angularJs(),
          'something/something.js': fx.angularJs(),
          'something.js': fx.angularJs(),
          '.babelrc': '{}',
          'package.json': fx.packageJson({
          }, {
            angular: '1.5.0'
          })
        }, [])
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.content('dist/src/something.js')).to.contain($inject);
      expect(test.content('dist/something/something.js')).not.to.contain($inject);
      expect(test.content('src/something.js')).not.to.contain($inject);
      expect(test.content('something.js')).not.to.contain($inject);
    });
    it('are not executed when project is not Angular and EcmaScript', () => {
      const res = test
        .setup({
          'src/something.js': fx.angularJs(),
          'something/something.js': fx.angularJs(),
          'something.js': fx.angularJs(),
          '.babelrc': '{}',
          'package.json': fx.packageJson({
          }, {
          })
        }, [])
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.content('dist/src/something.js')).not.to.contain($inject);
      expect(test.content('dist/something/something.js')).not.to.contain($inject);
      expect(test.content('src/something.js')).not.to.contain($inject);
      expect(test.content('something.js')).not.to.contain($inject);
    });
  });

  function checkServerIsServing({backoff = 100, max = 100, port = fx.defaultServerPort(), file = ''} = {}) {
    return retryPromise({backoff, max}, () => fetch(`http://localhost:${port}/${file}`)
      .then(res => res.text()));
  }
});
