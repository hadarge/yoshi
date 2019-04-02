const path = require('path');

module.exports = class TemplateModel {
  constructor({
    projectName,
    templateDefinition,
    authorName,
    authorEmail,
    organization,
    transpiler,
  }) {
    this.templateDefinition = templateDefinition;
    this.projectName = projectName;
    this.authorName = authorName;
    this.authorEmail = authorEmail;
    this.organization = organization;
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
};
