# Changelog

## 4.7.2 (2019-05-29)

#### :rocket: New Feature

- `create-yoshi-app`
  - [#1342](https://github.com/wix/yoshi/pull/1342) `ooi` templates have a `"start:editor"` script in npm scripts ([@ranyitz](https://github.com/ranyitz))
  - [#1337](https://github.com/wix/yoshi/pull/1337) Work against production when running `npm start` ([@ranyitz](https://github.com/ranyitz))

#### :nail_care: Polish

- `yoshi-config`
  - [#1340](https://github.com/wix/yoshi/pull/1340) Remove the unused configuration option - `universalProject` ([@ranyitz](https://github.com/ranyitz))

## 4.7.1 (2019-05-29)

#### :bug: Bug Fix

- `yoshi-helpers`, `yoshi`
  - [#1338](https://github.com/wix/yoshi/pull/1338) Fix `MANAGEMENT_PORT` default and introduce `GRPC_PORT` ([@alexandervain](https://github.com/alexandervain))
- `create-yoshi-app`
  - [#1336](https://github.com/wix/yoshi/pull/1336) Use wallaby jest setup instead of mocha in library template ([@yurynix](https://github.com/yurynix))

## 4.7.0 (2019-05-28)

#### :rocket: New Feature

- `jest-yoshi-preset`
  - [#1330](https://github.com/wix/yoshi/pull/1330) Add `@types/jest` dependency for better autocompletions in tests ([@litalwix](https://github.com/litalwix))

#### :nail_care: Polish

- `yoshi`
  - [#1331](https://github.com/wix/yoshi/pull/1331) Limit useless server HMR logs ([@ronami](https://github.com/ronami))

## 4.6.6 (2019-05-26)

#### :house: Internal

- `create-yoshi-app`
  - [#1327](https://github.com/wix/yoshi/pull/1327) Add support for multiple projects in `create-yoshi-app:dev` ([@ranyitz](https://github.com/ranyitz))

## 4.6.5 (2019-05-26)

#### :house: Internal

- `create-yoshi-app`
  - [#1326](https://github.com/wix/yoshi/pull/1326) Reuse `createApp` from `dev` script and move relevant parts to the `bin` directory ([@ranyitz](https://github.com/ranyitz))

## 4.6.4 (2019-05-26)

#### :bug: Bug Fix

- [#1320](https://github.com/wix/yoshi/pull/1320) Fix the migration guide of version 4 ([@ranyitz](https://github.com/ranyitz))

#### :nail_care: Polish

- `create-yoshi-app`
  - [#1322](https://github.com/wix/yoshi/pull/1322) Yoshi 4 migration `ooi` template ([@ranyitz](https://github.com/ranyitz))
  - [#1316](https://github.com/wix/yoshi/pull/1316) Refactor `src` file structure for `ooi` TypeScript template ([@ranyitz](https://github.com/ranyitz))

## 4.6.3 (2019-05-22)

#### :bug: Bug Fix

- `create-yoshi-app`
  - [#1312](https://github.com/wix/yoshi/pull/1312) Generators: revert testkit `server`, back to using `app`. ([@yanivefraim](https://github.com/yanivefraim))
- `jest-environment-yoshi-bootstrap`, `jest-environment-yoshi-puppeteer`, `yoshi-config`
  - [#1307](https://github.com/wix/yoshi/pull/1307) Refresh jest's watch mode when updating jest-yoshi-config. ([@brumeregan](https://github.com/brumeregan))

#### :nail_care: Polish

- `create-yoshi-app`

  - [#1311](https://github.com/wix/yoshi/pull/1311) create-yoshi-app: minor cleanups towards the perfection. ([@hugebdu](https://github.com/hugebdu))
  - [#1286](https://github.com/wix/yoshi/pull/1286) Add wix-ui-tpa provider - for mobile mode. ([@jonathanadler](https://github.com/jonathanadler))

## 4.6.2 (2019-05-21)

#### :rocket: New Feature

- `create-yoshi-app`
  - [#1306](https://github.com/wix/yoshi/pull/1306) Change Bootstrap's testkit to use server, instead of app. ([@yanivefraim](https://github.com/yanivefraim))
  - [#1302](https://github.com/wix/yoshi/pull/1302) Upgrade react to 16.8. ([@yanivefraim](https://github.com/yanivefraim))

#### :bug: Bug Fix

- `create-yoshi-app`, `yoshi-template-intro`
  - [#1305](https://github.com/wix/yoshi/pull/1305) Update generators to use Webpack's dynamic import. ([@yanivefraim](https://github.com/yanivefraim))
- `jest-environment-yoshi-puppeteer`, `yoshi`
  - [#1053](https://github.com/wix/yoshi/pull/1053) Use sockjs instead of ipc for server HMR communication. ([@ronami](https://github.com/ronami))
- `yoshi`
  - [#1303](https://github.com/wix/yoshi/pull/1303) Remove https for opening browser, `npm start` ([@brumeregan](https://github.com/brumeregan))

## 4.6.1 (2019-05-20)

#### :bug: Bug Fix

- `yoshi`
  - [#1301](https://github.com/wix/yoshi/pull/1301) Ignore monorepo hoisted dependencies in server bundle ([@ronami](https://github.com/ronami))

## 4.6.0 (2019-05-19)

#### :rocket: New Feature

- `create-yoshi-app`
  - [#1284](https://github.com/wix/yoshi/pull/1284) Update `fullstack` & `client` templates to use lazy-loaded `<Intro />` component. ([@yavorsky](https://github.com/yavorsky))

## 4.5.3 (2019-05-16)

#### :rocket: New Feature

- `yoshi-template-intro`
  - [#1258](https://github.com/wix/yoshi/pull/1258) Add `yoshi-template-intro` package to import it from all templates ([@yavorsky](https://github.com/yavorsky))

#### :bug: Bug Fix

- `yoshi-helpers`
  - [#1263](https://github.com/wix/yoshi/pull/1263) Fix `babel-preset-yoshi` resolve path ([@yavorsky](https://github.com/yavorsky))

## 4.5.2 (2019-05-16)

#### :bug: Bug Fix

- `yoshi`
  - [#1288](https://github.com/wix/yoshi/pull/1288) Don't remove `viewBox` from `svg` when being loaded as react component ([@ipanasenko](https://github.com/ipanasenko))

## 4.5.1 (2019-05-15)

#### :rocket: New Feature

- `yoshi`
  - [#1293](https://github.com/wix/yoshi/pull/1293) Verify typescript references before `build`/`start` ([@ronami](https://github.com/ronami))
  - [#1292](https://github.com/wix/yoshi/pull/1292) Add `InterpolateHtmlPlugin` for `experimentalBuildHtml` ([@yanivefraim](https://github.com/yanivefraim))

## 4.5.0 (2019-05-14)

#### :rocket: New Feature

- `yoshi-config`, `yoshi`
  - [#1285](https://github.com/wix/yoshi/pull/1285) Basic monorepo support ([@ronami](https://github.com/ronami))

#### :bug: Bug Fix

- `yoshi`
  - [#1279](https://github.com/wix/yoshi/pull/1279) Resolve symlinks to their symlinked locations in Webpack ([@ronami](https://github.com/ronami))

#### :nail_care: Polish

- `yoshi-config`, `yoshi`
  - [#1291](https://github.com/wix/yoshi/pull/1291) Resolve symlinks only in monorepos ([@ronami](https://github.com/ronami))
- `yoshi`
  - [#1282](https://github.com/wix/yoshi/pull/1282) Log full URL to CDN, including scheme and port ([@danielagreen](https://github.com/danielagreen))

#### :memo: Documentation

- [#1290](https://github.com/wix/yoshi/pull/1290) Fix migration guide to Yoshi V4 ([@yanivefraim](https://github.com/yanivefraim))

## 4.4.3 (2019-05-08)

#### :rocket: New Feature

- `tslint-config-yoshi-base`, `tslint-config-yoshi`, `yoshi`
  - [#1278](https://github.com/wix/yoshi/pull/1278) Add React Hooks `ts-lint` rule ([@aarnoldaas](https://github.com/aarnoldaas))

#### :bug: Bug Fix

- `create-yoshi-app`
  - [#1281](https://github.com/wix/yoshi/pull/1281) Fix OOI template `e2e` tests ([@gileck](https://github.com/gileck))

## 4.4.2 (2019-05-08)

#### :rocket: New Feature

- `eslint-config-yoshi-base`, `eslint-config-yoshi`, `yoshi`
  - [#1274](https://github.com/wix/yoshi/pull/1274) Add React Hooks `eslint` rules ([@aarnoldaas](https://github.com/aarnoldaas))

#### :bug: Bug Fix

- `create-yoshi-app`
  - [#1237](https://github.com/wix/yoshi/pull/1237) Remove `@types/axios` from devDeps ([@ipanasenko](https://github.com/ipanasenko))
- `yoshi`
  - [#1280](https://github.com/wix/yoshi/pull/1280) Fix hash for assets ([@yanivefraim](https://github.com/yanivefraim))

## 4.4.1 (2019-05-07)

#### :bug: Bug Fix

- `yoshi`
  - [#1262](https://github.com/wix/yoshi/pull/1262) Add jest-cli as a direct yoshi dependency. ([@yavorsky](https://github.com/yavorsky))
- `create-yoshi-app`
  - [#1243](https://github.com/wix/yoshi/pull/1243) Fix issues with lint .js files in typescript environments ([@dmfilipenko](https://github.com/dmfilipenko))

#### :nail_care: Polish

- `yoshi`
  - [#1275](https://github.com/wix/yoshi/pull/1275) Rename ejs production file for html webpack plugin ([@yanivefraim](https://github.com/yanivefraim))

## 4.4.0 (2019-05-06)

#### :rocket: New Feature

- `yoshi-config`, `yoshi`
  - [#1206](https://github.com/wix/yoshi/pull/1206) Pipe output to `server.log` in App flow ([@ihork](https://github.com/ihork))

#### :bug: Bug Fix

- [#1271](https://github.com/wix/yoshi/pull/1271) Configure algolia to search according to the version specified ([@ranyitz](https://github.com/ranyitz))

#### :nail_care: Polish

- `yoshi-config`
  - [#1251](https://github.com/wix/yoshi/pull/1251) Improve error logging in jest setup error handling ([@rokasmik](https://github.com/rokasmik))
- `yoshi-helpers`, `yoshi`
  - [#1270](https://github.com/wix/yoshi/pull/1270) Remove migrate to scoped packages task ([@aarnoldaas](https://github.com/aarnoldaas))
- `create-yoshi-app`
  - [#1267](https://github.com/wix/yoshi/pull/1267) Add `spec-setup` with `react-testing-library/clean-after-each` ([@aarnoldaas](https://github.com/aarnoldaas))
- `jest-yoshi-preset`
  - [#1208](https://github.com/wix/yoshi/pull/1208) Throw an error in case `MATCH_ENV` was not used properly ([@orimwix](https://github.com/orimwix))

#### :house: Internal

- `create-yoshi-app`
  - [#1269](https://github.com/wix/yoshi/pull/1269) Add another `100,000ms` timeout to verify there is no timeout problem in template tests ([@ranyitz](https://github.com/ranyitz))
- `yoshi-config`
  - [#964](https://github.com/wix/yoshi/pull/964) Add basic unit tests for `yoshi-config`'s `validateConfig` ([@cowchimp](https://github.com/cowchimp))

## 4.3.3 (2019-05-02)

#### :rocket: New Feature

- `yoshi-helpers`, `yoshi`
  - [#1224](https://github.com/wix/yoshi/pull/1224) Create manifest JSON file with mapping to initial assets ([@ronami](https://github.com/ronami))
- `yoshi`
  - [#1260](https://github.com/wix/yoshi/pull/1260) Enable `--source-map` option in app flow build ([@ronenst](https://github.com/ronenst))

#### :nail_care: Polish

- `create-yoshi-app`
  - [#1255](https://github.com/wix/yoshi/pull/1255) OOI generator best practices ([@jonathanadler](https://github.com/jonathanadler))

## 4.3.2 (2019-04-28)

#### :rocket: New Feature

- [#1200](https://github.com/wix/yoshi/pull/1200) Make deploy "website" to surge.sh conditional ([@nktssh](https://github.com/nktssh))

#### :bug: Bug Fix

- `yoshi`
  - [#1253](https://github.com/wix/yoshi/pull/1253) Remove HMR from production bundle ([@yanivefraim](https://github.com/yanivefraim))
  - [#1252](https://github.com/wix/yoshi/pull/1252) Remove server `ts-loader` config ([@yairhaimo](https://github.com/yairhaimo))
  - [#1244](https://github.com/wix/yoshi/pull/1244) Add server bundle on build logs ([@koretskiyav](https://github.com/koretskiyav))
- `jest-environment-yoshi-puppeteer`
  - [#1245](https://github.com/wix/yoshi/pull/1245) Make puppeteer ignore ssl errors if user run with flag ssl:true ([@dmfilipenko](https://github.com/dmfilipenko))

#### :nail_care: Polish

- `create-yoshi-app`
  - [#1249](https://github.com/wix/yoshi/pull/1249) Use major version in nvmrc, and not a specific one ([@jonathanadler](https://github.com/jonathanadler))

#### :house: Internal

- `create-yoshi-app`
  - [#1197](https://github.com/wix/yoshi/pull/1197) Simplify biz-mgr babel template ([@yurynix](https://github.com/yurynix))
- Other
  - [#1247](https://github.com/wix/yoshi/pull/1247) Update docusaurus ([@dmfilipenko](https://github.com/dmfilipenko))

## 4.3.1 (2019-04-22)

#### :nail_care: Polish

- `create-yoshi-app`
  - [#1230](https://github.com/wix/yoshi/pull/1230) Simplify ooi javascript src directory file structure ([@ranyitz](https://github.com/ranyitz))

## 4.3.0 (2019-04-22)

#### :house: Internal

- `yoshi`
  - [2cb5ec0](https://github.com/wix/yoshi/commit/2cb5ec044ee9c505e74d0b5517b61fe0f167c55f) Bump `tpa-style-webpack-plugin`

#### :bug: Bug Fix

- `yoshi-angular-dependencies`, `yoshi`
  - [#1226](https://github.com/wix/yoshi/pull/1226) Provide `yoshi-runtime` by default ([@ronami](https://github.com/ronami))
- `create-yoshi-app`
  - [539abe9](https://github.com/wix/yoshi/commit/539abe9aae31b40988ea6ad21998dff4531b420a) Add missing dev dependecy to biz-mgr templates

## 4.2.2 (2019-04-07)

#### :rocket: New Feature

- `create-yoshi-app`
  - [#1223](https://github.com/wix/yoshi/pull/1223) Node library template is added to the list ([@ranyitz](https://github.com/ranyitz))
  - [#1217](https://github.com/wix/yoshi/pull/1217) Out of iframe template is added to the list ([@ranyitz](https://github.com/ranyitz))

#### :memo: Documentation

- [#1225](https://github.com/wix/yoshi/pull/1225) Remove universal template from project types documentation ([@ranyitz](https://github.com/ranyitz))

#### :house: Internal

- `create-yoshi-app`
  - [#1222](https://github.com/wix/yoshi/pull/1222) Separate template tests into different status checks on CI ([@ranyitz](https://github.com/ranyitz))
- Other
  - [#1212](https://github.com/wix/yoshi/pull/1212) Adjust internal `createVersion` script to generate versioned docs ([@ronami](https://github.com/ronami))

## 4.2.1 (2019-04-04)

#### :bug: Bug Fix

- `yoshi-config`, `yoshi`
  - [#1216](https://github.com/wix/yoshi/pull/1216) Webpack HTML plugin fixes ([@ronami](https://github.com/ronami))
- `create-yoshi-app`
  - [#1213](https://github.com/wix/yoshi/pull/1213) Wrong `MATCH_ENV` in VS Code settings ([@bt4R9](https://github.com/bt4R9))

#### :memo: Documentation

- [#1194](https://github.com/wix/yoshi/pull/1194) Add versioned documentation 🎉🐉 ([@nktssh](https://github.com/nktssh))

## 4.2.0 (2019-04-04)

#### :rocket: New Feature

- `yoshi-config`, `yoshi-helpers`, `yoshi`
  - [#1090](https://github.com/wix/yoshi/pull/1090) Html Webpack Plugin MVP (experimental) ([@ronami](https://github.com/ronami))
- `jest-yoshi-preset`
  - [#1193](https://github.com/wix/yoshi/pull/1193) Allow using JSDOM in v14 (experimental) ([@nktssh](https://github.com/nktssh))
  - [#1160](https://github.com/wix/yoshi/pull/1160) Add to our Jest preset a graphql transform ([@yurynix](https://github.com/yurynix))
- `create-yoshi-app`
  - [#967](https://github.com/wix/yoshi/pull/967) Add sentry and fedops to client and fullstack apps ([@yaelhe](https://github.com/yaelhe))
  - [#1190](https://github.com/wix/yoshi/pull/1190) Add the ability to use an answers json file instead of prompt ([@Schniz](https://github.com/Schniz))

#### :bug: Bug Fix

- `yoshi`
  - [#1203](https://github.com/wix/yoshi/pull/1203) Wrong displayName in jest wallaby ([@bt4R9](https://github.com/bt4R9))

#### :house: Internal

- `yoshi`
  - [#1205](https://github.com/wix/yoshi/pull/1205) Fix failing integration tests (Babel) ([@ronami](https://github.com/ronami))
  - [#1198](https://github.com/wix/yoshi/pull/1198) Remove an unused and undocumented way to disable thread optimization in Typescript ([@ronami](https://github.com/ronami))
- `create-yoshi-app`
  - [#1196](https://github.com/wix/yoshi/pull/1196) Refactor create yoshi app ([@ranyitz](https://github.com/ranyitz))

## 4.1.2 (2019-04-01)

#### :nail_care: Polish

- `yoshi`
  - [#1191](https://github.com/wix/yoshi/pull/1191) Add sensible defaults to `webpack-dev-server`'s `allowedHosts` ([@ronami](https://github.com/ronami))

## 4.1.1 (2019-03-31)

#### :rocket: New Feature

- `yoshi`
  - [#1188](https://github.com/wix/yoshi/pull/1188) Support `externalUnprocessedModules` config option for transpiling TypeScript files ([@ronami](https://github.com/ronami))

#### :nail_care: Polish

- `create-yoshi-app`
  - [#1186](https://github.com/wix/yoshi/pull/1186) Update `husky` && `lint-staged` use new recommended config format ([@ronami](https://github.com/ronami))

#### :memo: Documentation

- [#1184](https://github.com/wix/yoshi/pull/1184) Tiny fix for app-flow guide (fix image url) ([@sidoruk-sv](https://github.com/sidoruk-sv))

## 4.1.0 (2019-03-27)

#### :rocket: New Feature

- `yoshi`
  - [#1166](https://github.com/wix/yoshi/pull/1166) Support opening the browser on a different url with `--url` (for !appFlow) ([@yairhaimo](https://github.com/yairhaimo))

#### :nail_care: Polish

- `create-yoshi-app`, `yoshi`
  - [#1182](https://github.com/wix/yoshi/pull/1182) Don't run Stylelint during `yoshi lint` ([@ronami](https://github.com/ronami))
- `create-yoshi-app`
  - [#1167](https://github.com/wix/yoshi/pull/1167) Business Manager template opens correct url on `npm start` ([@yairhaimo](https://github.com/yairhaimo))

#### :house: Internal

- `tslint-config-yoshi-base`, `yoshi-helpers`, `yoshi`
  - [#1175](https://github.com/wix/yoshi/pull/1175) Fix ESLint warnings and set maximum warnings to 0 ([@ronami](https://github.com/ronami))
- `eslint-config-yoshi`, `jest-environment-yoshi-bootstrap`, `jest-environment-yoshi-puppeteer`, `jest-yoshi-preset`, `yoshi-helpers`, `yoshi`
  - [#1168](https://github.com/wix/yoshi/pull/1168) Require `yoshi-helpers` files directly and simplify bootstrap env vars logic ([@ronami](https://github.com/ronami))
- `eslint-config-yoshi-base`, `yoshi`
  - [#1170](https://github.com/wix/yoshi/pull/1170) Remove redundant `.eslintrc` files and remove lint warnings on react version ([@ronami](https://github.com/ronami))

## 4.1.0-rc.4 (2019-03-23)

#### :boom: Breaking Change

- `create-yoshi-app`, `yoshi`
  - [#1164](https://github.com/wix/yoshi/pull/1164) Change the default server entry for `app-flow` from `test/dev-server` to `dev/server`, only relevant for client projects. ([@ronami](https://github.com/ronami))

#### :nail_care: Polish

- `create-yoshi-app`, `yoshi`
  - [#1164](https://github.com/wix/yoshi/pull/1164) Fail gracefully if `source-map-support` is not installed. ([@ronami](https://github.com/ronami))
- `jest-environment-yoshi-bootstrap`, `yoshi-helpers`, `yoshi`
  - [#1161](https://github.com/wix/yoshi/pull/1161) Defaults for rpc and petri testkits ([@ranyitz](https://github.com/ranyitz))
- `create-yoshi-app`
  - [#1151](https://github.com/wix/yoshi/pull/1151) Polish generators ([@yanivefraim](https://github.com/yanivefraim))

#### :bug: Bug Fix

- `create-yoshi-app`, `yoshi`
  - [#1164](https://github.com/wix/yoshi/pull/1164) Show correct source maps in e2e jest tests, by not installing `source-map-support` twice. ([@ronami](https://github.com/ronami))

#### :memo: Documentation

- `create-yoshi-app`, `yoshi`
  - [#1164](https://github.com/wix/yoshi/pull/1164) Update migration guide for `app-flow` to install `source-map-support`. ([@ronami](https://github.com/ronami))
- [#1163](https://github.com/wix/yoshi/pull/1163) Update links in docs ([@yairhaimo](https://github.com/yairhaimo))

## 4.1.0-rc.3 (2019-03-21)

#### :rocket: New Feature

- `jest-yoshi-preset`
  - [#1150](https://github.com/wix/yoshi/pull/1150) Add `jest-watch-typeahead` plugin ([@ranyitz](https://github.com/ranyitz))

#### :bug: Bug Fix

- `yoshi-config`, `yoshi`
  - [#1153](https://github.com/wix/yoshi/pull/1153) Don't use node platform defaults if a project has old config folder ([@ronami](https://github.com/ronami))
- `yoshi`
  - [#1152](https://github.com/wix/yoshi/pull/1152) Parse properly `lint --fix` argument ([@yurynix](https://github.com/yurynix))
  - [#1140](https://github.com/wix/yoshi/pull/1140) Add Stylable Webpack plugin project level hashing ([@NitayRabi](https://github.com/NitayRabi))

#### :nail_care: Polish

- `create-yoshi-app`
  - [#1148](https://github.com/wix/yoshi/pull/1148) Remove `__STATICS_BASE_URL__` from client & fullstack templates ([@ranyitz](https://github.com/ranyitz))
- `yoshi`
  - [#1142](https://github.com/wix/yoshi/pull/1142) Supply a better default for New Relic log level in user's app servers ([@ranyitz](https://github.com/ranyitz))

#### :house: Internal

- `create-yoshi-app`
  - [#1138](https://github.com/wix/yoshi/pull/1138) Update business manager template to use dynamic imports ([@yurynix](https://github.com/yurynix))

## 4.1.0-rc.2 (2019-03-19)

#### :bug: Bug Fix

- `yoshi`
  - [#1141](https://github.com/wix/yoshi/pull/1141) Support bootstrap's environment parameters also in app flow ([@ranyitz](https://github.com/ranyitz))

## 4.1.0-rc.1 (2019-03-18)

#### :nail_care: Polish

- `create-yoshi-app`
  - [#1137](https://github.com/wix/yoshi/pull/1137) Replaced `enzyme` with `react-testing-library` ([@saarkuriel](https://github.com/saarkuriel))
- `create-yoshi-app`, `jest-environment-yoshi-bootstrap`, `yoshi`
  - [#1132](https://github.com/wix/yoshi/pull/1132) Adds defaults for bootstrap testkit and config emitter ([@ranyitz](https://github.com/ranyitz))

## 4.1.0-rc.0 (2019-03-18)

#### :rocket: New Feature

- `jest-yoshi-preset`
  - [#1130](https://github.com/wix/yoshi/pull/1130) Support using setup file from `test` and not only from `__tests__` ([@ronami](https://github.com/ronami))
- `create-yoshi-app`
  - [#1123](https://github.com/wix/yoshi/pull/1123) Migrate fullstack template to use app flow ([@ranyitz](https://github.com/ranyitz))

#### :bug: Bug Fix

- `yoshi`
  - [#1115](https://github.com/wix/yoshi/pull/1115) Server side rendering: generate long/short class names in prod/dev respectively ([@ronami](https://github.com/ronami))
  - [#1127](https://github.com/wix/yoshi/pull/1127) Add title (babel) for Babel task instead of a full path ([@ranyitz](https://github.com/ranyitz))

#### :nail_care: Polish

- `create-yoshi-app`, `jest-yoshi-preset`
  - [#1131](https://github.com/wix/yoshi/pull/1131) Remove redundant setup file, change default e2e timeout to 10s ([@ronami](https://github.com/ronami))
- `yoshi-style-dependencies`, `yoshi`
  - [#1103](https://github.com/wix/yoshi/pull/1103) Minimize the impact of conflicting `sass` versions ([@ronami](https://github.com/ronami))
- `yoshi-helpers`, `yoshi`
  - [#1122](https://github.com/wix/yoshi/pull/1122) Verify that all yoshi related dependencies are in the same major version ([@ronami](https://github.com/ronami))
- `jest-yoshi-preset`, `yoshi`
  - [#1129](https://github.com/wix/yoshi/pull/1129) Remove `babel-core` 7-bridge ([@yairhaimo](https://github.com/yairhaimo))
- `jest-yoshi-preset`
  - [#1128](https://github.com/wix/yoshi/pull/1128) Use Jests's default `moduleFileExtensions` configuration ([@ranyitz](https://github.com/ranyitz))
- `create-yoshi-app`
  - [#1125](https://github.com/wix/yoshi/pull/1125) Change the old link to the documentation site in starting link ([@ranyitz](https://github.com/ranyitz))
- `yoshi`
  - [#1100](https://github.com/wix/yoshi/pull/1100) Optimize Wallaby for Jest ([@ArtemGovorov](https://github.com/ArtemGovorov))

#### :memo: Documentation

- [#1108](https://github.com/wix/yoshi/pull/1108) Version 4 migration guide/blog ([@ronami](https://github.com/ronami))

#### :house: Internal

- `yoshi`
  - [#1120](https://github.com/wix/yoshi/pull/1120) Remove `haste-task-babel` dependency ([@yavorsky](https://github.com/yavorsky))
- `babel-preset-yoshi`
  - [#1111](https://github.com/wix/yoshi/pull/1111) Use `requireDefault` helper for babel plugins ([@yavorsky](https://github.com/yavorsky))
- `yoshi-config`
  - [#1087](https://github.com/wix/yoshi/pull/1087) Add an option to load the config without validating it ([@ranyitz](https://github.com/ranyitz))

## 4.1.0-alpha.7 (2019-03-13)

#### :rocket: New Feature

- `create-yoshi-app`, `eslint-config-yoshi`
  - [#1096](https://github.com/wix/yoshi/pull/1096) Update generators to use React Version 16 ([@ronami](https://github.com/ronami))

#### :bug: Bug Fix

- `jest-yoshi-preset`
  - [#1106](https://github.com/wix/yoshi/pull/1106) Inject regenerator-runtime globally for backward compatability (was dropped in Jest V24) ([@yanivefraim](https://github.com/yanivefraim))

## 4.1.0-alpha.6 (2019-03-11)

#### :rocket: New Feature

- `yoshi`
  - [#1084](https://github.com/wix/yoshi/pull/1084) Support opening the browser with a different URL using `--url` ([@ronami](https://github.com/ronami))

#### :bug: Bug Fix

- `yoshi-angular-dependencies`, `yoshi-style-dependencies`, `yoshi`
  - [#1095](https://github.com/wix/yoshi/pull/1095) Fix loader dependencies ([@yanivefraim](https://github.com/yanivefraim))
- `yoshi`
  - [#1094](https://github.com/wix/yoshi/pull/1094) Transpile server code with default compiler options for angular apps ([@ronami](https://github.com/ronami))
- `jest-environment-yoshi-puppeteer`, `yoshi`
  - [#1085](https://github.com/wix/yoshi/pull/1085) Bump puppeteer version to make sure a correct version is always installed ([@ronami](https://github.com/ronami))

#### :nail_care: Polish

- `yoshi`
  - [#1078](https://github.com/wix/yoshi/pull/1078) Polish the output of `build-app` to show file sizes ([@ronami](https://github.com/ronami))

#### :memo: Documentation

- [#1081](https://github.com/wix/yoshi/pull/1081) Fix setup docs according to new globs ([@yanivefraim](https://github.com/yanivefraim))

#### :house: Internal

- `jest-yoshi-preset`, `yoshi`
  - [#1077](https://github.com/wix/yoshi/pull/1077) Add missing integration tests to Yoshi's Jest setup ([@ronami](https://github.com/ronami))

## 4.1.0-alpha.5 (2019-03-05)

#### :bug: Bug Fix

- `yoshi`
  - [#1076](https://github.com/wix/yoshi/pull/1076) Fix Protractor glob pattern to use the new `e2eTest` glob ([@yanivefraim](https://github.com/yanivefraim))
  - [#1075](https://github.com/wix/yoshi/pull/1075) Support writing a stats file when running app-flow build ([@ronami](https://github.com/ronami))

## 4.1.0-alpha.4 (2019-03-05)

#### :boom: Breaking Change

- `jest-environment-yoshi-puppeteer`
  - [#1067](https://github.com/wix/yoshi/pull/1067) Add default Puppeteer timeouts ([@yanivefraim](https://github.com/yanivefraim))
- `create-yoshi-app`, `yoshi`
  - [#1006](https://github.com/wix/yoshi/pull/1006) Make Jest the default test runner when running `npx yoshi test` ([@yanivefraim](https://github.com/yanivefraim))

#### :bug: Bug Fix

- `yoshi`
  - [#1072](https://github.com/wix/yoshi/pull/1072) Fix https flag/option not starting `webpack-dev-server` in https ([@ronami](https://github.com/ronami))
  - [#1047](https://github.com/wix/yoshi/pull/1047) Run `eslint` even after stylelint errors ([@yanivefraim](https://github.com/yanivefraim))
  - [#1046](https://github.com/wix/yoshi/pull/1046) Do not show the name of files that didn't have `stylelint` errors ([@yanivefraim](https://github.com/yanivefraim))
- `yoshi-config`, `yoshi`
  - [#1071](https://github.com/wix/yoshi/pull/1071) Fix Webpack's version to `v4.28.4` ([@ronami](https://github.com/ronami))
- `yoshi-config`
  - [#1061](https://github.com/wix/yoshi/pull/1061) Use a base for globs and add `__tests__` to the new base ([@ranyitz](https://github.com/ranyitz))
- `jest-yoshi-preset`, `yoshi`
  - [#1059](https://github.com/wix/yoshi/pull/1059) Handle importing `svg` files in tests (mocha,jest,jest-yoshi-preset) for React 15 ([@ranyitz](https://github.com/ranyitz))

#### :nail_care: Polish

- `yoshi`
  - [#1073](https://github.com/wix/yoshi/pull/1073) Support old flow CLI options: `--ssl` and `--entry-point` ([@ronami](https://github.com/ronami))
  - [#1066](https://github.com/wix/yoshi/pull/1066) Improve TypeScript speed in watch mode using incremental API in app flow ([@yanivefraim](https://github.com/yanivefraim))
  - [#1065](https://github.com/wix/yoshi/pull/1065) Fix deprecated `resolve-url-loader` config ([@ronami](https://github.com/ronami))
  - [#1029](https://github.com/wix/yoshi/pull/1029) Configure `hot-update.json` of Webpack's HMR to be in `updates` directory ([@ranyitz](https://github.com/ranyitz))

#### :house: Internal

- Other
  - [#1058](https://github.com/wix/yoshi/pull/1058) Test improvements ([@yanivefraim](https://github.com/yanivefraim))
  - [#1056](https://github.com/wix/yoshi/pull/1056) Update Travis Node version to v10 ([@yanivefraim](https://github.com/yanivefraim))
  - [#1007](https://github.com/wix/yoshi/pull/1007) Configure Renovate ([@renovate[bot]](https://github.com/apps/renovate))
  - [#1022](https://github.com/wix/yoshi/pull/1022) Remove redundant dependencies from kitchensink projects ([@ronami](https://github.com/ronami))
- `yoshi`
  - [#1064](https://github.com/wix/yoshi/pull/1064) Remove redundant files ([@ronami](https://github.com/ronami))
  - [#1035](https://github.com/wix/yoshi/pull/1035) Configure npm to not automatically add `^` to installed dependencies ([@cowchimp](https://github.com/cowchimp))
  - [#1032](https://github.com/wix/yoshi/pull/1032) Update dependency terser to v3.16.1 ([@renovate[bot]](https://github.com/apps/renovate))
  - [#1031](https://github.com/wix/yoshi/pull/1031) Update dependency ng-annotate to v1.2.2 ([@renovate[bot]](https://github.com/apps/renovate))
  - [#1030](https://github.com/wix/yoshi/pull/1030) Update dependency detect-port to v1.3.0 ([@renovate[bot]](https://github.com/apps/renovate))
  - [#1033](https://github.com/wix/yoshi/pull/1033) Update dependency terser-webpack-plugin to v1.2.3 ([@renovate[bot]](https://github.com/apps/renovate))
  - [#1024](https://github.com/wix/yoshi/pull/1024) Freeze Yoshi's direct dependencies ([@cowchimp](https://github.com/cowchimp))
- `jest-environment-yoshi-puppeteer`, `yoshi-helpers`, `yoshi`
  - [#1020](https://github.com/wix/yoshi/pull/1020) Change app-flow tests to support testing Yoshi's testing infra ([@ronami](https://github.com/ronami))
- `yoshi-angular-dependencies`, `yoshi-config`, `yoshi-helpers`, `yoshi-style-dependencies`
  - [#1037](https://github.com/wix/yoshi/pull/1037) Freeze direct dependencies in `yoshi-*` packages ([@cowchimp](https://github.com/cowchimp))

## 4.1.0-alpha.3 (2019-02-26)

#### :rocket: New Feature

- `yoshi`
  - [#992](https://github.com/wix/yoshi/pull/992) Improve app flow: Show server errors in the browser and refresh the browser on server changes ([@ronami](https://github.com/ronami))

#### :bug: Bug Fix

- `yoshi`
  - [#1016](https://github.com/wix/yoshi/pull/1016) properly log port when waiting for server to start ([@netanelgilad](https://github.com/netanelgilad))
  - [#1017](https://github.com/wix/yoshi/pull/1017) Generate correct public path on local build ([@ranyitz](https://github.com/ranyitz))

## 4.1.0-alpha.2 (2019-02-25)

#### :boom: Breaking Change

- `babel-plugin-transform-hmr-runtime`, `create-yoshi-app`, `jest-environment-yoshi-bootstrap`, `jest-environment-yoshi-puppeteer`, `jest-yoshi-preset`, `yoshi`
  - [#954](https://github.com/wix/yoshi/pull/954) Migrate to Jest 24 ([@matveyok](https://github.com/matveyok))
- `create-yoshi-app`, `jest-environment-yoshi-puppeteer`, `jest-yoshi-preset`, `yoshi-config`, `yoshi-helpers`, `yoshi`

  - [#808](https://github.com/wix/yoshi/pull/808) Update test globs ([@ranyitz](https://github.com/ranyitz))

#### :nail_care: Polish

- `yoshi-config`, `yoshi`
  - [#1010](https://github.com/wix/yoshi/pull/1010) Change 'appflow' FT ([@yanivefraim](https://github.com/yanivefraim))

#### :house: Internal

- `create-yoshi-app`, `jest-yoshi-preset`, `yoshi`
  - [#1011](https://github.com/wix/yoshi/pull/1011) Fix server/business-manager generators for version 4 ([@yanivefraim](https://github.com/yanivefraim))

## 4.1.0-alpha.1 (2019-02-07)

#### :boom: Breaking Change

- `create-yoshi-app`, `eslint-config-yoshi-base`, `eslint-config-yoshi`, `jest-environment-yoshi-puppeteer`, `jest-yoshi-preset`, `tslint-config-yoshi`, `yoshi-angular-dependencies`, `yoshi-helpers`, `yoshi-style-dependencies`, `yoshi`
  - [#955](https://github.com/wix/yoshi/pull/955) Bump old dependencies and target only relevant latest browsers with `autoprefixer` ([@ronami](https://github.com/ronami))

## 4.1.0-alpha.0 (2019-02-05)

#### :boom: Breaking Change

- `babel-preset-yoshi`, `create-yoshi-app`, `jest-yoshi-preset`, `yoshi-config`, `yoshi-helpers`, `yoshi`
  - [#917](https://github.com/wix/yoshi/pull/917) Configure Babel to ignore `babelrc` and use `babel-preset-yoshi` ([@ronami](https://github.com/ronami))
- `create-yoshi-app`, `yoshi`
  - [#940](https://github.com/wix/yoshi/pull/940) Predefined Typescript definitions for Yoshi. **Requires a minimum version of Typescript 2.9** ([@saarkuriel](https://github.com/saarkuriel))
  - [#738](https://github.com/wix/yoshi/pull/738) Don't run tests in `start` by default ([@Schniz](https://github.com/Schniz))
- `create-yoshi-app`, `jest-yoshi-preset`, `yoshi`
  - [#781](https://github.com/wix/yoshi/pull/781) Allow using SVGs as React components ([@ranyitz](https://github.com/ranyitz))
- `yoshi`
  - [#765](https://github.com/wix/yoshi/pull/765) Remove `DynamicPublicPath` plugin from `webpack.config.js` ([@netanelgilad](https://github.com/netanelgilad))
- `eslint-config-yoshi-base`, `eslint-config-yoshi`, `yoshi`
  - [#712](https://github.com/wix/yoshi/pull/712) Migrate to `eslint` version 5 ([@ronami](https://github.com/ronami))
- `babel-plugin-transform-hmr-runtime`, `babel-preset-yoshi`, `jest-yoshi-preset`, `yoshi-helpers`, `yoshi`
  - [#646](https://github.com/wix/yoshi/pull/646) Transpile JavaScript using Babel 7 ([@yavorsky](https://github.com/yavorsky))

#### :rocket: New Feature

- `create-yoshi-app`, `stylelint-config-yoshi`, `yoshi`
  - [#750](https://github.com/wix/yoshi/pull/750) Lint Stylesheets by default ([@Schniz](https://github.com/Schniz))
- `yoshi`
  - [#711](https://github.com/wix/yoshi/pull/711) Use `cssnano` as a CSS minifier ([@ronami](https://github.com/ronami))
  - [#538](https://github.com/wix/yoshi/pull/538) Wait for app-server port before finishing app-server task ([@netanelgilad](https://github.com/netanelgilad))

#### :nail_care: Polish

- `yoshi-config`, `yoshi`
  - [#948](https://github.com/wix/yoshi/pull/948) Remove `experimentalTSTarget` configuration option ([@saarkuriel](https://github.com/saarkuriel))
- `yoshi`
  - [#937](https://github.com/wix/yoshi/pull/937) Use `svg-url-loader` instead of `url-loader` to optimize bundle size ([@saarkuriel](https://github.com/saarkuriel))
  - [#739](https://github.com/wix/yoshi/pull/739) Generate separate assets into `dist/statics/assets` ([@ronami](https://github.com/ronami))
  - [#714](https://github.com/wix/yoshi/pull/714) Move from `uglifyjs` to `terser` ([@ronami](https://github.com/ronami))
  - [#715](https://github.com/wix/yoshi/pull/715) Small `webpack` improvements ([@ronami](https://github.com/ronami))

#### :memo: Documentation

- `stylelint-config-yoshi`
  - [#807](https://github.com/wix/yoshi/pull/807) Add documentation for stylesheet linting ([@Schniz](https://github.com/Schniz))

#### :house: Internal

- `babel-preset-yoshi`, `yoshi`
  - [#815](https://github.com/wix/yoshi/pull/815) Fix app flow tests on version 4.x ([@ronami](https://github.com/ronami))
- `yoshi`
  - [#734](https://github.com/wix/yoshi/pull/734) Open browser on `yoshi start` ([@netanelgilad](https://github.com/netanelgilad))

## 3.30.5 (2019-02-21)

#### :bug: Bug Fix

- `yoshi-helpers`, `yoshi`
  - [#1000](https://github.com/wix/yoshi/pull/1000) Upgrade `mocha-teamcity-reporter` to v2 ([@yairhaimo](https://github.com/yairhaimo))

#### :nail_care: Polish

- `yoshi-config`, `yoshi`
  - [#977](https://github.com/wix/yoshi/pull/977) Remove `ajv` from `yoshi` and upgrade the version ([@ranyitz](https://github.com/ranyitz))

#### :memo: Documentation

- `tslint-config-yoshi`
  - [#993](https://github.com/wix/yoshi/pull/993) Update README.md with `tslint-config-yoshi` ([@sidoruk-sv](https://github.com/sidoruk-sv))

#### :house: Internal

- `create-yoshi-app`, `eslint-config-yoshi-base`, `tslint-config-yoshi-base`, `yoshi-helpers`, `yoshi`
  - [#978](https://github.com/wix/yoshi/pull/978) Do not pack `dist` and `test` in `yoshi` main package ([@ranyitz](https://github.com/ranyitz))

## 3.30.4 (2019-02-20)

#### :bug: Bug Fix

- `yoshi-helpers`, `yoshi`
  - [#990](https://github.com/wix/yoshi/pull/990) Remove `mocha-teamcity-reporter` as a temporary fix ([@yairhaimo](https://github.com/yairhaimo))
- `jest-yoshi-preset`
  - [#973](https://github.com/wix/yoshi/pull/973) Fix watch Jest mode - do not watch 'dist' and 'target' folders ([@yanivefraim](https://github.com/yanivefraim))
- `create-yoshi-app`
  - [#984](https://github.com/wix/yoshi/pull/984) Update biz mgr template to address configuration changes ([@yurynix](https://github.com/yurynix))
- `yoshi-helpers`
  - [#969](https://github.com/wix/yoshi/pull/969) Fix checking if file is exist. ([@rudnitskih](https://github.com/rudnitskih))

#### :house: Internal

- `create-yoshi-app`
  - [#983](https://github.com/wix/yoshi/pull/983) Remove component library generators from list ([@yairhaimo](https://github.com/yairhaimo))

## 3.30.3 (2019-02-10)

#### :bug: Bug Fix

- `yoshi-config`
  - [#976](https://github.com/wix/yoshi/pull/976) Lock AJV version due to a bug ([@yurynix](https://github.com/yurynix))

## 3.30.2 (2019-02-10)

- `yoshi`
  - [#975](https://github.com/wix/yoshi/pull/975) lock ajv version [yurynix](https://github.com/yurynix)

## 3.30.1 (2019-02-07)

#### :house: Internal

- `create-yoshi-app`
  - [#970](https://github.com/wix/yoshi/pull/970) Fix clash between test infra's .npmrc and .npmrc generated by the templates [cowchimp](https://github.com/cowchimp)
- `yohsi`
  - [#951](https://github.com/wix/yoshi/pull/951) Use fs-extra's `pathExists` instead of deprecated `exists` and make `fs-extra` a dependency instead of dev-dep. [yaelhe](https://github.com/yaelhe)

#### :nail_care: Polish

- `yoshi`
  - [#965](https://github.com/wix/yoshi/pull/965) Fail early if Yoshi is being run with an old Node version [cowchimp](https://github.com/cowchimp)

## 3.30.0 (2019-02-04)

#### :rocket: New Feature

- `yoshi`
  - [#958](https://github.com/wix/yoshi/pull/958) Update `stylable` runtime config ([@tomrav](https://github.com/tomrav))

#### :bug: Bug Fix

- `yoshi`
  - [#966](https://github.com/wix/yoshi/pull/966) Unfix `terser` version ([@yairhaimo](https://github.com/yairhaimo))

#### :nail_care: Polish

- `yoshi`
  - [#961](https://github.com/wix/yoshi/pull/961) Don't minimize server bundle ([@ronami](https://github.com/ronami))
- `yoshi-config`
  - [#963](https://github.com/wix/yoshi/pull/963) Change Yoshi's config schema to support setting `separateCss: true` ([@cowchimp](https://github.com/cowchimp))

## 3.29.0 (2019-02-04)

#### :rocket: New Feature

- `jest-yoshi-preset`, `yoshi`
  - [#909](https://github.com/wix/yoshi/pull/909) Upgrade stylable packages to 1.0.0+ ([@AviVahl](https://github.com/AviVahl))

#### :bug: Bug Fix

- `yoshi`
  - [#936](https://github.com/wix/yoshi/pull/936) Use TSLINT on JS files if project is Typescript (Closes [#929](https://github.com/wix/yoshi/issues/929)) ([@saarkuriel](https://github.com/saarkuriel))
- `yoshi-config`
  - [#941](https://github.com/wix/yoshi/pull/941) Update `yoshi-config-schema` to use webpack schema defaults ([@matveyok](https://github.com/matveyok))

#### :nail_care: Polish

- `create-yoshi-app`
  - [#953](https://github.com/wix/yoshi/pull/953) set `.npmrc` to `package-lock=false` in templates (#625) ([@cowchimp](https://github.com/cowchimp))
- `yoshi`
  - [#947](https://github.com/wix/yoshi/pull/947) Remove redundant include for GraphQL files ([@ronami](https://github.com/ronami))

#### :memo: Documentation

- [#957](https://github.com/wix/yoshi/pull/957) Add documentation for the why & how of using a lockfile ([@cowchimp](https://github.com/cowchimp))

#### :house: Internal

- Other
  - [#950](https://github.com/wix/yoshi/pull/950) Release website to Surge.sh on PR ([@saarkuriel](https://github.com/saarkuriel))
  - [#952](https://github.com/wix/yoshi/pull/952) Run website job on master only ([@saarkuriel](https://github.com/saarkuriel))
  - [#946](https://github.com/wix/yoshi/pull/946) Reorder `travis.yaml` ([@saarkuriel](https://github.com/saarkuriel))
- `yoshi-config`
  - [#941](https://github.com/wix/yoshi/pull/941) Update `yoshi-config-schema` to use webpack schema defaults ([@matveyok](https://github.com/matveyok))

## 3.28.0 (2019-01-27)

#### :rocket: New Feature

- `jest-yoshi-preset`, `yoshi`
- [#909](https://github.com/wix/yoshi/pull/909) Upgrade stylable packages to version `^1.0.0` ([@AviVahl](https://github.com/AviVahl))

## 3.27.0 (2019-01-24)

#### :rocket: New Feature

- `yoshi`
  - [#930](https://github.com/wix/yoshi/pull/930) Add process.env.IS_MINIFIED. ([@felixmosh](https://github.com/felixmosh))

#### :house: Internal

- `yoshi`
  - [#933](https://github.com/wix/yoshi/pull/933) App flow Typescript tests ([@ronami](https://github.com/ronami))
- Other
  - [#932](https://github.com/wix/yoshi/pull/932) Pass Jest's globalConfig to `jest-puppeteer` global setup/teardown functions ([@ronami](https://github.com/ronami))

## 3.26.0 (2019-01-21)

#### :rocket: New Feature

- `yoshi-helpers`, `yoshi`
  - [#915](https://github.com/wix/yoshi/pull/915) Adds `ARTIFACT_ID` env var to bundle ([@aaronvine](https://github.com/aaronvine))

#### :bug: Bug Fix

- `create-yoshi-app`
  - [#913](https://github.com/wix/yoshi/pull/913) Fix Business Manager artifact name in erb template ([@ronenst](https://github.com/ronenst))
- `yoshi`
  - [3b5fb8](https://github.com/wix/yoshi/commit/3b5fb86d3695b876d26944f2bee0667d2dee6052) Fix webpack version until webpack issue `#8656` is solved

#### :nail_care: Polish

- `create-yoshi-app`
  - [#919](https://github.com/wix/yoshi/pull/919) Add a "read more" link to `*.json.erb` template files ([@sidoruk-sv](https://github.com/sidoruk-sv))
  - [#911](https://github.com/wix/yoshi/pull/911) Replace deprecated `${workspaceRoot}` variable with `${workspaceFolder}` ([@sidoruk-sv](https://github.com/sidoruk-sv))

#### :house: Internal

- `jest-yoshi-preset`, `tslint-config-yoshi-base`, `tslint-config-yoshi`, `yoshi-helpers`, `yoshi`
  - [#920](https://github.com/wix/yoshi/pull/920) Bump dev dependency to Typescript 3 ([@ronami](https://github.com/ronami))

## 3.25.1 (2019-01-14)

#### :bug: Bug Fix

- `eslint-config-yoshi-base`
  - [#910](https://github.com/wix/yoshi/pull/910) Remove `jest/prefer-to-have-length` eslint rule ([@yairhaimo](https://github.com/yairhaimo))

## 3.25.0 (2019-01-13)

#### :rocket: New Feature

- `create-yoshi-app`
  - [#904](https://github.com/wix/yoshi/pull/904) Update Biz Mgr Babel generator template ([@yurynix](https://github.com/yurynix))

#### :house: Internal

- [#891](https://github.com/wix/yoshi/pull/891) Increase stalebot's counter params ([@yairhaimo](https://github.com/yairhaimo))

## 3.24.1 (2019-01-09)

#### :bug: Bug Fix

- `yoshi`, `create-yoshi-app`, `jest-environment-yoshi-puppeteer`, `jest-yoshi-preset`
  - [#906](https://github.com/wix/yoshi/pull/906) Bump `globby` version to 8.0.2, because 8.0.1 had an issue ([@yurynix](https://github.com/yurynix))

## 3.24.0 (2019-01-08)

#### :rocket: New Feature

- `create-yoshi-app`
  - [#850](https://github.com/wix/yoshi/pull/850) Migrate Business Manager Typescript template to jest/puppeteer ([@liorMar](https://github.com/liorMar))

#### :bug: Bug Fix

- `yoshi`
  - [#865](https://github.com/wix/yoshi/pull/865) Use webpack node lib mock config in storybook config ([@yairhaimo](https://github.com/yairhaimo))

## 3.23.0 (2018-12-31) :champagne: :fireworks:

#### :rocket: New Feature

- `yoshi-config`, `yoshi`
  - [#896](https://github.com/wix/yoshi/pull/896) Add opt-in Typescript transpliation target for ES modules ([@yairhaimo](https://github.com/yairhaimo))

#### :bug: Bug Fix

- `yoshi`
  - [#897](https://github.com/wix/yoshi/pull/897) Server bundle experiment should respect `hmr` config ([@yairhaimo](https://github.com/yairhaimo))

#### :memo: Documentation

- [#894](https://github.com/wix/yoshi/pull/894) Update export-es-module guide location ([@yakirn](https://github.com/yakirn))
- [#893](https://github.com/wix/yoshi/pull/893) Add a note about Lerna and tags for a new version release ([@yurynix](https://github.com/yurynix))

## 3.22.5 (2018-12-25)

#### :bug: Bug fix

- [#890](https://github.com/wix/yoshi/pull/890) Fix build on TeamCity PR CI, make it contain the correct webpack_require prefix (static url) [@yurynix](https://github.com/yurynix)

## 3.22.4 (2018-12-05)

#### :bug: Bug Fix

- [#875](https://github.com/wix/yoshi/pull/875) Add `petriSpecs` to config schema ([@yairhaimo](https://github.com/yairhaimo))

#### :house: Internal

- [#874](https://github.com/wix/yoshi/pull/874) Make directory listing test consistent ([@Schniz](https://github.com/Schniz))
- [#871](https://github.com/wix/yoshi/pull/871) Add a test that verifies directory listing in assets directory ([@yurynix](https://github.com/yurynix))

## 3.22.3 (2018-12-03)

#### :bug: Bug Fix

- `jest-yoshi-preset`
  - [#869](https://github.com/wix/yoshi/pull/869) Change Jest css transform regex to support node 8 ([@yairhaimo](https://github.com/yairhaimo))

## 3.22.2 (2018-12-02)

#### :bug: Bug Fix

- `jest-yoshi-preset`
  - [#868](https://github.com/wix/yoshi/pull/868) Re-Fix Jest css transform overriding Stylable transform ([@yairhaimo](https://github.com/yairhaimo))

## 3.22.1 (2018-12-02)

#### :bug: Bug Fix

- `jest-yoshi-preset`
  - [#866](https://github.com/wix/yoshi/pull/866) Fix Jest css transform overriding Stylable transform ([@yairhaimo](https://github.com/yairhaimo))

## 3.22.0 (2018-12-02)

#### :rocket: New Feature

- `jest-yoshi-preset`
  - [#857](https://github.com/wix/yoshi/pull/857) Add support for css ([@jonathanadler](https://github.com/jonathanadler))

#### :bug: Bug Fix

- `jest-environment-yoshi-puppeteer`
  - [#843](https://github.com/wix/yoshi/pull/843) Puppeteer: tearing down Parent Environment and no throw on `pageerror` ([@liorMar](https://github.com/liorMar))

#### :house: Internal

- Other
  - [#859](https://github.com/wix/yoshi/pull/859) Keep running all app flow tests even if one fails ([@ronami](https://github.com/ronami))
  - [#845](https://github.com/wix/yoshi/pull/845) Wait for `terminate` to resolve ([@yanivefraim](https://github.com/yanivefraim))
- `yoshi`
  - [#856](https://github.com/wix/yoshi/pull/856) Add missing app-flow tests for build output ([@ronami](https://github.com/ronami))
  - [#844](https://github.com/wix/yoshi/pull/844) Move HMR to `webpack` config ([@yurynix](https://github.com/yurynix))
  - [#855](https://github.com/wix/yoshi/pull/855) Enable watch tests ([@yurynix](https://github.com/yurynix))
  - [#851](https://github.com/wix/yoshi/pull/851) Improve app-flow tests and add missing tests ([@ronami](https://github.com/ronami))
  - [#752](https://github.com/wix/yoshi/pull/752) Increase max retries for tests, so they pass locally ([@yurynix](https://github.com/yurynix))
- `jest-environment-yoshi-puppeteer`, `yoshi-helpers`, `yoshi`
  - [#840](https://github.com/wix/yoshi/pull/840) Fix killing of server process and its children, for travis-ci ([@yanivefraim](https://github.com/yanivefraim))

## 3.21.0 (2018-11-21)

#### :rocket: New Feature

- `create-yoshi-app`
  - [#837](https://github.com/wix/yoshi/pull/837) Migrate templates to scoped packages ([@Schniz](https://github.com/Schniz))

#### :bug: Bug Fix

- `yoshi`
  - [#836](https://github.com/wix/yoshi/pull/836) Remove update-node-version task #645 ([@andriuss](https://github.com/andriuss))
- `yoshi-helpers`, `yoshi`
  - [#835](https://github.com/wix/yoshi/pull/835) Ignore ssl errors when proxying requests to the local cdn ([@netanelgilad](https://github.com/netanelgilad))
- `jest-environment-yoshi-puppeteer`, `yoshi`
  - [#834](https://github.com/wix/yoshi/pull/834) Merge user defined puppeteer args with default args ([@netanelgilad](https://github.com/netanelgilad))

#### :house: Internal

- `create-yoshi-app`, `eslint-config-yoshi-base`, `tslint-config-yoshi-base`, `yoshi-helpers`, `yoshi`
  - [#816](https://github.com/wix/yoshi/pull/816) Add no-extraneous-dependencies to eslintrc ([@netanelgilad](https://github.com/netanelgilad))
- Other
  - [#826](https://github.com/wix/yoshi/pull/826) Improve test:app-flow infra ([@ronami](https://github.com/ronami))
  - [#838](https://github.com/wix/yoshi/pull/838) Install chrome on travis ([@ranyitz](https://github.com/ranyitz))
- `jest-environment-yoshi-puppeteer`
  - [#832](https://github.com/wix/yoshi/pull/832) fix `cdnProxy.stop` method - wait for `closeProxy` to be resolved ([@yanivefraim](https://github.com/yanivefraim))
- `yoshi`
  - [#801](https://github.com/wix/yoshi/pull/801) Log test execution output if the test failed ([@netanelgilad](https://github.com/netanelgilad))

## 3.20.3 (2018-11-20)

#### :bug: Bug Fix

- `yoshi`
  - [#831](https://github.com/wix/yoshi/pull/831) Remove forward proxy from protractor ([@ranyitz](https://github.com/ranyitz))

#### :memo: Documentation

- [#812](https://github.com/wix/yoshi/pull/812) Mention tags used for changelog in contributing guide ([@yurynix](https://github.com/yurynix))

#### :house: Internal

- `yoshi`
  - [#827](https://github.com/wix/yoshi/pull/827) Fix puppeteer on travis ci ([@yanivefraim](https://github.com/yanivefraim))
- Other
  - [#825](https://github.com/wix/yoshi/pull/825) Add version_N.x branches to travis-ci ([@yanivefraim](https://github.com/yanivefraim))
  - [#824](https://github.com/wix/yoshi/pull/824) Fix travis to work with puppeteer ([@yanivefraim](https://github.com/yanivefraim))
- `create-yoshi-app`
  - [#814](https://github.com/wix/yoshi/pull/814) Mock `verifyRegistry` for unit tests ([@yanivefraim](https://github.com/yanivefraim))

## 3.20.2 (2018-11-19)

#### :bug: Bug Fix

- `yoshi`
  - [838e013](https://github.com/wix/yoshi/commit/838e0136e203ac903512f89173d521486b58d0fe) Fix version of `uglifyjs-webpack-plugin` ([@netanelgilad](https://github.com/netanelgilad))

## 3.20.1 (2018-11-19)

#### :bug: Bug Fix

- `yoshi`
  - [#810](https://github.com/wix/yoshi/pull/810) Add `uglifyjs-webpack-plugin` as a dependency ([@netanelgilad](https://github.com/netanelgilad))

## 3.20.0 (2018-11-19)

#### :rocket: New Feature

- `create-yoshi-app`
  - [#766](https://github.com/wix/yoshi/pull/766) Add platform app generator ([@yairhaimo](https://github.com/yairhaimo))

#### :bug: Bug Fix

- `jest-environment-yoshi-puppeteer`, `yoshi-helpers`, `yoshi`
  - [#735](https://github.com/wix/yoshi/pull/735) Start a forward proxy to intercept public cdn requests to the local cdn ([@netanelgilad](https://github.com/netanelgilad))
- `jest-yoshi-preset`, `yoshi-config`, `yoshi-helpers`, `yoshi`
  - [#787](https://github.com/wix/yoshi/pull/787) Fix puppeteer cdn issue ([@netanelgilad](https://github.com/netanelgilad))
  - [#775](https://github.com/wix/yoshi/pull/775) Starting cdn when e2e exists ([@amiryonatan](https://github.com/amiryonatan))
- `yoshi`
  - [#771](https://github.com/wix/yoshi/pull/771) Watch public dir during start and sync the static dir with changes ([@ronami](https://github.com/ronami))

#### :nail_care: Polish

- Other
  - [#786](https://github.com/wix/yoshi/pull/786) prettier all the markdown files ([@Schniz](https://github.com/Schniz))
- `yoshi-config`, `yoshi`
  - [#780](https://github.com/wix/yoshi/pull/780) Change the public dir from public to src/assets ([@ronami](https://github.com/ronami))

#### :memo: Documentation

- [#783](https://github.com/wix/yoshi/pull/783) Use headlines instead of table for start options ([@yurynix](https://github.com/yurynix))

#### :house: Internal

- Other
  - [#809](https://github.com/wix/yoshi/pull/809) Add tests to travis-ci ([@yanivefraim](https://github.com/yanivefraim))
  - [#799](https://github.com/wix/yoshi/pull/799) Run lint on a separate command (for PR CI) ([@ronami](https://github.com/ronami))
  - [#789](https://github.com/wix/yoshi/pull/789) prettify markdowns pre-commit hook ([@Schniz](https://github.com/Schniz))
- `create-yoshi-app`, `yoshi`
  - [#777](https://github.com/wix/yoshi/pull/777) Testing infra for experimental server bundle ([@ronami](https://github.com/ronami))
- `create-yoshi-app`, `eslint-config-yoshi-base`
  - [#804](https://github.com/wix/yoshi/pull/804) Run eslint on website/templates instead of ignoring them ([@ronami](https://github.com/ronami))
- `eslint-config-yoshi-base`
  - [#802](https://github.com/wix/yoshi/pull/802) Fix failing eslint tests ([@ronami](https://github.com/ronami))
- `yoshi`
  - [#795](https://github.com/wix/yoshi/pull/795) better testing infrastructure ([@ranyitz](https://github.com/ranyitz))
  - [#782](https://github.com/wix/yoshi/pull/782) Tell mocha to retry only on CI ([@yurynix](https://github.com/yurynix))
- `create-yoshi-app`, `eslint-config-yoshi-base`, `tslint-config-yoshi-base`, `yoshi-config`, `yoshi-helpers`, `yoshi`
  - [#791](https://github.com/wix/yoshi/pull/791) Improve testing infrastructure ([@ronami](https://github.com/ronami))

## 3.19.3 (2018-11-13)

#### :bug: Bug Fix

- `create-yoshi-app`
  - [#761](https://github.com/wix/yoshi/pull/761) Pin component libraries templates `storybook` version to `alpha.14` for usage with `react@15` ([@Schniz](https://github.com/Schniz))
- `yoshi`
  - [#770](https://github.com/wix/yoshi/pull/770) Fix yoshi not outputing verbose errors on CI ([@netanelgilad](https://github.com/netanelgilad))

#### :nail_care: Polish

- `bootstrap-hot-loader`
  - [#773](https://github.com/wix/yoshi/pull/773) Add basic types to bootstrap-hot-loader ([@ronami](https://github.com/ronami))

#### :house: Internal

- `create-yoshi-app`
  - [#769](https://github.com/wix/yoshi/pull/769) Improve e2e errors by using `it` instead of `before` ([@netanelgilad](https://github.com/netanelgilad))

## 3.19.2 (2018-11-12)

#### :bug: Bug Fix

- `yoshi`
  - [#754](https://github.com/wix/yoshi/pull/754) Run two different typescript typechecks ([@ronami](https://github.com/ronami))

#### :house: Internal

- `yoshi`
  - [#758](https://github.com/wix/yoshi/pull/758) A small refactor - remove of a redundant helper function ([@yanivefraim](https://github.com/yanivefraim))

## 3.19.1 (2018-11-11)

#### :bug: Bug Fix

- `yoshi`
  - [#699](https://github.com/wix/yoshi/pull/699) Serve JS files on CDN with proper content type ([@yurynix](https://github.com/yurynix))

#### :nail_care: Polish

- `yoshi`
  - [#716](https://github.com/wix/yoshi/pull/716) Show a loading indication when starting a local development setup ([@ronami](https://github.com/ronami))

#### :house: Internal

- `yoshi`
  - [#747](https://github.com/wix/yoshi/pull/747) Fix flaky tests related to `yoshi start` ([@ronami](https://github.com/ronami))

## 3.19.0 (2018-11-07)

#### :rocket: New Feature

- `eslint-config-yoshi-base`
  - [#745](https://github.com/wix/yoshi/pull/745) Change prettier errors to warnings instead of errors ([@netanelgilad](https://github.com/netanelgilad))
- `tslint-config-yoshi-base`, `yoshi`
  - [#746](https://github.com/wix/yoshi/pull/746) Yoshi lint will exit cleanly on tslint warnings and will warn on prettier errors ([@netanelgilad](https://github.com/netanelgilad))

#### :bug: Bug Fix

- `yoshi-helpers`, `yoshi`
  - [#736](https://github.com/wix/yoshi/pull/736) Check existence of `tsconfig.json` for TypeScript project detection ([@Schniz](https://github.com/Schniz))

#### :nail_care: Polish

- `create-yoshi-app`
  - [#732](https://github.com/wix/yoshi/pull/732) Ddd links for bootstrap middlewares documentation ([@ranyitz](https://github.com/ranyitz))

## 3.18.3 (2018-11-05)

#### :bug: Bug Fix

- `jest-environment-yoshi-bootstrap`
  - [#731](https://github.com/wix/yoshi/pull/731) When generating a port, kill the process that runs a server on that port to make sure the port is available ([@ranyitz](https://github.com/ranyitz))

## 3.18.2 (2018-11-04)

#### :bug: Bug Fix

- `yoshi`
  - [#713](https://github.com/wix/yoshi/pull/713) Upgrade `react-dev-utils` minimum version to provide `typescriptFormatter` ([@ranyitz](https://github.com/ranyitz))

## 3.18.1 (2018-11-01)

#### :bug: Bug Fix

- `create-yoshi-app`
  - [#710](https://github.com/wix/yoshi/pull/710) Fix generation of projects into custom dirs ([@netanelgilad](https://github.com/netanelgilad))

## 3.18.0 (2018-11-01)

#### :rocket: New Feature

- `create-yoshi-app`
  - [#688](https://github.com/wix/yoshi/pull/688) Validate @wix email on project generation ([@netanelgilad](https://github.com/netanelgilad))
  - [#610](https://github.com/wix/yoshi/pull/610) Sort projects by priority ([@yanivefraim](https://github.com/yanivefraim))
- `yoshi`
  - [#692](https://github.com/wix/yoshi/pull/692) Write client files to the file system and show them nicely via `serve-handler` ([@ronami](https://github.com/ronami))

#### :bug: Bug Fix

- `jest-environment-yoshi-puppeteer`
  - [#706](https://github.com/wix/yoshi/pull/706) Add `globby` as dependency ([@yakirn](https://github.com/yakirn))
- Other
  - [#698](https://github.com/wix/yoshi/pull/698) Support `splitChunks: true` in Yoshi config schema ([@netanelgilad](https://github.com/netanelgilad))

#### :nail_care: Polish

- `yoshi`
  - [#691](https://github.com/wix/yoshi/pull/691) Transpile server bundle to Node version 8 ([@ronami](https://github.com/ronami))
  - [#693](https://github.com/wix/yoshi/pull/693) Run `fork-ts-checker-webpack-plugin` only once ([@ronami](https://github.com/ronami))
  - [#695](https://github.com/wix/yoshi/pull/695) Format TypeScript errors with `react-dev-utils` ([@ronami](https://github.com/ronami))

## 3.17.0 (2018-10-29)

#### :rocket: New Feature

- `yoshi`
  - [#683](https://github.com/wix/yoshi/pull/683) Print error messages and add verbose flag for full stacktrace ([@netanelgilad](https://github.com/netanelgilad))
  - [#677](https://github.com/wix/yoshi/pull/677) Look for a `dev-server` entry if the standard server entry isn't found ([@ronami](https://github.com/ronami))

#### :bug: Bug Fix

- `jest-environment-yoshi-puppeteer`
  - [#678](https://github.com/wix/yoshi/pull/678) Remove `headless: true` default from `puppeteer.launch` call ([@ronami](https://github.com/ronami))
- `yoshi-config`
  - [#682](https://github.com/wix/yoshi/pull/682) Fix async function type checking bug by using `ajv` instead of `jest-validate` to validate jest config ([@ronami](https://github.com/ronami))
- `yoshi`
  - [#679](https://github.com/wix/yoshi/pull/679) Handle `dep-check` errors on build ([@netanelgilad](https://github.com/netanelgilad))

#### :memo: Documentation

- [#680](https://github.com/wix/yoshi/pull/680) Move the docs for `babel-preset-yoshi` and `jest-yoshi-preset` to the docs website ([@ronami](https://github.com/ronami))

## 3.16.3 (2018-10-25)

#### :bug: Bug Fix

- `jest-environment-yoshi-bootstrap`, `jest-yoshi-preset`
  - [#669](https://github.com/wix/yoshi/pull/669) Run jest yoshi config inside Jest's vm so transforms/console are used correctly ([@ronami](https://github.com/ronami))

## 3.16.1 (2018-10-24)

#### :bug: Bug Fix

- `yoshi`
  - [#656](https://github.com/wix/yoshi/pull/656) Show long class names in Storybook ([@muteor](https://github.com/muteor))
  - [#667](https://github.com/wix/yoshi/pull/667) Enable using a different test runner in Karma configuration ([@ranyitz](https://github.com/ranyitz))
  - [#665](https://github.com/wix/yoshi/pull/665) Support `externals` configuration when using Karma (`specs.bundle`) ([@eddierl](https://github.com/eddierl))
  - [#666](https://github.com/wix/yoshi/pull/666) Enable using different browsers in Karma configuration ([@eddierl](https://github.com/eddierl))

#### :memo: Documentation

- Other
  - [#664](https://github.com/wix/yoshi/pull/664) Update contributing "Local Testing" section + arrange scripts alphabetically ([@ranyitz](https://github.com/ranyitz))
  - [#655](https://github.com/wix/yoshi/pull/655) Add `svg2react-icon` tool to svg docs ([@bildja](https://github.com/bildja))
- `jest-yoshi-preset`
  - [#649](https://github.com/wix/yoshi/pull/649) Add `jest-yoshi` setup files documentation ([@saarkuriel](https://github.com/saarkuriel))

#### :house: Internal

- `create-yoshi-app`, `yoshi`
  - [#612](https://github.com/wix/yoshi/pull/612) Sentry error reporting ([@netanelgilad](https://github.com/netanelgilad))

## 3.16.0 (2018-10-17)

#### :rocket: New Feature

- `create-yoshi-app`
  - [#644](https://github.com/wix/yoshi/pull/644) Add `.editorconfig` to all templates ([@netanelgilad](https://github.com/netanelgilad))

#### :bug: Bug Fix

- `yoshi`
  - [#648](https://github.com/wix/yoshi/pull/648) Copy `.ejs`/`.vm` files to `dist/statics` in experimental server bundle ([@ronami](https://github.com/ronami))
  - [#635](https://github.com/wix/yoshi/pull/635) Redirect `.min` assets to non min assets in start-app ([@ronami](https://github.com/ronami))
- `create-yoshi-app`
  - [#633](https://github.com/wix/yoshi/pull/633) Fix generated `launch.json` for VSCode across templates ([@netanelgilad](https://github.com/netanelgilad))

#### :nail_care: Polish

- `yoshi`
  - [#647](https://github.com/wix/yoshi/pull/647) Update `rtlcss-webpack-plugin` version ([@netanelgilad](https://github.com/netanelgilad))

#### :memo: Documentation

- [#643](https://github.com/wix/yoshi/pull/643) Change readme to latest changes, make it more informative ([@ronami](https://github.com/ronami))

#### :house: Internal

- Other
  - [#640](https://github.com/wix/yoshi/pull/640) Run only publish ([@ranyitz](https://github.com/ranyitz))
- `create-yoshi-app`
  - [#638](https://github.com/wix/yoshi/pull/638) Improve e2e tests by emulating production installations ([@ronami](https://github.com/ronami))
  - [#639](https://github.com/wix/yoshi/pull/639) Verify each package's publishConfig to prevent redundant publishes to public npm ([@ronami](https://github.com/ronami))

## 3.15.5 (2018-10-15)

#### :bug: Bug Fix

- `jest-yoshi-preset`
  - [#637](https://github.com/wix/yoshi/pull/637) Use the new `@stylable` dependencies ([@shlomitc](https://github.com/shlomitc))

## 3.15.4 (2018-10-14)

#### :nail_care: Polish

- `yoshi`
  - [#627](https://github.com/wix/yoshi/pull/627) Use relative public path in css `url()` calls ([@ranyitz](https://github.com/ranyitz))
- Other
  - [#629](https://github.com/wix/yoshi/pull/629) Fix link path in api configurations docs ([@lbelinsk](https://github.com/lbelinsk))

#### :memo: Documentation

- [#632](https://github.com/wix/yoshi/pull/632) Fix docs for configuring debugging in vscode ([@netanelgilad](https://github.com/netanelgilad))

#### :house: Internal

- [#634](https://github.com/wix/yoshi/pull/634) Simplify publish script ([@ranyitz](https://github.com/ranyitz))

## 3.15.3 (2018-10-11)

#### :house: Internal

- `yoshi`
  - [#486](https://github.com/wix/yoshi/pull/486) Upgrade stylable to new scoped package ([@tomrav](https://github.com/tomrav))

## 3.15.2 (2018-10-10)

#### :bug: Bug Fix

- `yoshi`
  - [#623](https://github.com/wix/yoshi/pull/623) Fix wallaby babel ([@netanelgilad](https://github.com/netanelgilad))
  - [#626](https://github.com/wix/yoshi/pull/626) Fix debugging of jest tests ([@netanelgilad](https://github.com/netanelgilad))

#### :nail_care: Polish

- `yoshi`
  - [#624](https://github.com/wix/yoshi/pull/624) Further simplify `wallabyCommon.tests` by using unshift ([@splintor](https://github.com/splintor))

## 3.15.1 (2018-10-10)

#### :nail_care: Polish

- `yoshi`
  - [#622](https://github.com/wix/yoshi/pull/622) Simplify `wallabyCommon.tests` update in wallaby-mocha.js ([@splintor](https://github.com/splintor))

#### :bug: Bug Fix

- `yoshi`
  - [2d31fdd](https://github.com/wix/yoshi/commit/2d31fdd678e5cbf87d05cfbc5ab6a762b6960c9d) Fix a bug that caused Yoshi to crash if TypeScript wasn't installed ([@ronami](https://github.com/ronami))

## 3.15.0 (2018-10-09)

#### :rocket: New Feature

- `bootstrap-hot-loader`, `create-yoshi-app`, `yoshi-config`, `yoshi`
  - [#586](https://github.com/wix/yoshi/pull/586) Server-side bundle experimental feature ([@ronami](https://github.com/ronami))
- `yoshi`
  - [#618](https://github.com/wix/yoshi/pull/618) Forward options after `--jest` to jest bin ([@ranyitz](https://github.com/ranyitz))

#### :bug: Bug Fix

- `create-yoshi-app`, `yoshi`
  - [#619](https://github.com/wix/yoshi/pull/619) Fix wallaby configuration when working with `jest` ([@netanelgilad](https://github.com/netanelgilad))
- `yoshi-config`, `yoshi`
  - [#620](https://github.com/wix/yoshi/pull/620) Change the stats file destination to `target` instead of `dist` ([@ranyitz](https://github.com/ranyitz))

#### :nail_care: Polish

- `yoshi`
  - [#621](https://github.com/wix/yoshi/pull/621) Remove the duplicate package checker plugin ([@ranyitz](https://github.com/ranyitz))

## 3.14.2 (2018-10-09)

#### :bug: Bug Fix

- `yoshi`
  - [#617](https://github.com/wix/yoshi/pull/617) Fix a bug when using `--stats` option and stats files was not written ([@ronenst](https://github.com/ronenst))
  - [#616](https://github.com/wix/yoshi/pull/616) [eslint] Log warnings to the console if there are only warnings ([@ranyitz](https://github.com/ranyitz))
  - [#614](https://github.com/wix/yoshi/pull/614) [tslint] Use `yoshi lint <files>` filter on top of the files specified in `tsconfig` ([@ranyitz](https://github.com/ranyitz))

#### :nail_care: Polish

- `create-yoshi-app`
  - [#615](https://github.com/wix/yoshi/pull/615) Improve Lint on typescript templates ([@ranyitz](https://github.com/ranyitz))
    - Ignore `d.ts` files on the `lint-staged` config
    - Include `*.spec.tsx` files on the default `tsconfig.json`

#### :house: Internal

- `yoshi-config`
  - [#613](https://github.com/wix/yoshi/pull/613) Remove unused config options (`isUniversalProject`, `isEsModule`) ([@ronami](https://github.com/ronami))

## 3.14.1 (2018-10-03)

#### :bug: Bug Fix

- `yoshi`
  - [#609](https://github.com/wix/yoshi/pull/609) Fix Karma bundle failing if it tries to access native Node modules ([@netanelgilad](https://github.com/netanelgilad))

## 3.14.0 (2018-10-03)

#### :bug: Bug Fix

- `yoshi-helpers`
  - [#607](https://github.com/wix/yoshi/pull/607) Bring back `mergeByConcat` function ([@ranyitz](https://github.com/ranyitz))
- `yoshi`
  - [#573](https://github.com/wix/yoshi/pull/573) Enable opt-in to build with `devtool: source-map` ([@netanelgilad](https://github.com/netanelgilad))

#### :nail_care: Polish

- [#606](https://github.com/wix/yoshi/pull/606) add npm version badge ([@netanelgilad](https://github.com/netanelgilad))

#### :house: Internal

- `jest-environment-yoshi-bootstrap`, `jest-environment-yoshi-puppeteer`, `jest-yoshi-preset`, `yoshi-helpers`, `yoshi`
  - [#608](https://github.com/wix/yoshi/pull/608) Use exact versions for inner cross dependencies ([@ranyitz](https://github.com/ranyitz))

## 3.13.1 (2018-10-02)

#### :bug: Bug Fix

- `yoshi-helpers`, `yoshi`
  - [#602](https://github.com/wix/yoshi/pull/602) Create webpack's public path only in case there is a `pom.xml` file ([@ranyitz](https://github.com/ranyitz))

#### :nail_care: Polish

- [#601](https://github.com/wix/yoshi/pull/601) Fix broken link to bundle analysis guide ([@ronenst](https://github.com/ronenst))
- [#603](https://github.com/wix/yoshi/pull/603) Fix broken link to images on `debugging.md` ([@sidoruk-sv](https://github.com/sidoruk-sv))

## 3.13.0 (2018-10-02)

#### :rocket: New Feature

- `yoshi`
  - [#582](https://github.com/wix/yoshi/pull/582) Process `unprocessedModules` with graphql loader ([@eddierl](https://github.com/eddierl))
- `yoshi-config`, `yoshi`
  - [#591](https://github.com/wix/yoshi/pull/591) Add `--stats` flag to generate `dist/webpack-stats.json` ([@ronenst](https://github.com/ronenst))

#### :bug: Bug Fix

- `create-yoshi-app`
  - [#597](https://github.com/wix/yoshi/pull/597) Add dynamic `%organization%` into some of `pom.xml` templates ([@sidoruk-sv](https://github.com/sidoruk-sv))

## 3.12.0 (2018-10-02)

#### :rocket: New Feature

- [#594](https://github.com/wix/yoshi/pull/594) Integrate algolia search ([@ranyitz](https://github.com/ranyitz))
- [#590](https://github.com/wix/yoshi/pull/590) Initial documentation site ([@ranyitz](https://github.com/ranyitz))

#### :bug: Bug Fix

- `yoshi-config`, `yoshi`
  - [#593](https://github.com/wix/yoshi/pull/593) Fix webpack's public path for local development ([@ranyitz](https://github.com/ranyitz))
- `create-yoshi-app`
  - [#596](https://github.com/wix/yoshi/pull/596) Add @types/node version 8 as version 10 clashes with typescript ([@ranyitz](https://github.com/ranyitz))
- `yoshi-config`, `yoshi-helpers`, `yoshi`
  - [#592](https://github.com/wix/yoshi/pull/592) Change `xml2js` with `xmldoc` and compute artifact id from `pom.xml` ([@ranyitz](https://github.com/ranyitz))
- `babel-preset-yoshi`
  - [#585](https://github.com/wix/yoshi/pull/585) Do not transpile dynamic imports only when used in webpack ([@ranyitz](https://github.com/ranyitz))

#### :nail_care: Polish

- `yoshi`
  - [#588](https://github.com/wix/yoshi/pull/588) Prefer local yoshi installation when using CLI ([@yanivefraim](https://github.com/yanivefraim))
- `yoshi-helpers`, `yoshi`
  - [#584](https://github.com/wix/yoshi/pull/584) Show a warning when the user tries to run e2e tests but there is no bundle built ([@ranyitz](https://github.com/ranyitz))
- `yoshi-helpers`
  - [#579](https://github.com/wix/yoshi/pull/579) Upgrade "typescript" peer dependency version to also accept 3^ ([@nktssh](https://github.com/nktssh))

#### :house: Internal

- `yoshi-config`, `yoshi-helpers`, `yoshi`
  - [#589](https://github.com/wix/yoshi/pull/589) Refactor webpack config to a single file ([@ronami](https://github.com/ronami))

## 3.11.0 (2018-09-16)

#### :rocket: New Feature

- `create-yoshi-app`
  - [#540](https://github.com/wix/yoshi/pull/540) Generate a git repo if needed ([@netanelgilad](https://github.com/netanelgilad))
  - [#537](https://github.com/wix/yoshi/pull/537) Node version verification ([@yairhaimo](https://github.com/yairhaimo))

#### :bug: Bug Fix

- `yoshi-helpers`, `yoshi`
  - [#565](https://github.com/wix/yoshi/pull/565) Generate stats file using BundleAnalyzerPlugin instead of manually ([@netanelgilad](https://github.com/netanelgilad))
- `yoshi`
  - [#566](https://github.com/wix/yoshi/pull/566) Don't show Webpack performance hints by default ([@netanelgilad](https://github.com/netanelgilad))

#### :nail_care: Polish

- `tslint-config-yoshi-base`
  - [#569](https://github.com/wix/yoshi/pull/569) Remove `no-unused-variables` & `strict-type-predicates` tslint rules ([@yairhaimo](https://github.com/yairhaimo))

## 3.10.1 (2018-09-05)

#### :bug: Bug Fix

- `yoshi-helpers`
  - [#564](https://github.com/wix/yoshi/pull/564) Add direct dependency on lodash ([@ronami](https://github.com/ronami))

## 3.10.0 (2018-09-05)

#### :rocket: New Feature

- `create-yoshi-app`
  - [#561](https://github.com/wix/yoshi/pull/561) Simplify local (fake) server for client projects ([@ronami](https://github.com/ronami))

#### :house: Internal

- `eslint-config-yoshi-base`, `jest-environment-yoshi-bootstrap`, `jest-environment-yoshi-puppeteer`, `tslint-config-yoshi-base`, `yoshi-config`, `yoshi-helpers`, `yoshi`
  - [#558](https://github.com/wix/yoshi/pull/558) create new packages `yoshi-config` and `yoshi-helpers` ([@ranyitz](https://github.com/ranyitz))

## 3.9.1 (2018-09-04)

#### :bug: Bug Fix

- `create-yoshi-app`, `yoshi`
  - [#560](https://github.com/wix/yoshi/pull/560) add `universalProject` to configuration schema ([@netanelgilad](https://github.com/netanelgilad))

## 3.9.0 (2018-09-02)

#### :rocket: New Feature

- `create-yoshi-app`
  - [#549](https://github.com/wix/yoshi/pull/549) Simplify server code and add basic annotations to it ([@ronami](https://github.com/ronami))
  - [#556](https://github.com/wix/yoshi/pull/556) Drop explicit Response type in fullstack/TypeScript ([@roymiloh](https://github.com/roymiloh))
  - [#554](https://github.com/wix/yoshi/pull/554) Add `wix-bootstrap-renderer` to fullstack projects ([@roymiloh](https://github.com/roymiloh))
  - [#542](https://github.com/wix/yoshi/pull/542) Simplify i18n setup to use webpack's dynamic imports ([@ronami](https://github.com/ronami))
- `yoshi`
  - [#552](https://github.com/wix/yoshi/pull/552) Cleanup output of build command ([@netanelgilad](https://github.com/netanelgilad))
  - [#555](https://github.com/wix/yoshi/pull/555) Add lerna-changelog for autogeneration of changelog based on PRs from last tag ([@ranyitz](https://github.com/ranyitz))

#### :bug: Bug Fix

- `yoshi`
  - [#550](https://github.com/wix/yoshi/pull/550) Lock wallaby's babel version ([@amitdahan](https://github.com/amitdahan))
- `create-yoshi-app`
  - [#548](https://github.com/wix/yoshi/pull/548) Use template var instead of `package.json` to prevent Lerna from analyzing them ([@ronami](https://github.com/ronami))

## 3.8.1 (Aug 29, 2018)

#### :nail_care: Enhancement

- `yoshi`
  - [#535](https://github.com/wix/yoshi/pull/535) Validate that Yoshi's config is correct before running a command

#### :bug: Bug

- `create-yoshi-app`
  - [#545](https://github.com/wix/yoshi/pull/545) Use files from /src only during test

## 3.8.0 (Aug 27, 2018)

#### :nail_care: Enhancement

- `create-yoshi-app`
  - [#533](https://github.com/wix/yoshi/pull/533) Update typescript generator templates to use version `3.0.1`
  - [#505](https://github.com/wix/yoshi/pull/505) Move client/fullstack generators to use `jest-yoshi-preset`

## 3.7.0 (Aug 23, 2018)

#### :bug: Bug

- `create-yoshi-app`
  - [#511](https://github.com/wix/yoshi/pull/511) Support generating a project in a directory with initialized git repository
  - [#522](https://github.com/wix/yoshi/pull/522) Add `lint-staged` to project templates
- `yoshi`
  - [#522](https://github.com/wix/yoshi/pull/522) Ensure `shouldRunStylelint` before linting specific style files

#### :nail_care: Enhancement

- `yoshi`
  - [#519](https://github.com/wix/yoshi/pull/519) Remove depCheck from start command
  - [#520](https://github.com/wix/yoshi/pull/520) Add enhanced tpa style webpack plugin

#### :house: Internal

- [#517](https://github.com/wix/yoshi/pull/517) Link local packages when running create-yoshi-app e2es

## 3.6.1 (Aug 21, 2018)

#### :bug: Bug

- `create-yoshi-app`
  - [#508](https://github.com/wix/yoshi/pull/508) Fix a bug with generating projects

## 3.6.0 (Aug 21, 2018)

#### :bug: Bug

- `yoshi`
  - [#503](https://github.com/wix/yoshi/pull/503) Allow Wallaby to import json from tests directory as well

#### :nail_care: Enhancement

- `jest-yoshi-preset`
  - [#501](https://github.com/wix/yoshi/pull/501) [#504](https://github.com/wix/yoshi/pull/504) Various fixes and improvements
- `yoshi`
  - [#502](https://github.com/wix/yoshi/pull/502) Add an option to connfigure Webpack with `umdNamedDefine`

#### :house: Internal

- `yoshi`
  - [#475](https://github.com/wix/yoshi/pull/475) Move depkeeper configuration to `depkeeper-preset-yoshi`
- `create-yoshi-app`
  - [#499](https://github.com/wix/yoshi/pull/499) Add a dev command that enables fun and fast development for the templates of `create-yoshi-app`

## 3.5.0 (Aug 14, 2018)

#### :nail_care: Enhancement

- `jest-yoshi-preset`
  - [#495](https://github.com/wix/yoshi/pull/495) Initial version of `jest-yoshi-preset`

## 3.4.4 (Aug 14, 2018)

#### :bug: Bug

- `create-yoshi-app`
  - [#490](https://github.com/wix/yoshi/pull/490) Fix default global git user config
- `yoshi`
  - [#496](https://github.com/wix/yoshi/pull/496) Added support for two CLI options when using Jest: runInBand and forceExit
  - [#497](https://github.com/wix/yoshi/pull/497) Add a unique `jsonpFunction` for each project according to project name

## 3.4.3 (Aug 7, 2018)

#### :bug: Bug

- `create-yoshi-app`
  - [#478](https://github.com/wix/yoshi/pull/478) Add Support for `git`'s include directive
  - [#474](https://github.com/wix/yoshi/pull/482) Fix a bug where choosing `node-library` option resulted in an empty project
- `yoshi`
  - [#483](https://github.com/wix/yoshi/pull/483) Upgrade `externalize-realtive-module-loader` to a versino that supports windows

## 3.4.2 (Aug 2, 2018)

- `create-yoshi-app`
  - [#474](https://github.com/wix/yoshi/pull/474) Update post create messages

## 3.4.1 (Aug 1, 2018)

#### :bug: Bug

- `create-yoshi-app`
  - [#472](https://github.com/wix/yoshi/pull/472) Fix `create-yoshi-app` bugs:
    - `.gitignore` not generated
    - Wrong file names

## 3.4.0 (Aug 1, 2018)

#### :nail_care: Enhancement

- `yoshi`
  - [#455](https://github.com/wix/yoshi/pull/455) Add (webpack) static public path on CI build time according to the CDN location to support assets management in deployable libraries

## 3.3.1 (Jul 29, 2018)

#### :bug: Bug

- `yoshi`
  - [#469](https://github.com/wix/yoshi/pull/469) Fixed mocha to not throw an error and exit while in watch mode

## 3.3.0 (Jul 26, 2018)

#### :nail_care: Enhancement

- `yoshi`
  - [#458](https://github.com/wix/yoshi/pull/458) Add an option to disable `threadLoader` for typescript projects
  - [#462](https://github.com/wix/yoshi/pull/462) Suppresses warnings that arise from typescript during `build`

## 3.2.1 (Jul 26, 2018)

#### :boom: Breaking Change

- `eslint-config-yoshi`

  - [#461](https://github.com/wix/yoshi/pull/461) Add `wix-style-react` lint rules

- `tslint-config-yoshi`
  - [#461](https://github.com/wix/yoshi/pull/461) Add `wix-style-react` lint rules

## 3.2.0 (Jul 25, 2018)

#### :nail_care: Enhancement

- `yoshi`
  - [#459](https://github.com/wix/yoshi/pull/459) Suppresses warnings that arise from typescript `transpile-only` and rexporting types
  - [#460](https://github.com/wix/yoshi/pull/460) Add configuration for `keepFunctionNames` in yoshi config to prevent `uglifyJS` from mangling them

## 3.1.3 (Jul 22, 2018)

#### :bug: Bug

- `yoshi`
  - [#452](https://github.com/wix/yoshi/pull/452) Fix `webpack.config.storybook.js` file sass loader integration.

## 3.1.2 (Jul 19, 2018)

#### :bug: Bug

- `yoshi`
  - [#450](https://github.com/wix/yoshi/pull/450) Fix `globalObject` template to work with dynamic imports.

## 3.1.1 (Jul 17, 2018)

#### :nail_care: Enhancement

- `yoshi`
  - [#419](https://github.com/wix/yoshi/pull/419) Update the version of `wnpm-ci` and add support for `--minor` option

#### :bug: Bug

- `tslint-config-yoshi-base`
  - [#445](https://github.com/wix/yoshi/pull/445) Fix `tslint-config-yoshi-base` failing on VSCode
- `yoshi`
  - [#444](https://github.com/wix/yoshi/pull/444) Fix for HMR settings and support for multiple entries

## 3.1.0 (Jul 16, 2018)

#### :bug: Bug

- `yoshi`

  - [#418](https://github.com/wix/yoshi/pull/418) Always start dev server with `NODE_ENV=development`
  - [#416](https://github.com/wix/yoshi/pull/416) Adjust `externalize-relative-lodash` to windows
  - [#391](https://github.com/wix/yoshi/pull/391) Allow `npm test` and `npm start` run on the same time (`webpack-dev-server` will check if it is already up and won't throw)

- `tslint-config-yoshi-base`

  - [#427](https://github.com/wix/yoshi/pull/427) Add js-rules to TSLint configs
  - [#431](https://github.com/wix/yoshi/pull/431) [#436](https://github.com/wix/yoshi/pull/436) [#437](https://github.com/wix/yoshi/pull/437) Various changes to TSLint rules

- `eslint-config-yoshi-base`
  - [#437](https://github.com/wix/yoshi/pull/437) [#441](https://github.com/wix/yoshi/pull/441) Various changes to ESLint rules

## 3.0.0 (Jul 4, 2018)

#### :nail_care: Enhancement

- `yoshi`

  - [#415](https://github.com/wix/yoshi/pull/415) Allow running `start` (local development) in production mode with `--production`
  - [#414](https://github.com/wix/yoshi/pull/414) Do not run `webpack-dev-server` when there are no e2e test files

- `tslint-config-yoshi-base`
  - [#417](https://github.com/wix/yoshi/pull/417) Configure several TSLint rules to be a bit less strict

## 3.0.0-rc.1 (Jul 2, 2018)

#### :boom: Breaking Change

- `yoshi`

  - [#410](https://github.com/wix/yoshi/pull/410) Configure Jasmine to not run tests randomly and not bail on first failure

- `eslint-config-yoshi-base`

  - [#411](https://github.com/wix/yoshi/pull/411) Add linting rules and globals for testing environments

- `tslint-config-yoshi-base`
  - [#411](https://github.com/wix/yoshi/pull/411) Add linting rules for testing environments

## 3.0.0-rc.0 (Jul 1, 2018)

#### :boom: Breaking Change

- `yoshi`
  - [#401](https://github.com/wix/yoshi/pull/401) Remove `babel-preset-wix` from yoshi's dependencies
  - [#402](https://github.com/wix/yoshi/pull/402) Change emitted `webpack-stats` file names:
    - `webpack-stats.prod.json` => `webpack-stats.min.json`
    - `webpack-stats.dev.json` => `webpack-stats.json`
  - [#402](https://github.com/wix/yoshi/pull/402) `localIdentName` (css modules generated class name) will be short only on minified bundles

#### :house: Internal

- `yoshi`
  - [#402](https://github.com/wix/yoshi/pull/402) Run every command with the proper `NODE_ENV`:
    - build with `NODE_ENV="production"`
    - test with `NODE_ENV="test"`
    - start with `NODE_ENV="development"`

#### :nail_care: Enhancement

- `yoshi`
  - [#398](https://github.com/wix/yoshi/pull/398) In tests, transpile TypeScript for node version 8.x (for example, do not transpile `async`/`await`)
  - [#409](https://github.com/wix/yoshi/pull/409) Optimize TypeScript (loader) for latest Chrome on `start` (local development)
- `babel-preset-yoshi`
  - [#401](https://github.com/wix/yoshi/pull/401) Add support for tree-shaking when using yoshi

## 3.0.0-beta.2 (Jun 25, 2018)

#### :boom: Breaking Change

- `yoshi`
  - [#389](https://github.com/wix/yoshi/pull/389) Remove `protractor` from yoshi's dependencies
  - [#393](https://github.com/wix/yoshi/pull/393) Remove `ng-annotate` and `ng-annotate-loader` from yoshi's dependencies
  - [#394](https://github.com/wix/yoshi/pull/394) By default, `yoshi --karma` works with `Chrome` browser (Instead of `phantomJS`) and `mocha` framework. Meaning that devs that rely on `phantomJS` and configuration like [`phantomjs-polyfill`](https://github.com/tom-james-watson/phantomjs-polyfill) need to configure it for themselves, or migrate to use `Chrome` (recommended)

#### :nail_care: Enhancement

- `yoshi`

  - [#387](https://github.com/wix/yoshi/pull/387) Add support for `prelint` hook.
  - [#384](https://github.com/wix/yoshi/pull/384) Add support for `extend` configuration option.

- `yoshi-angular-dependencies`

  - [#394](https://github.com/wix/yoshi/pull/394) Add a new package that brings `karma`, `ng-annotate`, `protractor` and some plugins for `angular` projects that use `yoshi`.

- `yoshi-style-dependencies`
  - [#392](https://github.com/wix/yoshi/pull/392) Add a new package that brings `css-loader`, `node-sass`, `post-css-loader` and more packages for projects that use `styles`/`css`.

#### :house: Internal

- `yoshi`
  - [#386](https://github.com/wix/yoshi/pull/386) Replace [caporal](https://github.com/mattallty/Caporal.js) with [commander](https://github.com/tj/commander.js) CLI framework to reduce yoshi's install time.

## 3.0.0-beta.1 (Jun 20, 2018)

#### :boom: Breaking Change

- `yoshi`
  - [#381](https://github.com/wix/yoshi/pull/381) Require users to install `node-sass`/`karma` packages if they need them. The purpose is to decrease the `npm install` time for people that don't use the above packages. This is a breaking change for `scss` files or `yoshi test --karma`

## 3.0.0-beta.0 (Jun 13, 2018)

- `yoshi-config-tslint` & `yoshi-config-tslint-base`
  - Various changes to the tslint config:
    - Don't extend the default rules from `tslint-react`
    - Remove various tslint rules from base `tslint` config
    - Don't use recommended rule defaults from `tslint-microsoft-contrib`

## 3.0.0-alpha.12 (Jun 12, 2018)

#### :boom: Breaking Change

- `yoshi`
  - [#354](https://github.com/wix/yoshi/pull/354) Use `tsconfig.json` instead of a glob pattern to determine the files tslint should work on

#### :nail_care: Enhancement

- `eslint-config-yoshi-base`
  - [#350](https://github.com/wix/yoshi/pull/350) Remove `import/first` and `import/no-extraneous-dependencies` warnings
- `tslint-config-yoshi-base`
  - [#360](https://github.com/wix/yoshi/pull/360) New package to lint typescript projects using yoshi
- `tslint-config-yoshi`
  - [#360](https://github.com/wix/yoshi/pull/360) New package to lint typescript & react projects using yoshi

## 3.0.0-alpha.11 (Jun 7, 2018)

#### :boom: Breaking Change

- [#342](https://github.com/wix/yoshi/pull/342) Upgrade jasmine to `v3.1.0`

## 3.0.0-alpha.10 (Jun 5, 2018)

#### :bug: Bug

- [#340](https://github.com/wix/yoshi/pull/340) Fix jasmine base reporter printing

## 3.0.0-alpha.9 (Jun 5, 2018)

#### :nail_care: Enhancement

- [#339](https://github.com/wix/yoshi/pull/339) Support a configuration option to not transpile tests with Babel

## 3.0.0-alpha.8 (Jun 5, 2018)

#### :bug: Bug

- `babel-preset-yoshi`
  - [#334](https://github.com/wix/yoshi/pull/334) Use `{ modules: "commonjs" }` as default to the babel preset

## 3.0.0-alpha.4 (May 30, 2018)

#### :nail_care: Enhancement

- [#317](https://github.com/wix/yoshi/pull/317) Upgrade Jest version from v22 to v23

#### :bug: Bug

- [#316](https://github.com/wix/yoshi/pull/316) Fix various Babel bugs:
  - Use `.deafult` for `babel-plugin-transform-dynamic-import`. [Because of this issue](https://github.com/airbnb/babel-plugin-dynamic-import-node/issues/27)
  - Enable `{ modules: "commonjs" }` by default in `test` environment

## 3.0.0-alpha.3 (May 29, 2018)

#### :bug: Bug

- `babel-preset-yoshi`
  - [#315](https://github.com/wix/yoshi/pull/315) Fix babel preset require error

## 3.0.0-alpha.2 (May 29, 2018)

- `eslint-config-yoshi-base`

  - [#289](https://github.com/wix/yoshi/pull/289) Loosen up `eslint-config-yoshi-base` import rules.
    - Change `import/first` and `import/no-extraneous-dependencies` to warnings (It would be hard to migrate in a big project, but we still want users to be aware of it)
    - Remove `import/no-cycle` (due to its [linting time cost](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-cycle.md#when-not-to-use-it))

- `babel-preset-yoshi`
  - [#308](https://github.com/wix/yoshi/pull/308) `babel-preset-yoshi` various optimizations and fixes

## 3.0.0-alpha.0 (May 14, 2018)

#### :boom: Breaking Change

- `yoshi`
  - [#284](https://github.com/wix/yoshi/pull/284) Upgrade `jest` version from 20 to 22 and `jest-teamcity-reporter` to 0.9
  - [#282](https://github.com/wix/yoshi/pull/282) Remove `eslint-config-wix` as a dependnecy, it will not be bundled with yoshi

#### :nail_care: Enhancement

- `yoshi`
  - [#281](https://github.com/wix/yoshi/pull/281) Replace `extract-test-plugin` with `mini-css-extract-plugin` and add `css-hot-loader`. (enable `HMR` for `CSS`)
  - [#282](https://github.com/wix/yoshi/pull/282) Provide `eslint-config-yoshi` & `eslint-config-yoshi-base` with all peer dependencies

## 2.8.2 (Jun 6, 2018)

#### :nail_care: Enhancement

- [#341](https://github.com/wix/yoshi/pull/341) Add `.json` to the list of resolved extensions by Webpack

## 2.12.0 (Jul 3, 2018)

#### :nail_care: Enhancement

- [#413](https://github.com/wix/yoshi/pull/413) Add configuration for Webpack's `resolve.alias` Using Yoshi's `resolveAlias` option

## 2.11.3 (Jul 1, 2018)

#### :bug: Bug

- [#395](https://github.com/wix/yoshi/pull/395) Mocha `--watch` mode do not run the tests after a change in the `dist` directory
- [#408](https://github.com/wix/yoshi/pull/408) Do not fail the build on an older yoshi version.

## 2.11.2 (Jun 24, 2018)

#### :bug: Bug

- [#382](https://github.com/wix/yoshi/pull/382) Fix `start --no-server` work
- [#390](https://github.com/wix/yoshi/pull/390) Drop `petri-specs` convert task

## 2.11.1 (Jun 20, 2018)

#### :bug: Bug

- [#383](https://github.com/wix/yoshi/pull/383) Fix configuration done in [#371](https://github.com/wix/yoshi/pull/371)

## 2.11.0 (Jun 14, 2018)

#### :nail_care: Enhancement

- [#367](https://github.com/wix/yoshi/pull/367) Add support for a new font type (otf)
- [#371](https://github.com/wix/yoshi/pull/371) Configure Stylable with `{ "shortNamespaces": false }` for optimization

## 2.10.1 (Jun 13, 2018)

#### :bug: Bug

- Revert [#364](https://github.com/wix/yoshi/pull/364) as it contains several breaking changes and it will be merged again into `v3.x.x`

## 2.10.0 (Jun 13, 2018)

#### :nail_care: Enhancement

- [#364](https://github.com/wix/yoshi/pull/364) Bump `node-sass` version from `~4.5.3` to `^4.5.3`

## 2.9.0 (Jun 12, 2018)

#### :nail_care: Enhancement

- [#358](https://github.com/wix/yoshi/pull/358) [#361](https://github.com/wix/yoshi/pull/358) Add an option to configure live-reload
- [#352](https://github.com/wix/yoshi/pull/352) Add support for exclude property in `protractor.conf.js`
- [#332](https://github.com/wix/yoshi/pull/332) Add an option to override DEBUG environment parameter in app-server

## 2.8.3 (Jun 7, 2018)

#### :bug: Bug

- [#345](https://github.com/wix/yoshi/pull/345) Revert `esnext` enforced configuration for `ts-loader`.
- [#335](https://github.com/wix/yoshi/pull/335) Support `--debug=0` option (enable debug with auto port generation)

## 2.8.2 (Jun 6, 2018)

#### :nail_care: Enhancement

- [#341](https://github.com/wix/yoshi/pull/341) Add `.json` to the list of resolved extensions by Webpack

## 2.8.1 (May 31, 2018)

#### :bug: Bug

- [#330](https://github.com/wix/yoshi/pull/330) Fix library (UMD) bundles to work when loaded by Node.js and as WebWorkers
- [#329](https://github.com/wix/yoshi/pull/329) Patch stylable to always be part of the app's JavaScript bundle

## 2.8.0 (May 31, 2018)

#### :nail_care: Enhancement

- [#327](https://github.com/wix/yoshi/pull/327) Support `--coverage` option for `test` command
- [#325](https://github.com/wix/yoshi/pull/325) Add stylable support for karma tests
- [#322](https://github.com/wix/yoshi/pull/322) Support tree shaking in TypeScript by:
  - Create an `es` version if a `module` field exist in `package.json`
  - Force TypeScript loader to use `{ module: "esnext" }` to enable tree shaking

## 2.7.0 (May 31, 2018)

#### :bug: Bug

- [#320](https://github.com/wix/yoshi/pull/320) Upgrade `haste` dependencies to version `~0.2.8`

#### :nail_care: Enhancement

- [#319](https://github.com/wix/yoshi/pull/319) Change cdn host to 0.0.0.0 so it will be available from all network iterfaces

## 2.6.2 (May 29, 2018)

#### :nail_care: Enhancement

- [#251](https://github.com/wix/yoshi/pull/251) Force `{ module: 'commonjs' }` for TypeScript projects when running tests with `ts-node`

#### :house: Internal

- [#306](https://github.com/wix/yoshi/pull/306) Set Stylable’s `classNameOptimizations` option to `false`
- [#310](https://github.com/wix/yoshi/pull/310) Change `Wix Style React`'s DepKeeper configuration

## 2.6.1 (May 23, 2018)

#### :bug: Bug

- [#302](https://github.com/wix/yoshi/pull/302) Be able to run protractor after mocha/jest

## 2.6.0 (May 22, 2018)

#### :nail_care: Enhancement

- [#291](https://github.com/wix/yoshi/pull/291) Add support for `--debug-brk` option on `test` and `start` commands

## 2.5.1 (May 22, 2018)

#### :bug: Bug

- [#300](https://github.com/wix/yoshi/pull/300) Make tree shaking work with `babel-preset-wix`

## 2.5.0 (May 21, 2018)

#### :nail_care: Enhancement

- [#298](https://github.com/wix/yoshi/pull/298) Support es transpilation also for typescript

#### :bug: Bug

- [#295](https://github.com/wix/yoshi/pull/295) Bump `webpack-hot-client` from `v2.2.0` to `v3.0.0` (fixes hmr multiple entries bug)

## 2.4.1 (May 19, 2018)

- [#296](https://github.com/wix/yoshi/pull/296) Fix es modules readme, upgrade `babel-preset-wix` version to 2.0.0

## 2.4.0 (May 13, 2018)

#### :bug: Bug

- [#274](https://github.com/wix/yoshi/pull/274) Lint fixes for wallaby config
- [#277](https://github.com/wix/yoshi/pull/277) Jest Stylable Transform Fix for Windows

#### :nail_care: Enhancement

- `eslint-config-yoshi-base`
  - [#258](https://github.com/wix/yoshi/pull/258) Has been created and can be used
- `eslint-config-yoshi`
  - [#276](https://github.com/wix/yoshi/pull/276) Has been created and can be used
- `babel-preset-yoshi`
  - [#205](https://github.com/wix/yoshi/pull/205) Has been created and can be used
- `yoshi`
  - [#253](https://github.com/wix/yoshi/pull/253) support nvm version in wallaby

## 2.3.0 (May 9, 2018)

#### :nail_care: Enhancement

- [#264](https://github.com/wix/yoshi/pull/264) Add debug ability for tests and app-server
  - `yoshi test --debug`
  - `yoshi start --debug`

## 2.2.0 (May 9, 2018)

#### :bug: Bug

- Fixate `eslint` version to `4.13.1` in order to be compatiable with `eslint-config-wix` (with `babel-eslint` version)

## 2.1.10 (May 8, 2018)

#### :bug: Bug

- [#267](https://github.com/wix/yoshi/pull/267) Update `haste-task-typescript` to support windows
- Remove all `eslint-config-yoshi-base` related dependencies to prevent clash with `eslint-config-wix`

## 2.1.9 (May 8, 2018)

#### :bug: Bug

- Add `eslint-config-wix` to be a dependency of yoshi for backwards compatibility.

## 2.1.7 (May 6, 2018)

#### :nail_care: Enhancement

- [#208](https://github.com/wix/yoshi/pull/208) Add the `--ssl` option to `start` that serves the app bundle on https

#### :bug: Bug

- [#257](https://github.com/wix/yoshi/pull/257) HMR "auto" fallbacks to default entry if non supplied
- [#250](https://github.com/wix/yoshi/pull/250) Fix wallaby-jest to work with Stylable

## 2.1.6 (May 2, 2018)

#### :bug: Bug

- [#237](https://github.com/wix/yoshi/pull/237) Consider the different runtime context for wallaby setup function

#### :house: Internal

- [#243](https://github.com/wix/yoshi/pull/243) Remove custom publish script and use CI's built-in one instead
- Remove a dependency on `semver`
- [#245](https://github.com/wix/yoshi/pull/245) Release script will now exit with status code 0 if running in CI
- [#231](https://github.com/wix/yoshi/pull/231) Add contribution templates for issues and pull requests
- [#246](https://github.com/wix/yoshi/pull/246) Improve test and reduce flakiness by creating symlinks instead of installing specific dependencies
- [#249](https://github.com/wix/yoshi/pull/249) Internal refactor to `protractor.conf.js`

## 2.1.5 (April 29, 2018)

- Internal: [#232](https://github.com/wix/yoshi/pull/232) Better release script for creating new versions
- Internal: [#207](https://github.com/wix/yoshi/pull/207), [#242](https://github.com/wix/yoshi/pull/242) Rewrite build command tests and decrease test time
- [#223](https://github.com/wix/yoshi/pull/223) Documented how to configure Jest
- Update version of `stylable-webpack-plugin` to `1.0.5`
- [#233](https://github.com/wix/yoshi/pull/233) `yoshi info` now displays the project's yoshi config

## 2.1.4 (April 26, 2018)

- Hotfix: fix `stylable-webpack-plugin` to `1.0.4` to prevent runtime error

## 2.1.3 (April 25, 2018)

- [#211](https://github.com/wix/yoshi/pull/211) Yoshi Lint - Add support for file list
- [#228](https://github.com/wix/yoshi/pull/228) Add `yoshi info` command to gather local environment information
- [#229](https://github.com/wix/yoshi/pull/229) Fix `test-setup` and `wallaby-common` paths for wallaby configs

## 2.1.2 (April 24, 2018)

- [#220](https://github.com/wix/yoshi/pull/220) Fix a bug in webpack configuration for karma based projects

## 2.1.1 (April 23, 2018)

- [#216](https://github.com/wix/yoshi/pull/216) Add stylable support for storybook webpack configuration

## 2.1.0 (April 23, 2018)

- [#210](https://github.com/wix/yoshi/pull/210) Add stylable support for webpack using [stylable-webpack-plugin](https://github.com/wix-playground/stylable-webpack-plugin)
- [#209](https://github.com/wix/yoshi/pull/209) Add support for 'it' test suffix for wallaby

## 2.0.0 (April 22, 2018)

- See [migration guide](https://github.com/wix-private/fed-handbook/wiki/Yoshi-2.0#migration-guide)

## 2.0.0-rc.0 (April 18, 2018)

- :house_with_garden: Changes in the code structure, build configuration in CI and release script

## 2.0.0-beta.3 (March 28, 2018)

- [#189](https://github.com/wix/yoshi/pull/189) Add `hmr: "auto"` option, which customizes [webpack HMR](https://webpack.js.org/concepts/hot-module-replacement/) and [react-hot-loader](https://github.com/gaearon/react-hot-loader) automatically
- [#191](https://github.com/wix/yoshi/pull/191) Fix `test-setup` paths for wallaby configs
- [#187](https://github.com/wix/yoshi/pull/187) When compiling ES modules, move styles and assets to `es` directory

## 2.0.0-beta.2 (March 19, 2018)

- **(Breaking)** Remove `haste` as a bin alias, from now on only `yoshi` would be valid bin. (for example `haste start` would not be supported, use `yoshi start` instead)

## 2.0.0-beta.1 (March 19, 2018)

- [#181](https://github.com/wix/yoshi/pull/181) Exclude the following tasks logs:

  1.  `wixUpdateNodeVersion`
  2.  `migrateScopePackages`
  3.  `migrateBowerArtifactory`
  4.  `wixDepCheck`
  5.  `copy-server-assets`
  6.  `copy-static-assets-legacy`
  7.  `copy-static-assets`
  8.  `maven-statics`
  9.  `petri-specs`

- [#182](https://github.com/wix/yoshi/pull/182) Remove `yoshi-utils` as a dev dependency and replace with a local function
- [#183](https://github.com/wix/yoshi/pull/183) Copy `yoshi-runtime` package from original yoshi repository

## 2.0.0-beta.0 (March 15, 2018)

- [#178](https://github.com/wix/yoshi/pull/178) Add ES6 modules support

## 2.0.0-alpha.2 (March 6, 2018)

- [#171](https://github.com/wix/yoshi/pull/171) Update release script to support `old` npm dist-tag
- [#172](https://github.com/wix/yoshi/pull/172) Add `yoshi.config.js` support

## 1.2.0-alpha.1 (March 4, 2018)

- [#169](https://github.com/wix/yoshi/pull/169) Add a custom publish script, the ci will automaticlly release after changing the version on `package.json`
  - [#157](https://github.com/wix/yoshi/pull/157) Update webpack and related packages:
  - Bump loaders: [css-loader](https://github.com/webpack-contrib/css-loader), [resolve-url-loader](https://github.com/bholloway/resolve-url-loader), [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin), [file-loader](https://github.com/webpack-contrib/file-loader) and [ts-loader](https://github.com/TypeStrong/ts-loader)
    - Replace [happypack](https://github.com/amireh/happypack) with [thread-loader](https://github.com/webpack-contrib/thread-loader) (since it's faster and compatible with webpack 4)
    - Rename `commonsChunk` to `splitChunks` to match webpack's naming
    - Use `splitChunks.chunks: 'all'` by default (see more: [RIP CommonsChunkPlugin](https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693))
    - Disable [stylable-loader](github.com/wix/stylable-integration) (since it's incompatible with webpack 4)

## 1.2.1 (April 8, 2018)

start releasing on `yoshi` exclusively, update release script to publish one package, and updated relatived paths from `haste-preset-yoshi` to `yoshi`

## 1.2.0 (April 3, 2018)

- [#194](https://github.com/wix/yoshi/pull/194) Stop saving webpack stats on start command

## 1.1.2 (March 27, 2018)

- [#168](https://github.com/wix/yoshi/pull/168) Set default formatter for tslint to `stylish` and add `--format` option for `lint` command

## 1.1.0 (March 25, 2018)

- [#188](https://github.com/wix/yoshi/pull/188) Add option to only separate CSS on production

## 1.0.48 (March 21, 2018)

- [#143](https://github.com/wix/yoshi/pull/143) Add `stylable-integration` require-hooks and transform functions for testing environments (jest + mocha)

## 1.0.47 (March 7, 2018)

- [#176](https://github.com/wix/yoshi/pull/176) Adding `ts` files to the glob pattern provided by `debug/mocha`

## 1.0.46 (March 7, 2018)

- [#177](https://github.com/wix/yoshi/pull/177) Fix: Remove webpack output from `start` & `test` commands

## 1.0.45 (February 21, 2018)

- [#156](https://github.com/wix/yoshi/pull/156) Inline wix tasks instead of using them as external packages
- [#154](https://github.com/wix/yoshi/pull/154) Add `wix-bootstrap-*` to depcheck task

## 1.0.44 (February 18, 2018)

- Start of manual releases (see commit history for changes in previous versions of [yoshi](https://github.com/wix/yoshi))
