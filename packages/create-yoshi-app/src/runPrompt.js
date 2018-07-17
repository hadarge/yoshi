const getQuestions = require('./getQuestions');
const prompts = require('prompts');

module.exports = async workingDir => {
  const questions = await getQuestions(workingDir);
  return prompts(questions);
};
