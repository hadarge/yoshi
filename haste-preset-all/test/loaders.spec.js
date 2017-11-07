'use strict';

const tp = require('./helpers/test-phases');
const fx = require('./helpers/fixtures');
const expect = require('chai').expect;
const _ = require('lodash');
const {getMockedCI} = require('yoshi-utils').utilsTestkit;

describe('Loaders', () => {
  let test;

  beforeEach(() => {
    test = tp.create()
      .setup({
        'src/client.js': '',
        'src/config.js': '',
        'package.json': fx.packageJson(),
        'pom.xml': fx.pom()
      });
  });

  describe('Babel', () => {
    afterEach(() => test.teardown());

    it('should transpile according .babelrc file', () => {
      test
        .setup({
          'src/client.js': `let aServerFunction = 1;`,
          '.babelrc': `{"plugins": ["${require.resolve('babel-plugin-transform-es2015-block-scoping')}"]}`,
          'package.json': `{\n
            "name": "a"
          }`
        })
        .execute('build');

      expect(test.content('dist/statics/app.bundle.js')).to.contain('var aServerFunction = 1;');
    });

    it('should apply ng-annotate loader on angular project', () => {
      test
        .setup({
          'src/client.js': `angular.module('fakeModule', []).config(function($javascript){});`,
          'package.json': `{\n
            "name": "a",\n
            "dependencies": {\n
              "angular": "^1.5.0"\n
            }
          }`
        })
        .execute('build');

      expect(test.content('dist/statics/app.bundle.js')).to
        .contain(`.config(["$javascript", function ($javascript)`);
    });

    it('should apply ng-annotate loader on angular project with peerDependency', () => {
      test
        .setup({
          'src/client.js': `angular.module('fakeModule', []).config(function($javascript){});`,
          'package.json': `{\n
            "name": "a",\n
            "peerDependencies": {\n
              "angular": "^1.5.0"\n
            }
          }`
        })
        .execute('build');

      expect(test.content('dist/statics/app.bundle.js')).to
        .contain(`.config(["$javascript", function ($javascript)`);
    });

    it('should run over specified 3rd party modules', () => {
      const res = test
        .setup({
          'src/client.js': `require('wix-style-react/src')`,
          'node_modules/wix-style-react/src/index.js': 'let a = 1',
          '.babelrc': `{"plugins": ["${require.resolve('babel-plugin-transform-es2015-block-scoping')}"]}`,
          'package.json': `{\n
            "name": "a",\n
            "dependencies": {\n
              "wix-style-react": "file:node_modules/wix-style-react"
            }
          }`
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.content('dist/statics/app.bundle.js')).to.contain('var a = 1');
    });
  });

  describe('Typescript', () => {

    afterEach(() => test.teardown());

    it('should transpile', () => {
      test
        .setup({
          'src/app.ts': 'let aServerFunction = 1;',
          'tsconfig.json': fx.tsconfig(),
          'package.json': fx.packageJson({
            entry: './app.ts'
          })
        })
        .execute('build');
      expect(test.content('dist/statics/app.bundle.js')).to.contain('var aServerFunction = 1;');
    });

    it('should apply ng-annotate loader on angular project', () => {
      test
        .setup({
          'src/app.ts': `declare var angular: any; angular.module('fakeModule', []).config(function($typescript){});`,
          'tsconfig.json': fx.tsconfig(),
          'package.json': fx.packageJson({
            entry: './app.ts'
          }, {
            angular: '1.5.0'
          })
        })
        .execute('build');

      expect(test.content('dist/statics/app.bundle.js')).to
        .contain(`.config(["$typescript", function ($typescript)`);
    });

    it('should fail with error code 1', () => {

      const resp = test
        .setup({
          'src/app.ts': 'function ()',
          'tsconfig.json': fx.tsconfig(),
          'package.json': fx.packageJson({
            entry: './app.ts'
          })
        })
        .execute('build');

      expect(resp.code).to.equal(1);
      expect(resp.stdout).to.contain('error TS1003: Identifier expected');
    });
  });

  describe('SVG', () => {
    const svgContent = '<svg><g><path fill="#EEEEEE"></path></g></svg>';
    const svgModule = 'module.exports = "<svg><g><path fill=\\"#EEEEEE\\"></path></g></svg>"';
    it('should inline svg', () => {
      const res = test
        .setup({
          'src/client.js': 'require(\'./svgIcon.inline.svg\');',
          'src/svgIcon.inline.svg': svgContent,
          'package.json': fx.packageJson()
        })
        .execute('build');
      expect(res.code).to.equal(0);
      expect(test.content('dist/statics/app.bundle.js')).to.contain(svgModule);
    });
  });

  describe('Sass', () => {
    afterEach(() => test.teardown());

    describe('client', () => {
      beforeEach(() => setupAndBuild());

      it('should run sass and css loaders over imported .scss files', () => {
        expect(test.content('dist/statics/app.bundle.js')).to.match(/"some-rule":"some-css__some-rule__\w{5}",([\s\S]*?)"child":"some-css__child__\w{5}"/);
      });

      it('should also expose css classes as camelcase', () => {
        expect(test.content('dist/statics/app.bundle.js')).to.match(/"someRule":"some-css__some-rule__\w{5}"/);
      });

      describe('postcss', () => {
        it('should apply auto-prefixer', () => {
          expect(test.content('dist/statics/app.css')).to.contain('-webkit-appearance');
        });

        it('should support source maps', () => {
          expect(test.content('dist/statics/app.css.map')).not.to.contain('-webkit-appearance');
        });
      });

      it('should allow import sass from node_modules', () => {
        test
          .setup({
            'src/client.js': `require('./foo.css');`,
            'src/foo.css': '@import "bar/bar";',
            'node_modules/bar/bar.scss': '.bar{color:red}',
            'package.json': fx.packageJson({}),
          })
          .execute('build');

        expect(test.content('dist/statics/app.css')).to.contain('color: red');
      });

      it('should support compass', () => {
        test
          .setup({
            'src/client.js': `require('./foo.scss');`,
            'src/foo.scss': '@import "compass"; .bar{color:red}',
            'node_modules/compass-mixins/lib/_compass.scss': '',
            'package.json': fx.packageJson({}),
          })
          .execute('build');

        expect(test.content('dist/statics/app.css')).to.contain('color: red');
      });

      it('should support TPA style params', () => {
        test
          .setup({
            'src/client.js': `require('./foo.css');`,
            'src/foo.css': '.foo{color: unquote("{{color-1}}");font: unquote("; {{body-m}}");font-size: 16px;}',
            'package.json': fx.packageJson({
              tpaStyle: true
            }),
          })
          .execute('build');

        expect(test.content('dist/statics/app.css')).to.contain('font-size: 16px');
        expect(test.content('dist/statics/app.css')).not.to.contain('color-1');
        expect(test.content('dist/statics/app.css')).not.to.contain('body-m');
      });

      describe('composes keyword', () => {
        const commonConfig = {
          'src/client.js': `require('./some-css.scss');`,
          'src/server.js': `require('./some-css.scss');`,
          'src/some-css.scss': ` .some-rule { composes: foo from './base.scss';}`,
          'src/base.scss': `.foo{background: blue;} // comments are only possible in sass`
        };

        it('should support nested sass imports when using "compose"', () => {
          test.setup(Object.assign({'package.json': fx.packageJson({})}, commonConfig))
            .execute('build', [], getMockedCI({ci: false}));
          expect(test.content('dist/statics/app.css')).to.contain('background: blue');
          expect(test.content('dist/statics/app.bundle.js'))
            .to.match(/"some-rule":"some-css__some-rule\w+ base__foo\w+"/);
        });

        it('should support nested sass imports when using "compose", when using wix-tpa-style-loader', () => {
          test.setup(Object.assign({'package.json': fx.packageJson({tpaStyle: true})}, commonConfig))
            .execute('build', [], getMockedCI({ci: false}));
          expect(test.content('dist/statics/app.css')).to.contain('background: blue');
          expect(test.content('dist/statics/app.bundle.js'))
            .to.match(/"some-rule":"some-css__some-rule\w+ base__foo\w+"/);
        });
      });
    });

    describe('detach css', () => {
      it('should create an external app.css file with a source map', () => {
        setupAndBuild();
        expect(test.content('dist/statics/app.css')).to.match(/.\w+/);
        expect(test.content('dist/statics/app.css')).to.contain('color: red');
        expect(test.content('dist/statics/app.css')).to.contain('color: blue');
      });

      it('should keep styles inside the bundle when separateCss equals to false', () => {
        setupAndBuild({separateCss: false});
        expect(test.list('dist/statics')).not.to.contain('app.css');
        expect(test.list('dist/statics')).not.to.contain('app.css.map');
        expect(test.content('dist/statics/app.bundle.js')).to.contain('color: red');
        expect(test.content('dist/statics/app.bundle.js')).to.contain('color: blue');
      });
    });

    it('it should merge all style tags into one', () => {
      setupAndBuild({separateCss: false});
      expect(test.content('dist/statics/app.bundle.js')).to.contain('{"singleton":true}');
    });

    function setupAndBuild(config) {
      test
        .setup({
          'src/client.js': `require('./some-css.scss');require('./foo.css');`,
          'src/server.js': `require('./some-css.scss');require('./foo.css');`,
          'src/some-css.scss': `// comment
                                  @import "./imported";
                                  .some-rule { .child { color: red; } }`,
          'src/imported.scss': '.foo{appearance: none;}',
          'src/foo.css': '.foo-rule { color: blue }',
          'package.json': fx.packageJson(config || {}),
        })
        .execute('build', [], getMockedCI({ci: false}));
    }
  });

  describe('Resolve url loader', () => {
    describe('with RESOLVE_URL_LOADER env variable', () => {
      it('should resolve relative paths in url() statements based on the original source file', () => {
        const res = setup().execute('build', [], {RESOLVE_URL_LOADER: true});
        expect(res.code).to.equal(0);
      });

      it('should run after wix-tpa-style loader', () => {
        const res = test
          .setup({
            'src/client.js': `require('./some-css.scss');`,
            'src/some-css.scss': '.foo {color: unquote("{{color-1}}")}',
            'package.json': fx.packageJson({tpaStyle: true}),
          })
          .execute('build', [], {RESOLVE_URL_LOADER: true});

        expect(res.code).to.equal(0);
      });

      it('should increase importLoaders in order to support native @import', () => {
        test
          .setup({
            'src/client.js': `require('./some.css');`,
            'src/some.css': '@import "./other.css"',
            'src/other.css': '.foo {appearance: smth; color: unquote("{{color-1}}")}',
            'package.json': fx.packageJson({tpaStyle: true}),
          })
          .execute('build', [], {RESOLVE_URL_LOADER: true});

        expect(test.content('dist/statics/app.css')).to.contain('-webkit-appearance');
        expect(test.content('dist/statics/app.css')).to.not.contain('unquote("{{color-1}}")');
      });
    });

    it('should not resolve url() correctly without RESOLVE_URL_LOADER flag', () => {
      const res = setup().execute('build');
      expect(res.code).to.equal(1);
    });

    function setup() {
      return test
        .setup({
          'src/client.js': `require('./some-css.scss');`,
          'src/some-css.scss': '@import "./foo/imported"',
          'src/foo/imported.scss': `.foo{background: url('./bar.svg');}`,
          'src/foo/bar.svg': '',
          'package.json': fx.packageJson(),
        });
    }
  });

  describe('Wix TPA style', () => {
    it('should increase importLoaders in order to support native @import', () => {
      test
        .setup({
          'src/client.js': `require('./some.css');`,
          'src/some.css': '@import "./other.css"',
          'src/other.css': '.foo {appearance: smth; color: unquote("{{color-1}}")}',
          'package.json': fx.packageJson({tpaStyle: true}),
        })
        .execute('build', []);

      expect(test.content('dist/statics/app.css')).to.contain('-webkit-appearance');
      expect(test.content('dist/statics/app.css')).to.not.contain('unquote("{{color-1}}")');
    });
  });

  describe('Stylable', () => {
    afterEach(() => test.teardown());

    describe('client', () => {
      beforeEach(() => setupAndBuild());

      it.skip('should run stylable loader over imported .st.css files', () => {
        expect(test.content('dist/statics/app.bundle.js')).to.match(/.Test.*some-rule {\s*?color: red;\s*?}/);
      });
    });

    function setupAndBuild(config) {
      test
        .setup({
          'src/client.js': `require('./some-css.st.css');`,
          'src/server.js': `require('./some-css.st.css');`,
          'src/some-css.st.css': `/* comment */
                                  @namespace "Test";
                                  .some-rule { color: red; }`,
          'package.json': fx.packageJson(config || {})
        })
        .execute('build', [], getMockedCI({ci: false}));
    }
  });

  describe('Less', () => {
    afterEach(() => test.teardown());

    describe('client', () => {
      beforeEach(() => setupAndBuild());

      it('should run less and css loaders over imported .less files', () => {
        expect(test.content('dist/statics/app.bundle.js')).to.match(/"some-rule":"some-css__some-rule__\w{5}",([\s\S]*?)"child":"some-css__child__\w{5}"/);
      });

      it('should allow import less from node_modules', () => {
        test
          .setup({
            'src/client.js': `require('./foo.less');`,
            'src/foo.less': '@import "bar/baz.less";',
            'node_modules/bar/baz.less': '.bar{color:red}',
            'package.json': fx.packageJson({}),
          })
          .execute('build');

        expect(test.content('dist/statics/app.css')).to.contain('color: red');
      });

      describe('postcss', () => {
        it('should apply auto-prefixer', () => {
          expect(test.content('dist/statics/app.css')).to.contain('-webkit-appearance');
        });

        it('should support source maps', () => {
          expect(test.content('dist/statics/app.css.map')).not.to.contain('-webkit-appearance');
        });
      });

      it('should support TPA style params', () => {
        test
          .setup({
            'src/client.js': `require('./foo.less');`,
            'src/foo.less': '.foo{color: unquote("{{color-1}}");font: unquote("; {{body-m}}");font-size: 16px;}',
            'package.json': fx.packageJson({
              tpaStyle: true
            }),
          })
          .execute('build');

        expect(test.content('dist/statics/app.css')).to.contain('font-size: 16px');
        expect(test.content('dist/statics/app.css')).not.to.contain('color-1');
        expect(test.content('dist/statics/app.css')).not.to.contain('body-m');
      });
    });

    function setupAndBuild(config) {
      test
        .setup({
          'src/client.js': `require('./some-css.less');require('./foo.css');`,
          'src/server.js': `require('./some-css.less');require('./foo.css');`,
          'src/some-css.less': `// comment
                                  @import "./imported";
                                  .some-rule { .child { color: red; } }`,
          'src/imported.less': '.foo{appearance: none;}',
          'src/foo.css': '.foo-rule { color: blue }',
          'package.json': fx.packageJson(config || {}),
        })
        .execute('build', [], getMockedCI({ci: false}));
    }
  });

  describe('Assets', () => {
    afterEach(() => test.teardown());

    it('should embed image below 10kb as base64', () => {
      test
        .setup({
          'src/client.js': `require('./tiny-image.png');`,
          'src/tiny-image.png': 'some-content'
        })
        .execute('build');

      expect(test.content('dist/statics/app.bundle.js'))
        .to.contain('data:image/png;base64,c29tZS1jb250ZW50Cg==');
    });

    it('should write a separate image above 10kb', () => {
      test
        .setup({
          'src/client.js': `require('./largeImage.png');`,
          'src/largeImage.png': createAboveTheLimitFile()
        })
        .execute('build');

      expect(test.content('dist/statics/app.bundle.js'))
        .to.contain(fileAboveTheLimit('largeImage.png'));
    });

    it('should load images', () => {
      test
        .setup({
          'src/client.js': `
            require('./img.png');
            require('./img.jpg');
            require('./img.jpeg');
            require('./img.gif');
          `,
          'src/img.png': createAboveTheLimitFile(),
          'src/img.jpg': createAboveTheLimitFile(),
          'src/img.jpeg': createAboveTheLimitFile(),
          'src/img.gif': createAboveTheLimitFile()
        })
        .execute('build');

      const content = test.content('dist/statics/app.bundle.js');
      expect(content).to.contain(fileAboveTheLimit('img.png'));
      expect(content).to.contain(fileAboveTheLimit('img.jpg'));
      expect(content).to.contain(fileAboveTheLimit('img.jpeg'));
      expect(content).to.contain(fileAboveTheLimit('img.gif'));
    });

    it('should load fonts', () => {
      test
        .setup({
          'src/client.js': `
            require('./font.ttf');
            require('./font.woff');
            require('./font.woff2');
            require('./font.eot');
          `,
          'src/font.ttf': createAboveTheLimitFile(),
          'src/font.woff': createAboveTheLimitFile(),
          'src/font.woff2': createAboveTheLimitFile(),
          'src/font.eot': createAboveTheLimitFile()
        })
        .execute('build');

      const content = test.content('dist/statics/app.bundle.js');
      expect(content).to.contain(fileAboveTheLimit('font.ttf'));
      expect(content).to.contain(fileAboveTheLimit('font.woff'));
      expect(content).to.contain(fileAboveTheLimit('font.woff2'));
      expect(content).to.contain(fileAboveTheLimit('font.eot'));
    });

    it('should load wav and mp3 files', () => {
      test
        .setup({
          'src/client.js': `require('./beep.wav');require('./beep.mp3');`,
          'src/beep.wav': createAboveTheLimitFile(),
          'src/beep.mp3': createAboveTheLimitFile(),
        })
        .execute('build');

      const content = test.content('dist/statics/app.bundle.js');
      expect(content).to.contain(fileAboveTheLimit('beep.wav'));
      expect(content).to.contain(fileAboveTheLimit('beep.mp3'));
    });

    it('should load files that have a path with query string', () => {
      test
        .setup({
          'src/client.js': `require('./image.svg?version=1.0.2&some-other-param=value');`,
          'src/image.svg': createAboveTheLimitFile()
        })
        .execute('build');

      const content = test.content('dist/statics/app.bundle.js');
      expect(content).to.contain(fileAboveTheLimit('image.svg'));
    });

    it('should load svg files', () => {
      test
        .setup({
          'src/client.js': `require('./icon.svg');`,
          'src/icon.svg': createAboveTheLimitFile(),
          'package.json': fx.packageJson()
        })
        .execute('build');

      const content = test.content('dist/statics/app.bundle.js');
      expect(content).to.contain(fileAboveTheLimit('icon.svg'));
    });

    it('should not load "inline.svg" suffixed files', () => {
      test
        .setup({
          'src/client.js': `require('./icon.inline.svg');`,
          'src/icon.inline.svg': createAboveTheLimitFile(),
          'package.json': fx.packageJson()
        })
        .execute('build');

      const content = test.content('dist/statics/app.bundle.js');
      expect(content).not.to.contain(fileAboveTheLimit('icon.inline.svg'));
    });

    it('should load badly "inline.svg" suffixed files', () => {
      test
        .setup({
          'src/client.js': `require('./icon.inlineW.svg');`,
          'src/icon.inlineW.svg': createAboveTheLimitFile(),
          'package.json': fx.packageJson()
        })
        .execute('build');

      const content = test.content('dist/statics/app.bundle.js');
      expect(content).to.contain(fileAboveTheLimit('icon.inlineW.svg'));
    });

    function createAboveTheLimitFile() {
      return _.repeat('a', 10001);
    }

    function fileAboveTheLimit(name) {
      return `__webpack_require__.p + "${name}`;
    }
  });

  describe('Json', () => {
    beforeEach(() =>
      test
        .setup({
          'src/client.js': `require('./some.json')`,
          'src/some.json': '{"json-content": 42}'
        })
        .execute('build')
    );

    it('should embed json file into bundle', () =>
      expect(test.content('dist/statics/app.bundle.js')).to.contain('"json-content":42')
    );
  });

  describe('HTML', () => {
    beforeEach(() =>
      test
        .setup({
          'src/client.js': `require('./some.html')`,
          'src/some.html': '<div>This is a HTML file</div>'
        })
        .execute('build')
    );

    it('should embed html file into bundle', () =>
      expect(test.content('dist/statics/app.bundle.js')).to.contain('<div>This is a HTML file</div>')
    );
  });

  describe('raw', () => {
    beforeEach(() =>
      test
        .setup({
          'src/client.js': `require('./some.md')`,
          'src/some.md': '### title'
        })
        .execute('build')
    );

    it('should embed html file into bundle', () =>
      expect(test.content('dist/statics/app.bundle.js')).to.contain('### title')
    );
  });

  describe('GraphQL', () => {
    beforeEach(() =>
      test
        .setup({
          'src/getData1.graphql': 'query GetData1 { id, name }',
          'src/getData2.gql': 'query GetData2 { id, name }',
          'src/client.js': `require('./getData1.graphql'); require('./getData2.gql')`
        })
        .execute('build')
    );

    it('should embed parsed graphql query into bundle', () => {
      const content = test.content('dist/statics/app.bundle.js');

      expect(content).to.contain('{"kind":"Name","value":"GetData1"}');
      expect(content).to.contain('{"kind":"Name","value":"GetData2"}');
    });
  });
});
