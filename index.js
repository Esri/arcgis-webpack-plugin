/*
  Copyright 2021 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

const requiredPlugins = require("./lib/requiredPlugins");
const features = require("./lib/features");
const userExclusions = require("./lib/userExclusions");

module.exports = class ArcGISPlugin {
  /**
   * Initialize the plugin
   * @constructor
   * @param {Object} [options] -(optional) The options for the ArcGIS Webpack Plugin
   * @param {Boolean} [options.copyAssets] -(optional) PLugin should copy assets. Default is `true`.
   * @param {String} [options.assetsDir] - (optional) Directory name to copy local assets to. Default is `assets`.
   * @param {Object} [options.features] - (optional) Advanced! Set of features you can enable and disable.
   * @param {Boolean} [options.features.3d] - (optional) Advanced! If false, will exclude all 3D related modules from output bundles. Default is `true`
   * @param {Array.<string>} [options.userDefinedExcludes] - (optional) Advanced! Provide a list of modules you would like to exclude from the output bundles
   * @param {Array.<string>} [options.locales] - (optional) Which locales to include in build, leave empty to support all locales
   */
  constructor(options = {}) {
    this.options = {
      copyAssets: true,
      assetsDir: 'assets',
      features: {
        "3d": true
      },
      userDefinedExcludes: [],
      locales: []
    };
    this.options = { ...this.options, ...options };
  }
  
  apply(compiler) {
    compiler.options.module.rules = compiler.options.module.rules || [];
    if (this.options.features["3d"] == false) {
      compiler.options.module.rules.push(features["3d"]);
    }
    if (this.options.userDefinedExcludes && this.options.userDefinedExcludes.length) {
      compiler.options.module.rules.push(userExclusions(this.options.userDefinedExcludes));
    }
    const plugins = requiredPlugins(this.options.locales, this.options.copyAssets, this.options.assetsDir);
    plugins.forEach(plugin => plugin.apply(compiler));
  }
};
