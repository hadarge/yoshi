import path from 'path';
import fs from 'fs-extra';

export type Language = 'javascript' | 'typescript';

export interface TemplateDefinition {
  name: string;
  path: string;
}

export default class TemplateModel {
  readonly projectName: string;
  readonly authorName: string;
  readonly authorEmail: string;
  readonly templateDefinition: TemplateDefinition;
  readonly language: Language;

  constructor({
    projectName,
    templateDefinition,
    authorName,
    authorEmail,
    language,
  }: {
    projectName: string;
    templateDefinition: TemplateDefinition;
    authorName: string;
    authorEmail: string;
    language: Language;
  }) {
    this.templateDefinition = templateDefinition;
    this.projectName = projectName;
    this.authorName = authorName;
    this.authorEmail = authorEmail;
    this.language = language;
  }

  getPath() {
    return path.join(this.templateDefinition.path, this.language);
  }

  getTitle() {
    return `${this.templateDefinition.name}-${this.language}`;
  }

  static fromFilePath(answersFilePath: string) {
    return new TemplateModel(fs.readJSONSync(answersFilePath));
  }
}
