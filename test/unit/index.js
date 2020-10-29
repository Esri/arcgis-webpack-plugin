const { after, before, describe, it } = intern.getInterface("bdd");
const { expect } = intern.getPlugin("chai");
const sinon = require("sinon");

const createCompiler = require("../support/compiler");
const { defaultOptions } = require("../support/configs");

const ArcGISWebpackPlugin = require("../../index");

// test paths
const IMAGE_FOLDER = "./node_modules/arcgis-js-api/assets/images/logo.png";
const FONTS_FOLDER = "./node_modules/arcgis-js-api/fonts/font.ttf";
const IMAGE_FOLDER_IGNORE = "./node_modules/otherlib/assets/images/logo.png";
const FONTS_FOLDER_IGNORE = "./node_modules/otherlib/fonts/font.ttf";

describe("Initialize ArcGIS webpack plugin", () => {
  it ("will have default options", () => {
    const plugin = new ArcGISWebpackPlugin();
    expect(plugin.options).to.deep.equal(defaultOptions);
  });

  it ("will add modules to webpack compiler", () => {
    const plugin = new ArcGISWebpackPlugin();
    const compiler = createCompiler();
    plugin.apply(compiler);
    expect(compiler.options.module.rules).to.have.lengthOf(3);
  });

  it ("will not use default loaders given useDefaultAssetLoaders = false", () => {
    const plugin = new ArcGISWebpackPlugin({
      useDefaultAssetLoaders: false
    });
    const compiler = createCompiler();
    plugin.apply(compiler);
    expect(compiler.options.module.rules).to.have.lengthOf(1);
  });

  it ("will use null-loader to exclude 3D modules given exclude3D = true", () => {
    const plugin = new ArcGISWebpackPlugin({
      features: {
        "3d": false
      }
    });
    const compiler = createCompiler();
    plugin.apply(compiler);
    expect(compiler.options.module.rules).to.have.lengthOf(4);
  });

  it ("will use null-loader to exclude user defined modules given userDefinedExcludes = true", () => {
    const plugin = new ArcGISWebpackPlugin({
      userDefinedExcludes: [ "dont/use/me" ]
    });
    const compiler = createCompiler();
    plugin.apply(compiler);
    expect(compiler.options.module.rules).to.have.lengthOf(4);
  });
});
