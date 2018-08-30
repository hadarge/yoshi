const path = require('path');
const Answers = require('../src/Answers');

describe('Answers', () => {
  describe('transpiler is babel', () => {
    const answers = new Answers({
      projectType: 'client',
      transpiler: 'babel',
    });

    it('should compute the proper fullProjectType and templatePath', () => {
      expect(answers.fullProjectType).toBe('client');
      expect(answers.templatePath).toBe(
        path.join(__dirname, '../templates/client'),
      );
    });
  });

  describe('transpiler is typescript', () => {
    const answers = new Answers({
      projectType: 'client',
      transpiler: 'typescript',
    });

    it('should compute the proper fullProjectType and templatePath', () => {
      expect(answers.templatePath).toBe(
        path.join(__dirname, '../templates/client-typescript'),
      );
    });
  });
});
