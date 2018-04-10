# @arcgis/webpack-plugin

Build ArcGIS API for JavaScript applications with webpack

# Features

This plugin utilizes the [dojo-webpack-plugin](https://github.com/OpenNTF/dojo-webpack-plugin) to build ArcGIS API for JavaScript applications with webpack.

_Requires version `4.7.0` or greater of the [ArcGIS API for JavaScript](https://github.com/esri/arcgis-js-api)_

# Usage

`npm install --save-dev @arcgis/webpack-plugin`

In order for the workers used in the ArcGIS API for JavaScript to work correctly, you will need to provide an external loader.

This is a temporary solution until we can update how workers are loaded in the ArcGIS API for JavaScript so they are compatible with the output of a webpack build.

```ts
import esriConfig = require("esri/config");

const DEFAULT_WORKER_URL = "https://js.arcgis.com/4.7/";
const DEFAULT_LOADER_URL = `${DEFAULT_WORKER_URL}dojo/dojo-lite.js`;

(esriConfig.workers as any).loaderUrl = DEFAULT_LOADER_URL;
esriConfig.workers.loaderConfig = {
  baseUrl: `${DEFAULT_WORKER_URL}dojo`,
  packages: [
    { name: "esri", location: `${DEFAULT_WORKER_URL}esri` },
    { name: "dojo", location: `${DEFAULT_WORKER_URL}dojo` },
    { name: "dojox", location: `${DEFAULT_WORKER_URL}dojox` },
    { name: "dstore", location: `${DEFAULT_WORKER_URL}dstore` },
    { name: "moment", location: `${DEFAULT_WORKER_URL}moment` },
    { name: "@dojo", location: `${DEFAULT_WORKER_URL}@dojo` },
    {
      name: "cldrjs",
      location: `${DEFAULT_WORKER_URL}cldrjs`,
      main: "dist/cldr"
    },
    {
      name: "globalize",
      location: `${DEFAULT_WORKER_URL}globalize`,
      main: "dist/globalize"
    },
    {
      name: "maquette",
      location: `${DEFAULT_WORKER_URL}maquette`,
      main: "dist/maquette.umd"
    },
    {
      name: "maquette-css-transitions",
      location: `${DEFAULT_WORKER_URL}maquette-css-transitions`,
      main: "dist/maquette-css-transitions.umd"
    },
    {
      name: "maquette-jsx",
      location: `${DEFAULT_WORKER_URL}maquette-jsx`,
      main: "dist/maquette-jsx.umd"
    },
    { name: "tslib", location: `${DEFAULT_WORKER_URL}tslib`, main: "tslib" }
  ]
}
```

# Options

| Options     | Description   |
| ----------- |:-------------|
| `root`      | Is used in the `env` passed to your loader configuration. See [environment](https://github.com/OpenNTF/dojo-webpack-plugin#environment) details in the dojo-webpack-plugin. |
| `locales`   | The locales you want included in your build output. See the [locales](https://github.com/OpenNTF/dojo-webpack-plugin#locales) details of the dojo-webpack-plugin. |
| `options`   | You can pass any [native options of the dojo-webpack-plugin](https://github.com/OpenNTF/dojo-webpack-plugin#options) if you want to override some of the defaults of this plugin. This would also allow you to use your own [loaderConfig](https://github.com/OpenNTF/dojo-webpack-plugin#loaderconfig) instead of the default one. |

# Best Practices

The bare minimum to start using the plugin is the following:

```js
  plugins: [
    new ArcGISPlugin()
  ],
```

See [options](#options) section for details of options you can provide to the plugin.

## Node globals

It is recommended that you ignore the node `process` and `global`, so they don't get built into your bundle.

```js
// webpack.config.js
  node: {
    process: false,
    global: false
  }
```

## Web Assembly files

You will want to tell Webpack to ignore the web assembly files that are included in the ArcGIS API for JavaScript. They are utilized in the workers, which for the time being, need to be loaded via the CDN as noted above.

```js
// webpack.config.js
  externals: [
    (context, request, callback) => {
      if (/pe-wasm$/.test(request)) {
        return callback(null, "amd " + request);
      }
      callback();
    }
  ],
```

## CSS

When working with CSS, you can load the files directly from your application and let the [`html-webpack-plugin`](https://github.com/jantimon/html-webpack-plugin) and [`mini-css-extract-plugin`](https://github.com/webpack-contrib/mini-css-extract-plugin) output the CSS file and inject the file location directly into your output HTML file.

```ts
import "./css/main.scss";
```

```js
// webpack.config.js
  ...
  module: {
    rules: [
      ...
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: false }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [
    ...
    // will copy your index.html file
    // and inject assets for you
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      chunksSortMode: "none"
    }),
    // will output a css file that you
    // imported in your application
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
  ...
```

However, if you would like to use the [`style-loader`](https://github.com/webpack-contrib/style-loader) to load your styles at runtime, you will need to modify your code.

```ts
import "css!./css/main.scss";
```

```js
// webpack.config.js
...
  plugins: [
    ...
    // For plugins registered after the ArcGISPlugin, data.request has been normalized and
    // resolved to an absMid and other mappings and aliases have been applied.
    // You will need to update the loader plugin appropriately.
    new webpack.NormalModuleReplacementPlugin(/^css!/, function(data) {
      data.request = data.request.replace(
        /^css!/,
        "!style-loader!css-loader!sass-loader?indentedSyntax=false"
      );
    })
...
```

Please note, we have tested the `@arcgis/webpack-plugin` with numerous other plugins, but cannot guarantee that other webpack plugins may not cause some unexpected behavior.

# Things we're working on

1. Only works with TypeScript ([`ts-loader`](https://github.com/TypeStrong/ts-loader)) or similar at the moment. There are some issues with the output of the `babel-loader` we are currently trying to work on.
2. Compatibility with [`DllPlugin`](https://webpack.js.org/plugins/dll-plugin/). We're trying to find how we can create a single or multiple DLL file to share across multiple applications.
3. Improved bundles. We're going to be working towards trying to reduce the number of bundles that Webpack generates due to how we dynamically import modules at runtime.

# Issues
Find a bug or want to request a new feature enhancement?  Let us know by submitting an issue.

# Contributing
Anyone and everyone is welcome to [contribute](CONTRIBUTING.md). We do accept pull requests.

1. Get involved
2. Report issues
3. Contribute code
4. Improve documentation

# Licensing
Copyright 2018 Esri

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

A copy of the license is available in the repository's [LICENSE](./LICENSE) file