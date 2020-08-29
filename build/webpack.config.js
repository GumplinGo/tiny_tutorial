const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MinniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',//模板文件地址
      filename: 'index.html',//指定打包后的文件名字
    }),
    new MinniCssExtractPlugin({
      //指定输出的文件名
      filename: 'main.css'
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MinniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 50 * 1024,
              loader: 'file-loader',
              esModule: false,
              outputPath: 'public/imgs',
              name: '[name].[ext]'
            },
          },
        ],
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
                '@babel/preset-env'
            ],
            plugins:[
              ["@babel/plugin-proposal-class-properties", { "loose" : true }]
            ]
          }
        }
      },
    ]
  }
};