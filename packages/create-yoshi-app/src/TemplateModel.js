const path = require('path');
const fs = require('fs-extra');

module.exports = class TemplateModel {
  constructor({
    projectName,
    templateDefinition,
    authorName,
    authorEmail,
    transpiler,
  }) {
    this.templateDefinition = templateDefinition;
    this.projectName = projectName;
    this.authorName = authorName;
    this.authorEmail = authorEmail;
    this.transpiler = transpiler;
  }

  get language() {
    return this.transpiler === 'typescript' ? 'typescript' : 'javascript';
  }

  getPath() {
    return path.join(this.templateDefinition.path, this.language);
  }

  getTitle() {
    return `${this.templateDefinition.name}-${this.language}`;
  }

  static fromJSON(options) {
    return new TemplateModel(options);
  }

  static fromFilePath(answersFilePath) {
    this.fromJSON(fs.readJSONSync(answersFilePath));
  }
};
