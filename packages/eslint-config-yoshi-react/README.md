# eslint base configuration for yoshi (react) based projects

Install all peer dependencies:

```
  "babel-eslint": "^8.2.2",
  "eslint": "^4.13.1",
  "eslint-config-prettier": "^2.9.0",
  "eslint-plugin-import": "^2.11.0",
  "eslint-plugin-jsx-a11y": "^6.0.2",
  "eslint-plugin-prettier": "^2.6.0",
  "eslint-plugin-react": "^7.7.0",
  "prettier": "^1.11.1"
```

Add the following to your `package.json`:

```json
{
  "eslintConfig": {
    "extends": "yoshi-react"
  }
}
```
