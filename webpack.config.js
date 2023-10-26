const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/main.js',
  //entry: './src/script.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  devServer: {
    static: ['./dist', './src'],
    hot: true,
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Source file
      filename: 'index.html' // Destination file in the 'dist/' directory
    })
  ]
 
  
};
