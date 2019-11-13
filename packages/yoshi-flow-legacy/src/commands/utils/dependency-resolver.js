const tempy = require('tempy');
const Runtime = require('jest-runtime');
const DependencyResolver = require('jest-resolve-dependencies');

async function getDependencyResolver(cwd = process.cwd()) {
  // Basic Jest config to generate HasteMap
  const config = {
    haste: {
      providesModuleNodeModules: [],
    },
    moduleFileExtensions: ['js', 'ts', 'tsx', 'jsx'],
    modulePathIgnorePatterns: [],
    cacheDirectory: tempy.directory(),
    rootDir: cwd,
    roots: [cwd],
  };

  // Runtime context includes the config, HasteMap and a HasteResolver
  const runtimeContext = await Runtime.createContext(config, {
    maxWorkers: 1,
    watchman: false,
  });

  // DependencyResolver helps with resolving dependencies between modules
  const dependencyResolver = new DependencyResolver(
    runtimeContext.resolver,
    runtimeContext.hasteFS,
  );

  return dependencyResolver;
}

module.exports = getDependencyResolver;
