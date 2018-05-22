const { afterEach, beforeEach, describe, it } = intern.getInterface("bdd");
const { expect } = intern.getPlugin("chai");
const path = require("path");

const createCompiler = require("./../support/compiler");

const ArcGISWebpackPlugin = require("../../index");

const defaultOptions = {
  useDefaultAssetLoaders: true,
  globalContext: path.join(__dirname, "./../../node_modules", "arcgis-js-api"),
  environment: {
    root: "."
  },
  buildEnvironment: {
    root: "node_modules"
  },
  loaderConfig: {}
};

const IMAGE_FOLDER = "./node_modules/arcgis-js-api/assets/images/logo.png";
const FONTS_FOLDER = "./node_modules/arcgis-js-api/fonts/font.ttf";

const IMAGE_FOLDER_IGNORE = "./node_modules/otherlib/assets/images/logo.png";
const FONTS_FOLDER_IGNORE = "./node_modules/otherlib/fonts/font.ttf";

describe("Initialize ArcGIS webpack plugin", () => {

  const compiler = createCompiler({
    plugins: [
      new ArcGISWebpackPlugin({
        options: {
          loaderConfig: {}
        }
      })
    ]
  });

  it ("will have default options", () => {
    const plugin = new ArcGISWebpackPlugin({
      options: {
        loaderConfig: {}
      }
    });
    expect(plugin.options).to.deep.equal(defaultOptions);
  });

  it ("will add modules to webpack compiler", () => {
    expect(compiler.options.module.rules).to.have.lengthOf(3);
  });

  it ("will have regex that is scoped to the arcgis-js-api folder", () => {
    const [_, urlLoader, fileLoader] = compiler.options.module.rules;
    expect(urlLoader.test.test(IMAGE_FOLDER)).to.be.true;
    expect(urlLoader.test.test(IMAGE_FOLDER_IGNORE)).to.be.false;

    expect(fileLoader.test.test(FONTS_FOLDER)).to.be.true;
    expect(fileLoader.test.test(FONTS_FOLDER_IGNORE)).to.be.false;
  });
});