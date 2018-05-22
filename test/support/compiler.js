const MemoryFileSystem = require("memory-fs");
const webpack = require("webpack");

module.exports = function createCompiler(options = {}) {
  const compiler = webpack(Array.isArray(options) ? options : {
    bail: true,
    cache: false,
    entry: `${__dirname}/fixtures/entry.js`,
    output: {
      path: `${__dirname}/dist`,
      filename: '[name].[chunkhash].js',
      chunkFilename: '[id].[name].[chunkhash].js',
    },
    module: {
      rules: []
    },
    plugins: [],
    ...options,
  }, function(err, stats) {
  });
  compiler.outputFileSystem = new MemoryFileSystem();
  return compiler;
}
