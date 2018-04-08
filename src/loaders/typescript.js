const threadLoader = require('./thread');

module.exports = isAngularProject => ({
  test: /\.tsx?$/,
  exclude: /(node_modules)/,
  use: [
    threadLoader(),
    ...isAngularProject ? ['ng-annotate-loader'] : [],
    {
      loader: 'ts-loader?{"logLevel":"warn"}',
      options: {
        // Sets *transpileOnly* to true and WARNING! stops registering all errors to webpack.
        // Needed for HappyPack or thread-loader.
        happyPackMode: true,
      },
    }
  ]
});
