var path = require('path');
var webpack = require("webpack");


module.exports = function(method) {
  var config = {
    entry: {
      index: __dirname + '/src/index.js'
    },
    resolve: {
      root: __dirname, //当前文件目录的绝对路径
      extensions: ['', '.js', '.css', '.json', '.scss'],
      alias: {
        'card': 'src/card',
        'common': 'src/common',
        'model': 'src/model',
        'helper': 'src/helper',
        'css': 'src/css',
        'page': 'src/page',
        'polyfill': 'src/polyfill'
      }
    },
    module: {
      loaders: [{
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }, {
        test: /\.js|jsx$/, //是一个正则，代表js或者jsx后缀的文件要使用下面的loader
        loader: "babel",
        query: {
          presets: ['es2015']
        }
      }]
    }
  };
  if (method == 'build') {
    config.output = {
      publicPath: "/public/cdn/",
      filename: "[name].min.js",
      chunkFilename: "discovery.chunk_[id].min.js"
    };
    config.plugins = [
      new webpack.optimize.OccurrenceOrderPlugin(true),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.optimize.MinChunkSizePlugin({
        minChunkSize: 2E4
      })
    ];
  } else {
    config.output = {
      publicPath: "/dist/",
      filename: "[name].js",
      chunkFilename: "discovery.chunk_[id].js"
    };
    config.devtool = "sourcemap";
    config.debug = true;
  }
  return config;
};
