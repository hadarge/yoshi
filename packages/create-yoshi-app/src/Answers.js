const path = require('path');

module.exports = class Answers {
  constructor({
    projectName,
    projectType,
    authorName,
    authorEmail,
    organization,
    transpiler,
  }) {
    this.projectType = projectType;
    this.projectName = projectName;
    this.authorName = authorName;
    this.authorEmail = authorEmail;
    this.organization = organization;
    this.transpiler = transpiler;
  }

  get templatePath() {
    return path.join(__dirname, '../templates', this.fullProjectType);
  }

  get fullProjectType() {
    const typescriptSuffix =
      this.transpiler === 'typescript' ? '-typescript' : '';

    return this.projectType + typescriptSuffix;
  }
};
