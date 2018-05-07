# eslint base configuration for yoshi based projects

Install all peer dependencies:

```
  "eslint": "^4.13.1",
  "prettier": "^1.11.1",
  "babel-eslint": "^8.2.2",
  "eslint-config-prettier": "^2.9.0",
  "eslint-plugin-prettier": "^2.6.0"
```

Add the following to your `package.json`:

```json
{
  "eslintConfig": {
    "extends": "yoshi-base"
  }
}
```
