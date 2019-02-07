# eslint base configuration for yoshi based projects

Install all peer dependencies:

```
  "eslint": "^5.0.0",
  "prettier": "^1.11.1",
  "babel-eslint": "^8.2.2",
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
