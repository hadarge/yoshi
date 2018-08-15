const fs = require('fs');

module.exports = function verifyWorkingDirectory(workingDir) {
  const emptyDirectory = fs.readdirSync(workingDir).length === 0;

  if (!emptyDirectory) {
    console.log(`The directory "${workingDir}" is not an empty directory\n`);
    console.log('Aborting...');

    process.exit(1);
  }
};
