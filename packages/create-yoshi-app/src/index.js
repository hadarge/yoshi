const createApp = require('./createApp');
const runPrompt = require('./runPrompt');
const generateProject = require('./generateProject');
const replaceTemplates = require('./replaceTemplates');
const getValuesMap = require('./getValuesMap');
const verifyWorkingDirectory = require('./verifyWorkingDirectory');
const verifyRegistry = require('./verifyRegistry');
const templates = require('./templates');

module.exports = {
  createApp,
  runPrompt,
  generateProject,
  replaceTemplates,
  templates,
  getValuesMap,
  verifyRegistry,
  verifyWorkingDirectory,
};
