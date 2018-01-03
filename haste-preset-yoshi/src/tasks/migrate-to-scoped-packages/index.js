'use strict';

const path = require('path');
const {update} = require('update-scopes');
const {inCi} = require('../../utils');

module.exports = () => () => {

  if (inCi()) {
    console.log('Running inside CI: Migration of scoped dependencies skipped.');
    return Promise.resolve();
  }

  const packageJson = path.join(process.cwd(), 'package.json');
  return update(packageJson).catch(() => {});

};
