const MemoryFileSystem = require("memory-fs");
const webpack = require("webpack");

module.exports = function createCompiler(options = {}) {
  const compiler = webpack({
    bail: true,
    cache: false,
    entry: `${__dirname}/../fixtures/entry.js`,
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
  });
  compiler.outputFileSystem = new MemoryFileSystem();
  return compiler;
}
