// https://github.com/sindresorhus/import-fresh/pull/12
declare module 'import-fresh' {
  const importFresh: {
    (moduleId: string): any;
  };

  export = importFresh;
}
