# create-yoshi-app

This package is used to create [yoshi](https://github.com/wix/yoshi) powered projects.

# contributing

Every directory in `templates` directory represents a generated project type. It will be tested automatically in the E2E suite.

* When creating a template, please verify to create a TypeScript and a Babel version.

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
