const path = require('path');
const execa = require('execa');
const { testRegistry } = require('./constants');

function publishMonorepo() {
  // Start in root directory even if run from another directory
  process.chdir(path.join(__dirname, '../..'));

  const verdaccio = execa.shell('npx verdaccio --config verdaccio.yaml');

  execa.shellSync('npx wait-port 4873 -o silent');

  execa.shellSync(
    `npx lerna exec 'npx npm-auth-to-token -u user -p password -e user@example.com -r "${testRegistry}"'`,
  );

  execa.shellSync(
    `npx lerna exec 'node ../../packages/create-yoshi-app/scripts/verifyPublishConfig.js'`,
  );

  execa.shellSync(
    `npx lerna publish --yes --force-publish=* --skip-git --cd-version=minor --exact --npm-tag=latest --registry="${testRegistry}"`,
    {
      stdio: 'inherit',
    },
  );

  // Return a cleanup function
  return () => {
    execa.shellSync(`kill -9 ${verdaccio.pid}`);
  };
}

function authenticateToRegistry(cwd) {
  execa.shellSync(
    `npx npm-auth-to-token -u user -p password -e user@example.com -r "${testRegistry}"`,
    { cwd },
  );
}

module.exports = { publishMonorepo, authenticateToRegistry };
