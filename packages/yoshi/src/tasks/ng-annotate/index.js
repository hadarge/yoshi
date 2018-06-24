module.exports = async ({ pattern, target }, { fs }) => {
  let ngAnnotate;
  let ngAnnotateVersion;

  try {
    ngAnnotate = require('ng-annotate');
    ngAnnotateVersion = /^(\d+)/
      .exec(require('ng-annotate/package.json').version)
      .pop();
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new Error(
        'Running this requires `ngAnnotate` >=1. Please install it and re-run.',
      );
    }
    throw error;
  }

  if (Number(ngAnnotateVersion) < 1) {
    throw new Error(
      `The installed version of \`ngAnnotate\` is not compatible (expected: >= 1, actual: ${ngAnnotateVersion}).`,
    );
  }

  const files = await fs.read({ pattern });

  await Promise.all(
    files.map(async ({ filename, content }) => {
      const annotated = ngAnnotate(content, {
        add: true,
        single_quotes: false,
      });

      return await fs.write({
        target,
        filename,
        content: annotated.src,
      });
    }),
  );
};
