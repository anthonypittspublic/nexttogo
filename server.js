var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');

new webpackDevServer(webpack(config), {
    publicPath: config.output.publichPath,
    hot: true,
    historyApiFallback: true
    }).listen(8080, 'localhost', function (err, result) {
        if(err)
            console.log(err);
    });