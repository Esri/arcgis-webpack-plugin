const path = require("path");

const defaultOptions = {
  useDefaultAssetLoaders: true,
  features: {
    "3d": true,
    "has": {}
  },
  userDefinedExcludes: [],
  globalContext: path.join(__dirname, "./../../node_modules", "arcgis-js-api"),
  environment: {
    root: "."
  },
  buildEnvironment: {
    root: "node_modules"
  },
  loaderConfig: {},
  noConsole: true,
  options: {
    loaderConfig: {}
  }
};

module.exports = { defaultOptions };