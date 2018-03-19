const path = require('path');
const sh = require('shelljs');
const stripAnsi = require('strip-ansi');

class Test {
  constructor(...args) {
    const script = typeof args[0] === 'string' && args[0];
    const env = typeof args[0] === 'object' ? args[0] : args[1];
    this.script = script;
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

  execute(command, cliArgs = [], environment = {}, execOptions = {}) {
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

  write(file, content) {
    const fullPath = path.join(this.tmp, file);
    content = content.replace(/'/g, `'\\''`);
    sh.mkdir('-p', path.dirname(fullPath));
    sh.exec(`echo '${content}'`, {silent: true}).to(fullPath);
    return this;
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
