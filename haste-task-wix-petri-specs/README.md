# haste-task-wix-petri-specs

The task accepts an object with the following arguments
* **base `<string>`** path to the root of the project (default to `process.cwd()`)
* **config `<object>`** petri-specs config object (default to `{}`)
* **destDir `<string>`** path to the destination directry
* **watch `<boolean>`** indicate if there is watch mode or not (default to `false`)

It's a haste task wrapper for [`petri-specs`](https://github.com/wix-private/petri-specs) node package.
