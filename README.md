# @arcgis/webpack-plugin

[![npm version][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![apache licensed](https://img.shields.io/badge/license-Apache%202.0-orange.svg?style=flat-square)](https://raw.githubusercontent.com/Esri/arcgis-webpack-plugin/master/LICENSE)

[npm-img]: https://img.shields.io/npm/v/@arcgis/webpack-plugin.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@arcgis/webpack-plugin
[travis-img]: https://img.shields.io/travis/Esri/arcgis-webpack-plugin/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/Esri/arcgis-webpack-plugin

Helper plugin for building ArcGIS API for JavaScript applications with webpack to copy assets locally.

**This version of the plugin is for 4.18 or greater of the [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/).**

For version 4.17 and lower, please see [this documentation here](https://github.com/Esri/arcgis-webpack-plugin/blob/96c60c8d469e4976d1b62ec30b4c9838e4d74480/README.md).

* [Features](#features)
* [Options](#options)
* [Usage](#usage)
  * [Additional Features](#additional-features)
* [Issues](#issues)
* [Contributing](#contributing)
* [Licensing](#licensing)

# Features

Requires version `4.18.0` or greater of [`arcgis-js-api`](https://www.npmjs.com/package/arcgis-js-api) or [`@arcgis/core`](https://www.npmjs.com/package/@arcgis/core).

This plugin is only really useful if you want to copy the `@arcgis/core/assets` locally to your build. If you do not have that requirement, you may not need this plugin. It is also useful to and minimize the build output using the [additional features](#additional-features) capability of the plugin.


# Options

| Options     |     Default     | Description   |
| ----------- | :-------------: |:-------------|
| `copyAssets` | `true`  | Should plugin copy assets.  |
| `assetsDir` | `assets`  | The directory name to copy `@arcgis/core/assets` to.  |
| `locales` | `undefined`  | The `t9n` locales you want included in your build output. If not specified, all locales will be available.  |
| `features` | {} | **ADVANCED** - See the [Additional Features](#additional-features) section |
| `userDefinedExcludes` | `[]` | **ADVANCED** - You can provide an array modules as `string` that you want to exclude from the output bundles. For example, you may want to exclude layers you are not using. |

# Usage

`npm install --save-dev @arcgis/webpack-plugin`

```js
// webpack.config.js
const ArcGISPlugin = require("@arcgis/webpack-plugin");

// add it to config
module.exports = {
  ...
  plugins: [new ArcGISPlugin()]
  ...
}
```

If you want to specify supported locales, you can define them in the plugin.

```js
// webpack.config.js
module.exports = {
  ...
  plugins: [
    new ArcGISPlugin({
      locales: ['en', 'es']
    })
  ]
  ...
}
```

In your application you need to set the `assetsPath` of `@arcgis/core/config`.

```js
import config from '@arcgis/core/config';

config.assetsPath = './assets';
```

## Additional Features

### Excluding modules

**NOTE - _Advanced Usage_**

If you are building a 2D mapping application and do not require 3D, you can exclude 3D related modules by disabling the 3d `features`. This option will remove 3D modules from the output JavaScript bundles for your application. Please note, _this does not impact the file size of the JavaScript used in your application, only in the number of bundles generated_.

```js
// webpack.config.js
...
plugins: [
  new ArcGISPlugin({
    // exclude 3D modules from build
    features: {
      "3d": false
    }
  })
],
...
```

You also have the option to pass in an array of other modules that you may want to exclude from your application. For example, maybe you are not using a particular set of layers. You can add them to the `userDefinedExcludes` option.

```js
// webpack.config.js
...
plugins: [
  new ArcGISPlugin({
    // exclude modules you do not need
    userDefinedExcludes: [
      "@arcgis/core/layers/BingMapsLayer",
      "@arcgis/core/layers/CSVLayer",
      "@arcgis/core/layers/GeoRSSLayer",
      "@arcgis/core/layers/ImageryLayer",
      "@arcgis/core/layers/KMLLayer",
      "@arcgis/core/layers/MapImageLayer",
      "@arcgis/core/layers/OpenStreetMapLayer",
      "@arcgis/core/layers/StreamLayer",
      "@arcgis/core/layers/WMSLayer",
      "@arcgis/core/layers/WMTSLayer",
      "@arcgis/core/layers/WebTileLayer"
    ]
  })
],
...
```

You can specify that you do not want to copy assets, but want to exclude some modules.

```js
// webpack.config.js
module.exports = {
  ...
  plugins: [
    new ArcGISPlugin({
      copyAssets: false,
      // exclude 3D modules from build
      features: {
        "3d": false
      }
    })
  ]
  ...
}
```

Again, this considered **ADVANCED** usage, so please use with caution.

# Issues

Find a bug or want to request a new feature enhancement? Let us know by submitting an issue.

# Contributing

Anyone and everyone is welcome to [contribute](CONTRIBUTING.md). We do accept pull requests.

1.  Get involved
2.  Report issues
3.  Contribute code
4.  Improve documentation

# Licensing

Copyright 2021 Esri

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

A copy of the license is available in the repository's [LICENSE](./LICENSE) file
