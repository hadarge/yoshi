## Monorepo support

### MVP

No critical blockers or issues that make it hard for `REP` to work and be productive. Yoshi will use Lerna to get all of the project's packages and infer which are apps and which are libraries.

**Note:** Initially, Yoshi will only support monorepos with a single app and many libraries.

#### Build

Will build libraries with `tsc -b` and copy their non-js assets (css, images, etc...). This is done to publish transpiled code. Then, it will build the only app by spawning a `build` command in its directory.

#### Start

Will start the entire monorepo for development.

Initially, we won't use `tsc -b -w` to transpile libraries and instead use `ts-loader` to transpile projects in the monorepo. At least until https://github.com/TypeStrong/ts-loader/issues/851 sees progress.

Transpiling code with `tsc -b -w` with Webpack watching the output creates sub-optimal developer experience:

- Webpack's watch is triggered multiple times if a package that is shared across multiple ones is changed.
- Output and errors are inconsistent: Sometimes showing from Webpack and other times from the background `tsc` process.
- Debugging can be harder as Webpack consumes transpiled code and doesn't treat the `.map` files (requires `source-map-loader`).

Finally, it will watch non-js library assets and copy them to `dist`, similarily to `build`.

#### Test

Will run two different Jest runs. One for libraries with pretty basic config, and a 2nd one for the only app by spawning a `test` command in its directory.

In the future, we should be able to have a single Jest config for the entire monorepo.

#### Release

Will run `yoshi release` in every app in the monorepo followed by `npm-ci publish`. This can move to `ci-scripts` in the future.

### Possible future features

- Run minimal build/only packages that changed since a certain commit.
- Support working on multiple apps.
- Require only top-level (monorepo) Yoshi scripts.
- Single Jest config.
- Babel support.
- Infer project references, see https://github.com/Microsoft/TypeScript/issues/25376.
- Use `ts-loader` to transpile project references https://github.com/TypeStrong/ts-loader/issues/851.
- Tests the monorepo setup(?)

### Issues with `REP`

- Hot Module Replacement: What's missing?
- Publishing/GAing issues(?)
- I18N issues(?)
- Working with linked projects(?)
