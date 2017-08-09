var path = require("path");
var webpack = require("webpack");


module.exports = {
  entry:  './src/index.js',
  output: {
    path: __dirname,
    publicPath: "/dist/",
    filename: "bundle.js"
  }
};
