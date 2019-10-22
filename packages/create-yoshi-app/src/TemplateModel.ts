import path from 'path';
import fs from 'fs-extra';

export type Transpiler = 'typescript' | 'babel';

export interface TemplateDefinition {
  name: string;
  path: string;
}

export default class TemplateModel {
  readonly projectName: string;
  readonly authorName: string;
  readonly authorEmail: string;
  readonly templateDefinition: TemplateDefinition;
  readonly transpiler: Transpiler;

  constructor(
    projectName: string,
    templateDefinition: TemplateDefinition,
    authorName: string,
    authorEmail: string,
    transpiler: Transpiler,
  ) {
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

  static fromJSON({
    projectName,
    templateDefinition,
    authorName,
    authorEmail,
    transpiler,
  }: any) {
    return new TemplateModel(
      projectName,
      templateDefinition,
      authorName,
      authorEmail,
      transpiler,
    );
  }

  static fromFilePath(answersFilePath: string) {
    return this.fromJSON(fs.readJSONSync(answersFilePath));
  }
}
