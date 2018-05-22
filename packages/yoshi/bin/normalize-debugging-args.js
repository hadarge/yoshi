const normalizeDebuggingArgs = () => {
  const inspectPrefix = '--inspect';
  const debugArgName = '--debug';
  const debugBrkArgName = '--debug-brk';
  const defaultDebugPort = '9229';

  // IDEs start debugging with '--inspect' or '--inspect-brk' option
  // we are setting --debug instead
  if (process.execArgv.some(arg => arg.startsWith(inspectPrefix))) {
    process.execArgv = process.execArgv.filter(
      arg => !arg.startsWith(inspectPrefix),
    );
    process.argv.push(debugArgName);
  }

  // assign default port to --debug option
  const debugArgIndex = process.argv.indexOf(debugArgName);
  if (debugArgIndex !== -1) {
    process.argv[debugArgIndex] = `${debugArgName}=${defaultDebugPort}`;
  }
  const debugBrkArgIndex = process.argv.indexOf(debugBrkArgName);
  if (debugBrkArgIndex !== -1) {
    process.argv[debugBrkArgIndex] = `${debugBrkArgName}=${defaultDebugPort}`;
  }
};

module.exports = normalizeDebuggingArgs;
