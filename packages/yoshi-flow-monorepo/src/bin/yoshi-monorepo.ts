#!/usr/bin/env node

process.on('unhandledRejection', error => {
  throw error;
});

import arg from 'arg';
import loadConfig from 'yoshi-config/loadConfig';
import { Config } from 'yoshi-config/build/config';
import normalizeDebuggingArgs from 'yoshi-common/normalize-debugging-args';
import verifyDependencies from 'yoshi-common/verify-dependencies';
import verifyNodeVersion from 'yoshi-common/verify-node-version';
import loadPackageGraph, { LoadGraphResult } from '../load-package-graph';
import verifyTypeScriptReferences from '../verify-typescript-references';

const defaultCommand = 'start';

export type cliCommand = (
  argv: Array<string>,
  rootConfig: Config,
  graph: LoadGraphResult,
) => Promise<void>;

const commands: {
  [command: string]: () => Promise<{ default: cliCommand }>;
} = {
  build: () => import('../scripts/build'),
  start: () => import('../scripts/start'),
  release: () => import('../scripts/release'),
  test: () => import('yoshi-flow-legacy/bin/yoshi-legacy'),
  lint: () => import('yoshi-flow-legacy/bin/yoshi-legacy'),
  info: () => import('yoshi-flow-legacy/bin/yoshi-legacy'),
};

const args = arg(
  {
    // Types
    '--version': Boolean,
    '--help': Boolean,

    // Aliases
    '-v': '--version',
    '-h': '--help',
  },
  {
    permissive: true,
  },
);

const foundCommand = Boolean(commands[args._[0]]);

if (!foundCommand && args['--help']) {
  console.log(`
    Usage
      $ yoshi-monorepo <command>

      Available commands
      ${Object.keys(commands).join(', ')}

      Options
      --version, -v   Version number
      --inspect       Enable the Node.js inspector
      --help, -h      Displays this message

      For more information run a command with the --help flag
      $ yoshi-monorepo build --help
  `);

  process.exit(0);
}

const command = foundCommand ? args._[0] : defaultCommand;
const forwardedArgs = foundCommand ? args._.slice(1) : args._;

if (args['--help']) {
  forwardedArgs.push('--help');
}

Promise.resolve().then(async () => {
  verifyNodeVersion();
  await verifyDependencies();

  if (command === 'start') {
    process.env.NODE_ENV = 'development';
    process.env.BABEL_ENV = 'development';

    normalizeDebuggingArgs();
  }

  if (command === 'build') {
    process.env.NODE_ENV = 'production';
    process.env.BABEL_ENV = 'production';
  }

  const rootConfig = loadConfig();
  const graphResult = await loadPackageGraph();

  await verifyTypeScriptReferences(graphResult);

  const runCommand = (await commands[command]()).default;

  runCommand(forwardedArgs, rootConfig, graphResult);
});
