# create-yoshi-app

This package is used to create [yoshi](https://github.com/wix/yoshi) powered projects.

# contributing

Every directory in `templates` directory represents a generated project type. Every project specified in `packages/create-yoshi-app/src/projects.js` will be tested automatically in the E2E suite.

* When creating a template, please verify to create both TypeScript and Babel versions.

In order to use dynamic values in the template, you can choose one of the following:

* `projectName`
* `authorName`
* `authorEmail`
* `organization`

You can also use CONSTANT_CASE to get the same values in the constant case format:
* `PROJECT_NAME`
* `AUTHOR_NAME`
* `AUTHOR_EMAIL`
* `ORGANIZATION`

Use `{%%}` to wrap each key and get the dynamic value.

For example:
```md
This project is called "{%projectName%}" and it was created by {%AUTHOR_NAME%}
```

Will result in:
```md
This project is called "my-project" and it was created by JOHN_DOE
```

You can also use these on file names.

# development

```bash
npm run dev
```

When running the development script, you will be presented with the regular `create-yoshi-app` experience.

When you'll finished answering the questions, this project will be automatically created in a temporary directory. Now every change you'll do in the original templates will be viewed in the temporary project.

* It will not run `npm install` for you, so make sure to run it yourself.
* You'll be able to return to the last project you've worked on. (It will ask you the next time you'll try to run `npm run dev`)
