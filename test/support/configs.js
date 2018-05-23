const path = require("path");

const defaultOptions = {
  useDefaultAssetLoaders: true,
  globalContext: path.join(__dirname, "./../../node_modules", "arcgis-js-api"),
  environment: {
    root: "."
  },
  buildEnvironment: {
    root: "node_modules"
  },
  loaderConfig: {},
  options: {
    loaderConfig: {}
  }
};

module.exports = { defaultOptions };