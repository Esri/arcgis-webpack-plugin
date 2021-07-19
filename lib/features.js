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

module.exports = {
  "3d": {
    test: input => {
      let jsapiPkg = null;
      let jsapiCorePkg = null;
      let jsapi = null;
    
      // Check if @arcgis/core is installed
      try {
        jsapiCorePkg = require("@arcgis/core/package.json");
        jsapi = "@arcgis/core";
      } catch (err) {
        jsapiCorePkg = null;
      }
    
      // Check if arcgis-js-api is installed
      try {
        jsapiPkg = require("arcgis-js-api/package.json");
        jsapi = "arcgis-js-api";
      } catch (err) {
        jsapiPkg = null;
      }
      // these modules are used in 2d and 3d
      const exceptions = [
        `${jsapi}/views/3d/support/mathUtils`
      ];
      // 3d specific modules
      return [
        // geometry
        `${jsapi}/geometry/Mesh`,
        `${jsapi}/geometry/support/meshUtils`,
        `${jsapi}/geometry/support/Mesh`,
        // views
        `${jsapi}/views/3d`,
        // layers
        `${jsapi}/layers/ElevationLayer`,
        `${jsapi}/layers/IntegratedMeshLayer`,
        `${jsapi}/layers/SceneLayer`,
        `${jsapi}/layers/PointCloudLayer`,
        `${jsapi}/layers/BuildingSceneLayer`,
        `${jsapi}/layers/pointCloudFilters`,
        `${jsapi}/layers/mixins/SceneService`,
        // support
        `${jsapi}/layers/support/LercDecoder`,
        `${jsapi}/rest/support/meshFeatureSet`,
        // renderers
        // catches all PointCloud renderers
        `${jsapi}/renderers/PointCloud`,
        `${jsapi}/renderers/support/pointCloud`,
        // symbols
        // `${jsapi}/symbols/edges`,
        // `${jsapi}/symbols/callouts`,
        // `${jsapi}/symbols/support/Symbol3D`,
        // `${jsapi}/symbols/ExtrudeSymbol3DLayer`,
        // `${jsapi}/symbols/IconSymbol3D`,
        // `${jsapi}/symbols/LabelSymbol3D`,
        // `${jsapi}/symbols/LineSymbol3D`,
        // `${jsapi}/symbols/MeshSymbol3D`,
        // `${jsapi}/symbols/ObjectSymbol3D`,
        // `${jsapi}/symbols/PathSymbol3D`,
        // `${jsapi}/symbols/PointSymbol3D`,
        // `${jsapi}/symbols/PolygonSymbol3D`,
        // `${jsapi}/symbols/Symbol3D`,
        // `${jsapi}/symbols/TextSymbol3D`,
        // `${jsapi}/symbols/WaterSymbol3DLayer`,
        // `${jsapi}/symbols/FillSymbol3DLayer`,
        // webscene
        `${jsapi}/webscene`,
        // widgets
        `${jsapi}/widgets/AreaMeasurement3D`,
        `${jsapi}/widgets/DirectLineMeasurement3D`
      ].some(x => {
        if (exceptions.some(a => input.includes(a))) {
          return false;
        }
        return input.includes(x);
      });
    },
    use: "null-loader"
  }
};
