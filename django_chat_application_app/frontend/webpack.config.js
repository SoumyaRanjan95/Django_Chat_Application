const path = require("path");
const webpack = require("webpack");
require('dotenv').config({ path: './.env' }); 

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/js"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },

    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ],
};