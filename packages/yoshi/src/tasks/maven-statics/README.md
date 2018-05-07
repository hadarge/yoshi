# haste-task-wix-maven-statics
Creates a `maven/assembly/tar.gz.xml` file that tells maven to deploy statics to CDN.

## options
* **base `<string>`** root directory for the task to work on (defaults to process.cwd())
* **staticsDir `<string>`** path to statics folder on the user's project
* **clientProjectName `<string>`**
