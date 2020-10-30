# @arcgis/webpack-plugin

[![npm version][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![apache licensed](https://img.shields.io/badge/license-Apache%202.0-orange.svg?style=flat-square)](https://raw.githubusercontent.com/Esri/arcgis-webpack-plugin/master/LICENSE)

[npm-img]: https://img.shields.io/npm/v/@arcgis/webpack-plugin.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@arcgis/webpack-plugin
[travis-img]: https://img.shields.io/travis/Esri/arcgis-webpack-plugin/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/Esri/arcgis-webpack-plugin

Helper plugin for building ArcGIS API for JavaScript applications with webpack.

**This version of the plugin is for 4.18 or greater of the [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/).**

For version 4.17 and lower, please see [this documentation here](https://github.com/Esri/arcgis-webpack-plugin/blob/96c60c8d469e4976d1b62ec30b4c9838e4d74480/README.md).

* [Features](#features)
* [Options](#options)
* [Usage](#usage)
  * [Asset Loaders](#asset-loaders)
  * [Additional Features](#additional-features)
* [Issues](#issues)
* [Contributing](#contributing)
* [Licensing](#licensing)

# Features

Requires version `4.18.0` or greater of [`arcgis-js-api`](https://www.npmjs.com/package/arcgis-js-api) or [`@arcgis/core`](https://www.npmjs.com/package/@arcgis/core).


# Options

| Options     |     Default     | Description   |
| ----------- | :-------------: |:-------------|
| `useDefaultAssetLoaders` | `true` | By default, this plugin provides [url-loader](https://github.com/webpack-contrib/url-loader) for images and [file-loader](https://github.com/webpack-contrib/file-loader) for fonts and svg that are used by the ArcGIS API for JavaScript. If you are using another library that requires you to also load assets, you may want to disable the default loaders of this plugin and use your own. |
| `locales` | `undefined`  | The `t9n` locales you want included in your build output. If not specified, all locales will be availble.  |
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

## Asset Loaders

By default, this plugin provides provides [url-loader](https://github.com/webpack-contrib/url-loader) for images and [file-loader](https://github.com/webpack-contrib/file-loader) for assets that are only used by the ArcGIS API for JavaScript. However, if you are using another library that you need to load image, svg, or fonts for, you will want to provide your own loaders. You will want to set the `useDefaultAssetLoaders` to `false`.

```js
// webpack.config.js
...
plugins: [
  new ArcGISPlugin({
    // disable provided asset loaders
    useDefaultAssetLoaders: false
  })
],
...
```

Then you can provide your own asset loaders.

```js
// webpack.config.js
...
  module: {
    rules: [
      ...
      {
        test: /\.(jpe?g|png|gif|webp)$/,
        loader: "url-loader",
        options: {
          // Inline files smaller than 10 kB (10240 bytes)
          limit: 10 * 1024,
        }
      },
      {
        test: /\.(wsv|ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "build/[name].[ext]"
            }
          }
        ]
      }
    ]
  }
...

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

Copyright 2020 Esri

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

A copy of the license is available in the repository's [LICENSE](./LICENSE) file
