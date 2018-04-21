# @arcgis/webpack-plugin

Build ArcGIS API for JavaScript applications with webpack

* [Features](#features)
* [Usage](#usage)
* [Options](#options)
* [Best Practices](#best-practices)
  * [Loaders](#loaders)
  * [Promises](#promises)
  * [Node Globals](#node-globals)
  * [Web Assembly Files](#web-assembly-files)
  * [CSS](#css)
* [How does it work?](#how-does-it-work)
  * [Required Files](#required-files)
  * [Override loader plugins](#override-loader-plugins)
  * [Other loaders](#other-loaders)
  * [Loader Configuration](#loader-configuration)
* [Things we're working on](#things-were-working-on)
* [Issues](#issues)
* [Contributing](#contributing)
* [Licensing](#licensing)

# Features

This plugin utilizes the [dojo-webpack-plugin](https://github.com/OpenNTF/dojo-webpack-plugin) to build ArcGIS API for JavaScript applications with webpack.

_Requires version `4.7.0` or greater of the [ArcGIS API for JavaScript](https://github.com/esri/arcgis-js-api/tree/4master)_

* Uses a lightweight AMD loader _during_ the Webpack build process to resolve module paths. The AMD loader is not used in the output application.
* Creates bundles of your application with ArcGIS API for JavaScript included.

# Usage

`npm install --save-dev @arcgis/webpack-plugin`

In order for the workers used in the ArcGIS API for JavaScript to work correctly, you will need to provide an external loader.

This is a temporary solution until we can update how workers are loaded in the ArcGIS API for JavaScript so they are compatible with the output of a webpack build.

```ts
import esriConfig from "esri/config";

const DEFAULT_WORKER_URL = "https://js.arcgis.com/4.7/";
const DEFAULT_LOADER_URL = `${DEFAULT_WORKER_URL}dojo/dojo-lite.js`;

esriConfig.workers.loaderUrl = DEFAULT_LOADER_URL;
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
};
```

# Options

| Options     |     Default     | Description   |
| ----------- | :-------------: |:-------------|
| `root`    | `"."` | Is used in the `env` passed to your loader configuration. See [environment](https://github.com/OpenNTF/dojo-webpack-plugin#environment) details in the dojo-webpack-plugin.  |
| `locales` | `["en"]`  | The locales you want included in your build output. See the [locales](https://github.com/OpenNTF/dojo-webpack-plugin#locales) details of the dojo-webpack-plugin.  |
| `options` | `undefined` | You can pass any [native options of the dojo-webpack-plugin](https://github.com/OpenNTF/dojo-webpack-plugin#options) if you want to override some of the defaults of this plugin. This would also allow you to use your own [loaderConfig](https://github.com/OpenNTF/dojo-webpack-plugin#loaderconfig) instead of the default one. |

# Best Practices

The bare minimum to start using the plugin is the following:

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

If you notice some oddities in the path resolutions of modules in your bundles, you can try to define how you want them referenced.

```js
plugins: [
  new ArcGISPlugin({
    // "../app" or similar depending on your build.
    // most likely do not need to change
    root: ".",
    locales: ["en"]
  })
];
```

Maybe you want to override all the default options of this plugin.

```js
plugins: [
  new ArcGISPlugin({
    options: {
      loaderConfig: require("./js/loaderConfig"),
      environment: { appRoot: "release" },
      buildEnvironment: { appRoot: "node_modules" },
      locales: ["en"]
    }
  })
];
```

## Loaders

Whether you are using a TypeScript loader like [ts-loader](https://github.com/TypeStrong/ts-loader) or writing modern JavaScript and using the [babel-loader](https://github.com/babel/babel-loader), the output files from the loader need to be in AMD. This is so the dependencies can be picked up by the lightweight AMD loader of this plugin during build time.

That means that for TypeScript, your `tsconfig.json` should have the following option:

```json
{
  "compilerOptions": {
    "module": "amd"
  }
}

```

If you are using babel, be sure to include the [ES2015 modules to AMD transform plugin](https://babeljs.io/docs/plugins/transform-es2015-modules-amd/). Once installed you can add to your babel configuration as:

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": ["transform-es2015-modules-amd"]
}
```

## Promises

Webpack will include [ES6 Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) in your bundles, so you may want to include a Promise shim in your application. Some more detail [here](https://github.com/OpenNTF/dojo-webpack-plugin#es6-promise-dependency-in-webpack-2x). We have tested the [`@dojo/shim/Promise`](https://github.com/dojo/shim#promises) with success in our test applications. 

See the [dojo-webpack-plugin-sample](https://github.com/OpenNTF/dojo-webpack-plugin-sample) for more details.

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

# How does it work?

This plugin utilizes the [`dojo-webpack-plugin`](https://github.com/OpenNTF/dojo-webpack-plugin) and provides some default settings out-of-the-box.

For the following, you can see the [source code](/index.js) for details of how the plugin is put together.

## Required Files

There are some files that need to be copied over after the bundles are done so they can be referenced dynamically at runtime. We manage this as part of the plugin.

```js
const requiredPlugins = [
  // Copy non-packed resources needed by the app to the build directory
  new CopyWebpackPlugin([
    {
      context: "node_modules",
      from: "dojo/resources/blank.gif",
      to: "dojo/resources"
    },
    {
      context: "node_modules",
      from: "dojo/dojo.js",
      to: "dojo/dojo.js"
    },
    {
      context: "node_modules",
      from: "dojo/dojo.js",
      to: "dojo/dojo-lite.js"
    },
    {
      context: "node_modules",
      from: "dojo/request/script.js",
      to: "dojo/request/script.js"
    },
    {
      context: "node_modules",
      from: "arcgis-js-api/views/3d/environment/resources/stars.wsv",
      to: "arcgis-js-api/views/3d/environment/resources/stars.wsv"
    },
    {
      context: "node_modules",
      from: "arcgis-js-api/themes/base/images/",
      to: "arcgis-js-api/themes/base/images/"
    },
    {
      context: "node_modules",
      from: "arcgis-js-api/images/",
      to: "arcgis-js-api/images/"
    },
    {
      context: "node_modules",
      from: "arcgis-js-api/workers/",
      to: "arcgis-js-api/workers/"
    },
    {
      context: "node_modules",
      from: "arcgis-js-api/core/workers/",
      to: "arcgis-js-api/core/workers/"
    }
  ]),
  ...
];
```

## Override loader plugins

We are also able to change a couple of references to loader plugins and replace the output with defined modules. We manage that as part of the plugin as well.

```js

const requiredPlugins = [
  ...
  // For plugins registered after the DojoAMDPlugin, data.request has been normalized and
  // resolved to an absMid and loader-config maps and aliases have been applied
  new webpack.NormalModuleReplacementPlugin(
    /^dojox\/gfx\/renderer!/,
    "dojox/gfx/svg"
  ),
  new webpack.NormalModuleReplacementPlugin(/\/moment!/, "moment/moment")
];
```

## Other loaders

We have some additional loaders we add out-of-the-box that are utilized as part of the Webpack bundling of CSS files and other assets.

```js
const additionalLoaders = [
  // @dojo modules are referenced in the API and need to be loaded via a umd loader
  {
    test: /@dojo/,
    use: "umd-compat-loader"
  },
  {
    test: /\.(jpe?g|png|gif|webp)$/,
    loader: "url-loader",
    options: {
      // Inline files smaller than 10 kB (10240 bytes)
      limit: 10 * 1024,
    }
  },
  {
    test: /.(wsv|ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
    use: [
      {
        loader: "file-loader",
        options: {
          name: "build/[name].[ext]"
        }
      }
    ]
  }
];
```

Then we instantiate the dojo-webpack-plugin with the options provided and pass that into the Webpack pipeline.

```js
this.options = {
  globalContext: path.join(__dirname, "node_modules", "arcgis-js-api"),
  environment: {
    root: options.root || "."
  },
  buildEnvironment: {
    root: "node_modules"
  },
  locales: options.locales || ["en"]
};
this.options = { ...this.options, ...options.options };
if (!this.options.loaderConfig) {
  this.options.loaderConfig = require("./lib/loaderConfig");
}

this.dojoPlugin = new DojoWebpackPlugin(this.options);
```

## Loader Configuration

We also provide a default [loaderConfig](https://github.com/OpenNTF/dojo-webpack-plugin#the-dojo-loader-config) for this plugin that defines the [location of the ArcGIS API for JavaScript and its dependencies](/lib/loaderConfig.js). Note, this should only be used for dependencies of the ArcGIS API for JavaScript, you do not need to define locations for other libraries used with your application.

We provide some default `has` configurations of the loader.

```js
    ...
    has: {
      "dojo-config-api": 0,             // Don't need the config API code in the embedded Dojo loader
      "esri-promise-compatibility": 1,  // Use native Promises by default
      "esri-webpack": 1,                // a flag used internally by the ArcGIS API for JavaScript
      "esri-featurelayer-webgl": 1      // Enable FeatureLayer WebGL capabilities
    }
    ...
```

# Things we're working on

1.  Compatibility with [`DllPlugin`](https://webpack.js.org/plugins/dll-plugin/). We're trying to find how we can create a single Dll or multiple Dlls file to share across multiple applications.
2.  Improved bundles. We're going to be working towards trying to reduce the number of bundles that Webpack generates due to how we dynamically import modules at runtime.

# Issues

Find a bug or want to request a new feature enhancement? Let us know by submitting an issue.

# Contributing

Anyone and everyone is welcome to [contribute](CONTRIBUTING.md). We do accept pull requests.

1.  Get involved
2.  Report issues
3.  Contribute code
4.  Improve documentation

# Licensing

Copyright 2018 Esri

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

A copy of the license is available in the repository's [LICENSE](./LICENSE) file
