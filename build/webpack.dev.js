const {merge} = require('webpack-merge')
const base = require('./webpack.config.js')
const path = require('path')

module.exports = merge(base, {
  mode: 'development',
  devtool: 'cheap-module-source-map', //这里是配置报错时，追溯源码的代码位置
  devServer: {
    port: 3000,
    contentBase: path.resolve(__dirname, '../dist'),  // 起服务的地址(即定位到我们的输出文件地址)
    open: true,              // 自动打开浏览器
    compress: true,         // gzip压缩
    hot: true,   // 开启热更新
  },
})