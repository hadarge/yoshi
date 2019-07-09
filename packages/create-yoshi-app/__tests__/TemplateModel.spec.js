const path = require('path');
const TemplateModel = require('../src/TemplateModel');

describe('TemplateModel', () => {
  describe('transpiler is babel', () => {
    const model = new TemplateModel({
      templateDefinition: {
        name: 'client',
        path: path.join(__dirname, '../templates/client'),
      },
      transpiler: 'babel',
    });

    it('should compute the template path according to the template definition and the transpiler', () => {
      expect(model.getPath()).toBe(
        path.join(__dirname, '../templates/client/javascript'),
      );
    });
  });

  describe('transpiler is typescript', () => {
    const model = new TemplateModel({
      templateDefinition: {
        name: 'client',
        path: path.join(__dirname, '../templates/client'),
      },
      transpiler: 'typescript',
    });

    it('should compute the template path according to the template definition and the transpiler', () => {
      expect(model.getPath()).toBe(
        path.join(__dirname, '../templates/client/typescript'),
      );
    });
  });
});
