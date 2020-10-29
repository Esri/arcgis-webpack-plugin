/*
  Copyright 2020 Esri
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

const path = require("path");

const requiredPlugins = require("./lib/requiredPlugins");
const features = require("./lib/features");
const userExclusions = require("./lib/userExclusions");

module.exports = class ArcGISPlugin {
  /**
   * Initialize the plugin
   * @constructor
   * @param {Object} [options] -(optional) The options for the ArcGIS Webpack Plugin
   * @param {boolean} [options.useDefaultAssetLoaders] - (optional) Let the plugin manage how image, svg, and fonts are loaded
   * @param {Object} [options.features] - (optional) Advanced! Set of features you can enable and disable.
   * @param {boolean} [options.features.3d] - (optional) Advanced! If false, will exclude all 3D related modules from output bundles. Default is `true`
   * @param {Array.<string>} [options.userDefinedExcludes] - (optional) Advanced! Provide a list of modules you would like to exclude from the output bundles
   * @param {Array.<string>} [options.locales] - (optional) Which locales to include in build, leave empty to support all locales
   */
  constructor(options = {}) {
    this.options = {
      useDefaultAssetLoaders: true,
      features: {
        "3d": true
      },
      userDefinedExcludes: [],
      locales: []
    };
    this.options = { ...this.options, ...options, ...options.options };
  }
  
  apply(compiler) {
    compiler.options.module.rules = compiler.options.module.rules || [];
    compiler.options.module.rules.push({
      test: /@dojo/,
      use: "umd-compat-loader"
    });
    if (this.options.useDefaultAssetLoaders) {
      compiler.options.module.rules.push({
        test: /(@arcgis\/core|arcgis-js-api)([\\]+|\/).*.(jpe?g|png|gif|webp)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              // Inline files smaller than 10 kB (10240 bytes)
              limit: 10 * 1024,
            }
          }
        ]
      });
      if (this.options.features["3d"] == false) {
        compiler.options.module.rules.push(features["3d"]);
      }
      if (this.options.userDefinedExcludes && this.options.userDefinedExcludes.length) {
        compiler.options.module.rules.push(userExclusions(this.options.userDefinedExcludes));
      }
      compiler.options.module.rules.push({
        test: /(@arcgis\/core|arcgis-js-api)([\\]+|\/).*.(wsv|ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "build/[name].[ext]"
            }
          }
        ]
      });
    }
    const plugins = requiredPlugins(this.options.locales);
    plugins.forEach(plugin => plugin.apply(compiler));
  }
};
