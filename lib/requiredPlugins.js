/*
  Copyright 2018 Esri
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

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HasJsPlugin = require("webpack-hasjs-plugin");
const Terser = require("terser");

const webpack = require("webpack");

const optimize = (fileContent, path) => Terser.minify(fileContent.toString()).code.toString();

module.exports = function(hasFeatures) {
  return [
    // Check for has() features in the build
    // Feature list taken directly from what is
    // used in Dojo builds
    new HasJsPlugin({
      features: {
        "config-dojo-loader-catches": 0,
        "config-tlmSiblingOfDojo": 0,
        "dojo-amd-factory-scan": 0,
        "dojo-combo-api": 0,
        "dojo-config-api": 1,
        "dojo-config-require": 0,
        "dojo-debug-messages": 0,
        "dojo-dom-ready-api": 1,
        "dojo-firebug": 0,
        "dojo-guarantee-console": 1,
        // https://dojotoolkit.org/documentation/tutorials/1.10/device_optimized_builds/index.html
        // https://dojotoolkit.org/reference-guide/1.10/dojo/has.html
        "dom-addeventlistener": 1,
        "dom-qsa": 1,
        "dom-qsa2.1": 1,
        "dom-qsa3": 1,
        "dom-matches-selector": 1,
        "json-stringify": 1,
        "json-parse": 1,
        "bug-for-in-skips-shadowed": 0,
        "native-xhr": 1,
        "native-xhr2": 1,
        "native-formdata": 1,
        "native-response-type": 1,
        "native-xhr2-blob": 1,
        "dom-parser": 1,
        activex: 0,
        "script-readystatechange": 1,
        "ie-event-behavior": 0,
        MSPointer: 0,
        "touch-action": 1,
        "dom-quirks": 0,
        "array-extensible": 1,
        "console-as-object": 1,
        jscript: 0,
        "event-focusin": 1,
        "events-mouseenter": 1,
        "events-mousewheel": 1,
        "event-orientationchange": 1,
        "event-stopimmediatepropagation": 1,
        "touch-can-modify-event-delegate": 0,
        "dom-textContent": 1,
        "dom-attributes-explicit": 1,

        // unsupported browsers
        air: 0,
        wp: 0,
        khtml: 0,
        wii: 0,
        quirks: 0,
        bb: 0,
        msapp: 0,
        opr: 0,
        android: 0,

        svg: 1,

        // Disable deferred instrumentation by default in the built version.
        "config-deferredInstrumentation": 0,

        // Dojo loader will have "has" api, but other loaders such as
        // RequireJS do not. So, let"s not mark it static.
        // This will allow RequireJS loader to fetch our modules.
        "dojo-has-api": -1,

        "dojo-inject-api": 1,
        "dojo-loader": 1,
        "dojo-log-api": 0,
        "dojo-modulePaths": 0,
        "dojo-moduleUrl": 0,
        "dojo-publish-privates": 0,
        "dojo-requirejs-api": 0,
        "dojo-sniff": 0,
        "dojo-sync-loader": 0,
        "dojo-test-sniff": 0,
        "dojo-timeout-api": 0,
        "dojo-trace-api": 0,
        //"dojo-undef-api": 0,
        "dojo-v1x-i18n-Api": 1, // we still need i18n.getLocalization
        "dojo-xhr-factory": 0,
        dom: -1,
        "host-browser": -1,
        "extend-dojo": 1,
        "extend-esri": 0,

        "esri-webpack": 1,
        // for WebGL instance count debugging
        "esri-webgl-debug": 0,
        "esri-2d-debug": 0,

        "esri-feature-tiles-debug": 0,
        "esri-feature-highlight-debug": 0,

        // Used to stabilize WebGL feature layer and vector tile layer during screenshot testing.
        "stable-symbol-rendering": 0,

        // Used to output tile processing performance info
        "esri-tiles-performance": 0,

        // do not show version number in console
        "esri-console-log-version": 1,

        // Used to output tile processing performance info
        "esri-tiles-performance": 0,

        // this is set to true in dojo-config.js
        "esri-validate-shaders": 0,

        // user defined features
        ...hasFeatures
      }
    }),
    // Copy non-packed resources needed by the app to the build directory
    new CopyWebpackPlugin([
      {
        context: "node_modules",
        from: "dojo/resources/blank.gif",
        to: "dojo/resources"
      },
      {
        context: "node_modules",
        from: "@arcgis/webpack-plugin/extras/dojo/",
        to: "dojo/"
      },
      {
        context: "node_modules",
        from: "@arcgis/webpack-plugin/extras/dojo/dojo.js",
        to: "dojo/dojo-lite.js"
      },
      {
        context: "node_modules",
        from: "arcgis-js-api/images/",
        to: "esri/images/"
      },
      {
        context: "node_modules",
        from: "arcgis-js-api/views/3d/environment/resources/stars.wsv",
        to: "esri/views/3d/environment/resources/stars.wsv"
      },
      {
        context: "node_modules",
        from: "arcgis-js-api/geometry/support/pe-wasm.wasm",
        to: "esri/geometry/support/pe-wasm.wasm"
      },
      {
        context: "node_modules",
        from: "arcgis-js-api/themes/base/images/",
        to: "esri/themes/base/images/"
      },
      {
        context: "node_modules",
        from: "arcgis-js-api/core/workers/",
        to: "esri/core/workers/"
      },
      {
        context: "node_modules",
        from: "arcgis-js-api/core/workers/worker.js",
        to: "esri/core/workers/worker.js",
        transform: optimize
      },
      {
        context: "node_modules",
        from: "arcgis-js-api/views/2d/layers/features/",
        to: "esri/views/2d/layers/features/"
      },
      {
        context: "node_modules",
        from: "arcgis-js-api/layers/graphics/sources/support/",
        to: "esri/layers/graphics/sources/support/"
      },
      // charts libs and locale
      {
        context: "node_modules",
        from: "arcgis-js-api/libs/amcharts4/",
        to: "esri/libs/amcharts4/"
      },
      // Copy the moment locales
      // so they can be dynamically loaded
      {
        context: "node_modules",
        from: "moment/locale/",
        to: "moment/locale/"
      },
      // t9n
      {
        context: "node_modules",
        from: "arcgis-js-api/t9n/",
        to: "esri/t9n/"
      },
      {
        context: "node_modules",
        from: "arcgis-js-api/**/t9n/*.json",
        transformPath(targetPath, absolutePath) {
          return targetPath.replace('arcgis-js-api', 'esri');
        },
      },
      {
        context: "node_modules",
        from: "arcgis-js-api/**/**/t9n/*.json",
        transformPath(targetPath, absolutePath) {
          return targetPath.replace('arcgis-js-api', 'esri');
        },
      },
    ]),
    // For plugins registered after the DojoAMDPlugin, data.request has been normalized and
    // resolved to an absMid and loader-config maps and aliases have been applied
    new webpack.NormalModuleReplacementPlugin(
      /^dojox\/gfx\/renderer!/,
      "dojox/gfx/svg"
    ),
    new webpack.NormalModuleReplacementPlugin(/\/moment!/, "moment/moment"),
    // Ignore all locale files of moment.js
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ];
};
