# haste-task-wix-update-node-version
updates your node version according to a fix version.

* create .nvmrc file with the fixed version if there is no .nvmrc
* update the version in the .nvmrc if it's on lower version

## options
* **base `<string>`** the root directory for the task to work on (defaults to process.cwd())
