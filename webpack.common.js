const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
  entry: {
    index: './src/index.js',
    },
    
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // cleans dist after build
  },
    plugins: [
      new HtmlWebpackPlugin({
          title: 'Production',
          template: './src/index.html', // html template
      }),
      ],
    optimization: { 
      usedExports: true, // tree shaking
      moduleIds: 'deterministic', // to prevent vendor hash names to be changed
      runtimeChunk: 'single', // for web dev server, also for more than 1 entry point
      splitChunks: { // for code splitting and cache
          cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
              },
            },
        },
    },
    // Assets
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
      ],
    },
 };