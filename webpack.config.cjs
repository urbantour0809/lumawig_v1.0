const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.wasm$/,
        type: "webassembly/async",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".mjs"],
    fallback: {
      util: require.resolve("util"),
      querystring: require.resolve("querystring"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer"),
      path: require.resolve("path-browserify"),
      assert: require.resolve("assert"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify"),
      zlib: require.resolve("browserify-zlib"),
    },
  },
  externals: {
    "webextension-polyfill": "browser", // 변경된 부분
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/popup.html",
      filename: "src/popup.html",
      inject: "body",
    }),
    new webpack.ProvidePlugin({
      TextEncoder: ["util", "TextEncoder"],
      TextDecoder: ["util", "TextDecoder"],
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/test_rsa_pubkey\.pem$/,
      contextRegExp: /public-encrypt/,
    }),
  ],
};
