import path from 'path';
import TemplateModel from '../src/TemplateModel';

describe('TemplateModel', () => {
  describe('transpiler is babel', () => {
    const model = TemplateModel.fromJSON({
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
    const model = TemplateModel.fromJSON({
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
