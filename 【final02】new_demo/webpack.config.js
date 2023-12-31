const resolve = require('path').resolve;
const join = require('path').join;
const webpack = require('webpack');

const CONFIG = {
  // bundle app.js and everything it imports, recursively.
  entry: {
    app: resolve('./src/main.js')
  },
  output: {
    path: resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        loader: 'babel-loader',
        include: join(__dirname, 'src'),
        exclude: [/node_modules/]
      }
    ]
  },

  node: {
    fs: 'empty'
  },

  // Optional: Enables reading mapbox token from environment variable
  plugins: [
    new webpack.EnvironmentPlugin({
      MapboxAccessToken:'pk.eyJ1IjoiYmFvMTgyIiwiYSI6ImNsZXBlcXdpczBicGEzcW83aWwzNjBpd2kifQ.6ziaeLPI7eab1oygQc7oRg'
    })]

};

// This line enables bundling against src in this repo rather than installed deck.gl module
module.exports = env => {
  return env ? require('../webpack.config.local')(CONFIG, __dirname)(env) : CONFIG;
};
