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

const path = require("path");

module.exports = function getConfig(env) {
  // env is set by the "buildEnvronment" and/or "environment" plugin options (see webpack.config.js),
  dojoConfig = {
    baseUrl: ".",
    packages: [
      {
        name: "esri",
        location: env.root + "/arcgis-js-api",
        main: "kernel"
      },
      {
        name: "@dojo",
        location: env.root + "/@dojo",
        lib: "."
      },
      {
        name: "cldrjs",
        location: env.root + "/cldrjs",
        main: "dist/cldr"
      },
      {
        name: "globalize",
        location: env.root + "/globalize",
        main: "dist/globalize"
      },
      {
        name: "tslib",
        location: env.root + "/tslib",
        main: "tslib"
      },
      {
        name: "moment",
        location: env.root + "/moment",
        lib: "."
      },
      {
        name: "dojo",
        location: env.root + "/dojo",
        lib: "."
      },
      {
        name: "dijit",
        location: env.root + "/dijit",
        lib: "."
      },
      {
        name: "dojox",
        location: env.root + "/dojox",
        lib: "."
      },
      {
        name: "dstore",
        location: env.root + "/dojo-dstore",
        lib: "."
      },
      {
        name: "maquette",
        location: env.root + "/maquette",
        main: "dist/maquette.umd",
        resourceTags: {
          miniExclude: function(filename, mid) {
            return (
              mid.indexOf("/polyfills/") > -1 ||
              (mid.indexOf("/dist/") > -1 &&
                filename.indexOf(".umd.js") === -1)
            );
          }
        }
      },
      {
        name: "maquette-css-transitions",
        location: env.root + "/maquette-css-transitions",
        main: "dist/maquette-css-transitions.umd",
        resourceTags: {
          miniExclude: function(filename, mid) {
            return (
              mid.indexOf("/dist/") > -1 && filename.indexOf(".umd.js") === -1
            );
          }
        }
      },
      {
        name: "maquette-jsx",
        location: env.root + "/maquette-jsx",
        main: "dist/maquette-jsx.umd",
        resourceTags: {
          miniExclude: function(filename, mid) {
            return (
              mid.indexOf("/dist/") > -1 && filename.indexOf(".umd.js") === -1
            );
          }
        }
      }
    ],

    map: {
      globalize: {
        cldr: "cldrjs/dist/cldr",
        "cldr/event": "cldrjs/dist/cldr/event",
        "cldr/supplemental": "cldrjs/dist/cldr/supplemental",
        "cldr/unresolved": "cldrjs/dist/cldr/unresolved"
      }
    },

    async: true,

    has: {
      "dojo-config-api": 0, // Don't need the config API code in the embedded Dojo loader
      "esri-promise-compatibility": 1,
      "esri-webpack": 1
    }
  };
  return dojoConfig;
};
