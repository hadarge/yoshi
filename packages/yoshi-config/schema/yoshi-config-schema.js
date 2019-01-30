const webpackOptions = require('webpack/schemas/WebpackOptions.json');

const schema = {
  additionalProperties: false,
  definitions: webpackOptions.definitions,
  type: 'object',
  properties: {
    extends: {
      description:
        'A path to a module that exports yoshi config object to use as base config object.',
      type: 'string',
    },
    separateCss: {
      description:
        'Whether to separate the bundle for css files from the main js bundle.',
      enum: ['prod', false, true],
    },
    splitChunks:
      webpackOptions.definitions.OptimizationOptions.properties.splitChunks,
    cssModules: {
      description: 'Whether to use css modules. On by default.',
      type: 'boolean',
    },
    tpaStyle: {
      description: 'Build using TPA style',
      type: 'boolean',
    },
    enhancedTpaStyle: {
      description: 'Build using enhanced TPA style',
      type: 'boolean',
    },
    features: {
      description: 'Features of your project',
      type: 'object',
      additionalProperties: false,
      properties: {
        externalizeRelativeLodash: {
          description: 'Set to true to externalize relative lodash',
          type: 'boolean',
        },
      },
    },
    clientProjectName: {
      description: 'The name of the client project.',
      type: 'string',
    },
    keepFunctionNames: {
      description: 'Set to true to keep function names when uglifying',
      type: 'boolean',
    },
    entry: webpackOptions.properties.entry,
    servers: {
      type: 'object',
      additionalProperties: false,
      properties: {
        cdn: {
          description: 'Configuration for the CDN server',
          type: 'object',
          additionalProperties: false,
          properties: {
            url: {
              description: 'public path of CDN',
              type: 'string',
            },
            port: {
              description: 'The port to expose the CDN on. defaults to 3200',
              type: 'number',
            },
            dir: {
              description:
                'Directory to which static files will be written to. Default to "dist/statics"',
              type: 'string',
            },
            ssl: {
              description: 'Whether to expose the CDN over HTTPS',
              type: 'boolean',
            },
          },
        },
      },
    },
    externals: webpackOptions.properties.externals,
    specs: {
      description:
        'Specs globs are configurable. browser is for karma, node is for mocha and jasmine.',
      type: 'object',
      properties: {
        browser: {
          description: 'A glob for all the spec files to run in the browser',
          type: 'string',
        },
        node: {
          description: 'A glob for all the spec files to run in node',
          type: 'string',
        },
      },
    },
    runIndividualTranspiler: {
      description:
        "In case you don't want to transpile your server (node) code, and you still need .babelrc/tsconfig, you can add runIndividualTranspiler flag to skip server transpiling.",
      type: 'boolean',
    },
    petriSpecs: {
      description: 'Configure options for the petriSpecs command',
      type: 'object',
      properties: {
        onlyForLoggedInUsers: {
          description: 'Create specs only for logged in users',
          type: 'boolean',
        },
        scopes: {
          description:
            'Create specs under specific scopes. Defaults to <artifactId>',
          type: 'array',
          items: {
            description: 'Scope name',
            type: 'string',
          },
        },
      },
    },
    transpileTests: {
      description:
        'An option to not transpile tests with Babel (via babel-register). Defaults to true.',
      type: 'boolean',
    },
    externalUnprocessedModules: {
      description:
        'A list of external node modules to include in the transpilation.',
      type: 'array',
      items: {
        description: 'A node module to include in transpilation',
        type: 'string',
      },
    },
    exports: {
      description:
        'If set, export the bundle as library. yoshi.exports is the name.',
      type: 'string',
    },
    hmr: {
      description:
        'Set to false in order to disable hot module replacement. (defaults to true)',
      anyOf: [
        {
          type: 'boolean',
        },
        {
          enum: ['auto'],
        },
      ],
    },
    liveReload: {
      description:
        'If true, instructs the browser to physically refresh the entire page if / when webpack indicates that a hot patch cannot be applied and a full refresh is needed.',
      type: 'boolean',
    },
    performance: webpackOptions.properties.performance,
    resolveAlias: {
      description:
        'Allows you to use the Webpack Resolve Alias feature. The configuration object is the same as in Webpack, note that the paths are relative to Webpacks context. For more info, you can read the webpack docs.',
      type: 'object',
    },
    hooks: {
      description:
        "Run a shell script at a specific time in yoshi's execution.",
      type: 'object',
      properties: {
        prelint: {
          description: 'Runs before the linter',
          type: 'string',
        },
      },
    },
    umdNamedDefine:
      webpackOptions.definitions.OutputOptions.properties.umdNamedDefine,
    universalProject: {
      description:
        'Indicates whether the current project is a universal project.',
      type: 'boolean',
    },
    experimentalServerBundle: {
      description:
        'An experimental way of running an app by creating a bundle specifically for the server.',
      type: 'boolean',
    },
  },
};

module.exports = schema;
