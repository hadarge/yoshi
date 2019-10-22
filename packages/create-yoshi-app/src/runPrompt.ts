import path from 'path';
import prompts from 'prompts';
import TemplateModel from './TemplateModel';
import getQuestions from './getQuestions';

export default async (workingDir: string = process.cwd()) => {
  const questions = getQuestions();

  let promptAborted = false;

  const answers = await prompts(questions, {
    onCancel: () => {
      promptAborted = true;
    },
  });

  if (promptAborted) {
    console.log();
    console.log('Aborting ...');
    process.exit(0);
  }

  // use the basename of the current working directory if projectName wasn't supplied
  answers.projectName = answers.projectName || path.basename(workingDir);

  return TemplateModel.fromJSON(answers);
};
