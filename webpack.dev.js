const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common,{
    mode: 'development', // for development, disable when production
    devtool: 'inline-source-map', // allows to track error
    devServer: { // for webpack dev server
        static: './dist',
        watchFiles: ["src/*.html"], // allows html changes to cause server to update
        hot: true,
      },
   
    
    
});