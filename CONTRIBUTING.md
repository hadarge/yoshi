# Contributing to Yoshi
Hey! Thanks for your interest in improving our Toolkit!

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

## Submitting an Issue
Please provide us with an issue in case you've found a bug, want a new feature, have an awesome idea, or there is something you want to discuss.

## Submitting a Pull Request
Good pull requests, such as patches, improvements, and new features, are a fantastic help. They should remain focused in scope and avoid containing unrelated commits.

Please **ask first** if somebody else is already working on this or the core developers think your feature is in-scope. Generally always have a related issue with discussions for whatever you are including.

## Local Setup
1. Clone the repo `git clone git@github.com:wix-private/yoshi.git`.
2. Run `npm install` in the yoshi directory.

That's it, you're good to go.

* `npm test` - Run yoshi's tests.
* `npm run build` - Run [eslint](https://eslint.org/) on all packages with the following [rules](https://github.com/wix-private/yoshi/blob/master/.eslintrc).
* `npm run test:watch` Run the tests using watch mode.

## Adding a new feature to the yoshi toolkit
1. Make sure the feature is tested.
2. Document it in [README.md](https://github.com/wix-private/yoshi/blob/master/README.md)

## Release a new version
To create a new version just use the following command:

```bash
npm run release
```

This command will open an interactive UI for choosing the version, it will bump it in `package.json`, add a git tag and push the commits and tag to GitHub.

Don't forget to go over the [CHANGELOG.md](https://github.com/wix-private/yoshi/blob/master/CHANGELOG.md) and insert the version's changes.
