const path = require('path');

module.exports = {
  process(src, filename) {
    const svgFilename = JSON.stringify(path.basename(filename));

    return `const React = require('react');
        module.exports = {
        __esModule: true,
        default: ${svgFilename},
        ReactComponent: (props) => ({
          $$typeof: Symbol.for('react.element'),
          type: 'svg',
          ref: null,
          key: null,
          props: Object.assign({}, props, {
            children: ${svgFilename}
          })
        }),
      };`;
  },
};
