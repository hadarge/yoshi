import React from 'react';
import { something } from './assets/module-with-multiple-exports.js';

export default () => <div id="unused-export">{something}</div>;
