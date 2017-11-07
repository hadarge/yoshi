'use strict';

const process = require('process');
const path = require('path');
const sh = require('shelljs');
const spawn = require('cross-spawn');
const stripAnsi = require('strip-ansi');
const hasteCliBin = path.resolve(__dirname, '../../node_modules/haste-cli/bin/haste.js');
const hastePresetAllPath = path.resolve(__dirname, '../../src/index.js');

class Test {
  constructor(...args) {
    const script = typeof args[0] === 'string' && args[0];
    const env = typeof args[0] === 'object' ? args[0] : args[1];
    this.script = script || hasteCliBin;
    this.env = Object.assign({}, process.env, env);
    this.child = null;
    this.stdout = '';
    this.stderr = '';
    this.tmp = path.join(sh.tempdir().toString(), new Date().getTime().toString());
  }

  setup(tree, hooks = []) {
    const flat = flattenTree(tree);
    Object.keys(flat).forEach(file => {
      this.write(file, flat[file]);
    });
    (hooks || []).forEach(hook => hook(this.tmp));
    return this;
  }

  spawn(command, options, environment = {}) {
    if (this.hasTmp()) {
      try {
        options = options || [];
        options = Array.isArray(options) ? options : options.split(' ');
        options = options.concat(['--preset', hastePresetAllPath]);

        const env = Object.assign({}, this.env, environment);
        this.child = spawn('node', [`${this.script}`, `${command}`].concat(options), {cwd: this.tmp, env, stdio: 'inherit'});
        this.child.stdout.on('data', buffer => {
          this.stdout += buffer.toString();
        });
        this.child.stderr.on('data', buffer => {
          this.stderr += buffer.toString();
        });
        return this.child;
      } catch (e) {
        console.log(`Error running ${this.script} ${command}: ${e}`); // TODO: Use logger?
        return null;
      }
    }
    return null;
  }

  execute(command, cliArgs = [], environment = {}, execOptions = {}) {
    cliArgs = cliArgs.concat(['--preset', hastePresetAllPath]);

    const args = [command].concat(cliArgs).join(' ');
    const env = Object.assign({}, this.env, environment);
    const options = Object.assign({}, {cwd: this.tmp, env, silent: true}, execOptions);

    if (this.hasTmp()) {
      const result = sh.exec(`node '${this.script}' ${args}`, options);

      return Object.assign(result, {
        stdout: stripAnsi(result.stdout),
        stderr: stripAnsi(result.stderr)
      });
    }
  }

  teardown() {
    if (this.hasTmp()) {
      if (this.child) {
        // this.child.kill('SIGKILL');
        this.child = null;
        this.stdout = '';
        this.stderr = '';
      }

      sh.rm('-rf', this.tmp);
    }
    return this;
  }

  hasTmp() {
    return this.tmp && sh.test('-d', this.tmp);
  }

  content(file) {
    return file && sh.cat(path.join(this.tmp, file)).stdout.trim();
  }

  modify(file, arg) {
    if (!arg) {
      sh.touch(path.join(this.tmp, file));
    } else {
      const content = typeof arg === 'function' ? arg(this.content(file)) : arg;
      this.write(file, content);
    }
    return this;
  }

  write(file, content) {
    const fullPath = path.join(this.tmp, file);
    content = content.replace(/'/g, `'\\''`);
    sh.mkdir('-p', path.dirname(fullPath));
    sh.exec(`echo '${content}'`, {silent: true}).to(fullPath);
    return this;
  }

  contains(fileOrDir) {
    const args = arguments.length > 1 ? Array.from(arguments) : [fileOrDir];
    return args.reduce((acc, item) => acc && !!item && sh.test('-e', path.join(this.tmp, item)), true);
  }

  list(dir, options) {
    const loc = path.join(this.tmp, dir || '');
    const args = (options ? [options] : []).concat(loc);
    return Array.from(sh.ls.apply(sh, args));
  }
}

function flattenTree(tree, prefix) {
  let result = {};
  prefix = prefix ? prefix + path.sep : '';
  Object.keys(tree).forEach(key => {
    const value = tree[key];
    if (typeof value === 'string') {
      result[prefix + key] = value;
    } else {
      result = Object.assign(result, flattenTree(value, prefix + key));
    }
  });
  return result;
}

module.exports = {
  create: (...args) => new Test(...args)
};

/*
const test = module.exports.setup({
  'app/a/a.js': 'const a = 1;',
  test: {
    'a/a.spec.js': '\'use strict\'',
    'b/b.spec.ts': '\'use strict\'',
    'c/c.spec.jsx': '\'use strict\''
  },
  src: {
    b: {
      'b.js': 'const b = 2;'
    },
    'c/c': {
      'c.ts': 'const c = 3;'
    }
  }
});
*/

/*
function parseTree(tree) {
  let result = {};
  Object.keys(tree).forEach(key => {
    let parts = key.split(path.sep);
    const dir = parts.shift();
    const rest = parts.join(path.sep);
    const value = tree[key];
    let branch;
    if (rest) {
      branch = {};
      branch[rest] = value;
    } else {
      branch = value;
    }
    result[dir] = typeof branch === 'string' ? branch : parseTree(branch);
  });
  return result;
}
*/
