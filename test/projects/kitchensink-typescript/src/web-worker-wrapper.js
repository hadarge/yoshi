self['worker-externals'] = 'Some external text';

// This will run in a web worker context
importScripts('/web-worker-bundle.js'); // eslint-disable-line
