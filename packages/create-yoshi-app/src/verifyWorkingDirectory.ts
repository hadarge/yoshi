import fs from 'fs';

const hiddenFilesRegex = /(^|\/)\.[^/.]/;

export default function verifyWorkingDirectory(workingDir: string) {
  const emptyDirectory =
    fs.readdirSync(workingDir).filter(entry => !hiddenFilesRegex.test(entry))
      .length === 0;

  if (!emptyDirectory) {
    console.log(`The directory "${workingDir}" is not an empty directory\n`);
    console.log('Aborting...');

    process.exit(1);
  }
}
