'use strict';

const sh = require('shelljs');
const path = require('path');

module.exports = {
  installDependency: dep => cwd => exec(`npm i ${dep}`, cwd),
  createSymlink: (target, destination) => cwd => {
    const from = path.join(cwd, target);
    const to = path.join(cwd, destination);
    return exec(`ln -sf ${from} ${to}`, cwd);
  }
};

function exec(cmd, cwd) {
  const res = sh.exec(cmd, {cwd, silent: true});
  if (res && res.code && res.code !== 0) {
    throw new Error(`Command ${cmd} failed with code ${res.code} and output: ${res.stdout + res.stderr}`);
  } else {
    return res;
  }
}
