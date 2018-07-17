# Contributing to Yoshi
Hey! Thanks for your interest in improving our Toolkit!

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

## Submitting an Issue
Please provide us with an issue in case you've found a bug, want a new feature, have an awesome idea, or there is something you want to discuss.

## Submitting a Pull Request
Good pull requests, such as patches, improvements, and new features, are a fantastic help. They should remain focused in scope and avoid containing unrelated commits.

Please **ask first** if somebody else is already working on this or the core developers think your feature is in-scope. Generally always have a related issue with discussions for whatever you are including.

## Local Setup
1. Clone the repo `git clone git@github.com:wix/yoshi.git`.
2. Run `npm install` in the yoshi directory.

That's it, you're good to go.

* `npm test` - Run yoshi's tests.
* `npm run E2E` - create all yoshi projects and install, build and test each one of them.
* `npm run build` - Run [eslint](https://eslint.org/) on all packages with the following [rules](https://github.com/wix/yoshi/blob/master/.eslintrc).
* `npm run test:watch` Run the tests using watch mode.

## Adding a New Feature to the Yoshi Toolkit
1. Make sure the feature is tested.
2. Document it in [README.md](https://github.com/wix/yoshi/blob/master/README.md)

## Running Tests Locally
Yoshi's test suite, in its current state, takes a long time to complete and (unfortunately) contains flaky tests. Therefore, we advise limiting the scope of the test execution in your local environment to the tests that are most affected by your changes. Limit the scope using [mocha's `only` function](https://mochajs.org/#exclusive-tests).

After the limited scope of tests passes locally you can push your changes and have the `Pull Request CI Server` build and run all of the tests as the test suite is much less flaky on the [CI server](http://pullrequest-tc.dev.wixpress.com/viewType.html?buildTypeId=FedInfra_Yoshi).

### Test Phases
In order to simplify Yoshi's tests we created a helper utility called [`test-phases`](https://github.com/wix/yoshi/blob/master/test/helpers/test-phases.js). This utility is in charge of setting up the environment for the test (`package.json`, `pom.xml`, source files, etc) in a temp directory, running Yoshi's commands (`start`, `build`, `lint`, etc) and asserting against the result (stdout, file content, exit code, etc).
You can see an example usage of `test-phases` [here](https://github.com/wix/yoshi/blob/master/test/lint.spec.js).

### Debugging Tests
You might run into an issue where you have a test that seems to run and then hang (neither fail nor pass).
This usually means that there was an error but you can't see it.
The reason behind this is that Yoshi mutes the output of all the tests by default in order not to spam the build log in the CI. In order to see the output of the tests, and see the error they threw, you can do one of the two:

```js
it('should do something', () => {
  const res = test
    .verbose() // <------ add this
    .setup({
      //...
    })
    .execute(/* some task*/);

  expect(/* something */).to.equal(/* something */);
});
```

Alternatively, you can run all your tests (or just the focused ones) with the verbose flag in the following way:
```bash
VERBOSE_TESTS=true npm test
```
This is the same as adding the `.verbose()` method to each and every test.

## Running E2E Tests
The E2E suite will create a corresponding E2E test for each template from `projects/create-yoshi-app/templates` directory. It will generate the project in a temporary directory, it will then run `npm install` & `npm test` to verify that it's not failing.

* Verbose mode:

`-v`/`--verbose` output verbose logs, good for debugging
```bash
./scripts/runE2E.js --verbose
```

* Focus specific templates using regex:

Example: will match `client` & `client-typescript` projects
```bash
./scripts/runE2E.js client
```

## Adding a Template
Create a directory in  `packages/create-yoshi-app/templates/<template-name>` and another one for typescript `packages/create-yoshi-app/templates/<template-name>-typescript`. It will be tested automatically in the `E2E` suite.

## Release a New Version
Start by heading to the [CHANGELOG.md](https://github.com/wix/yoshi/blob/master/CHANGELOG.md) and insert the version's changes. See [commits section](https://github.com/wix/yoshi/commits/master) to verify you haven't missed anything

* New releases can be issued from branch `master`.

* `alpha`/`beta`/`rc` versions should be issued from a branch named `version_${version_name}`.

* Hotfixes for an older version should be issued form a branch named `hotfix_${version_name}`.

To create a new version use the following command:

```bash
npm run createVersion
```

This command will open an interactive UI for choosing the version, it will bump it in the relevant packages and add a git tag.

> It runs [lerna publish --skip-npm](https://github.com/lerna/lerna#--skip-npm) under the hood

Now Push the commits and tag to GitHub

```bash
git push origin master/version_*/hotfix_* --follow-tags
```

In the end of the [build](http://ci.dev.wix/viewType.html?buildTypeId=Wix_Angular_WixHaste_HastePresetYoshi) (unless there is a failure) the release should be published to npm
