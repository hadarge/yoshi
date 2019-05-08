# tslint configuration for yoshi based projects using React

**Use this for projects with React!**

Extends [tslint-config-yoshi-base](https://github.com/wix/yoshi/tree/master/packages/tslint-config-yoshi-base) with React specific tslint rules, e.g., [tslint-react](https://github.com/palantir/tslint-react), [tslint-plugin-wix-style-react](https://github.com/wix/wix-ui/tree/master/packages/tslint-plugin-wix-style-react)

Install all peer dependencies:

```
  "prettier": "^1.11.1",
  "tslint": ">=5.10.0",
  "tslint-react-hooks": "^2.1.0"
```

Add the following to your `tslint.json`:

```json
{
  "extends": "tslint-config-yoshi"
}
```
