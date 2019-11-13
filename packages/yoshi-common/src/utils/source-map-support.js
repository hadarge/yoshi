// Don't pollute Jest/Mocha by installing `source-map-support`
if (process.env.NODE_ENV !== 'test') {
  try {
    require('source-map-support').install();
  } catch (e) {
    console.error(
      'Cannot find "source-map-support", stack traces may appear without source maps.',
    );
    console.error(
      'Run `npm i --save source-map-support` to have better stack traces',
    );
  }
}
