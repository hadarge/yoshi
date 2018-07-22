const path = require('path');
const prompts = require('prompts');
const getQuestions = require('./getQuestions');

module.exports = async (workingDir, options) => {
  const questions = await getQuestions(workingDir);
  const results = await prompts(questions, options);
  // use the basename of the current working directory if projectName wasn't supplied
  results.projectName = results.projectName || path.basename(workingDir);

  return results;
};
