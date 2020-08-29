### 啰嗦前言
本教程将完成一个页面：查看今年时间进度，具体效果可以[点击这里](http://almostdoit.club/)。页面很简单。写成一篇小教程，一是学习总结，输出，以教为学；二是希望能帮助新人学习。如有不足或疏漏，请指出，我会及时更改，避免误人。

### 脉络提纲
本教程将从最简单的新建一个html页面开始，用最原始的html、css、js来实现页面，接着在页面实现的基础上，改用es7的class实现相同的效果，而后，开始借助node环境、npm包管理，用webpack进行前端工程化，让最终出来的代码：js转为ES5，css代码添加厂商前缀
- 1.单页面html实现今年时间进度展示
- 2.页面文件拆分(js,css分离)以及采用ES6以上新语法
- 3.webpack前端工程化

### 前置知识
本教程面向新手，但还是需要有一点前置知识：js、css懂一点，git仓库管理和npm包管理懂一点，即使部分不懂，也没关系，通过教程也算是了解一点。这里需要git知识，是因为我将教程的每个阶段都弄成一个分支，方便读者抠细节

### 食用建议
教程代码已经推到[远程仓库](https://github.com/guojianglin/tiny_tutorial), 每一大节都切出一个分支，每一个小节也是对应的一个commit, 在阅读教程过程时，可以切换到对应的分支进行搭配食用, 如有需要，还可以借助工具，查看前后两个commit的变化

盲猜读者会用到的git命令
```
git clone https://github.com/guojianglin/tiny_tutorial.git

git pull -a
git branch

git checkout 1.单页面html实现今年时间进度展示
git checkout 2.页面文件拆分(js,css分离)以及采用ES6以上新语法
git checkout 3.webpack前端工程化

git log --oneline
```

### 1. 单文件html页面实现今年时间进度展示 
#### 1.1 项目创建
新建文件夹，命名为`tiny_tutorial`, 用`vscode`打开, 在`tiny_tutorial`目录新建一个文件`index.html`, 在`index.html`输入`!`并回车，`vscode`会自动生成一个空html模板，如图：
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8dea94a8cb0445edbfe0bf2bfe77dc61~tplv-k3u1fbpfcp-zoom-1.image)
#### 1.2 html骨架及样式的实现
这一部分主要是静态样式的实现，不做过多解释，对于样式上不懂，可以Google或者Baidu。
这里用了一张背景图
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85427f7670804a8c86842cdbd7968557~tplv-k3u1fbpfcp-zoom-1.image)
html骨架
```html
  <div class="page-container">
    <div class="refresh-btn">刷新一下</div>

    <div class="message-wraper">
        <div class="title">Your <span class="year">2099</span> Progress</div>

        <div  class="message">
            <span class="year">2099</span>已经溜走<span class="days-has-past">1</span>天了, 过了
            <span class="percent"></span>%
        </div>

        <div class="progress-container"></div>
    </div>
  </div>
```
css样式
```css
    body, html {
      margin: 0;
      padding: 0;
      color: rosybrown;
      height: 100%;
    }
    .page-container {
      height: calc(100vh);
      display: flex;
      align-items: center;
      justify-content: center;
      background-image: url('./Chihiro.jpg');
      background-repeat: repeat;
      background-size: contain;
      background-position: center;
      flex-direction: column;
    }
    .page-container .refresh-btn {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      color: #333;
      font-size: 20px;
      font-weight: 900;
      background-color: greenyellow;
      border-radius: 5px;
      margin-bottom: 20px;
      box-shadow: lightblue 2px 4px 10px;
    }
    .refresh-btn:hover {
      cursor: pointer;
      background-color: rgb(91, 201, 238);
      color: white;
    }
    .message-wraper {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      background-color: rgba(0, 0, 0, .5);
      width: 80%;
      margin: 0 30px;
      padding: 20px;
    }
    .message-wraper .title {
      text-align: center;
      font-size: 6vw;
      padding: 10px;
      margin-bottom: 30px;
      font-weight: bolder;
      color: whitesmoke;
    }
    .message-wraper .message {
      margin-bottom: 20px;
    }
    .message .year {
      font-weight: bold;
    }
    .message .days-has-past, .message .percent {
      font-weight: bold;
      color: greenyellow;
    }
    .message .days-has-past {
      opacity: 1;
      font-size: 80px;
    }
    .message .percent {
      opacity: 1;
      font-size: 21px;
    }
    .message-wraper .progress-container {
      border-radius: 15px;
      width: 60%;
      height: 27px;
      background-color: pink;
      display: flex;
      justify-content: stretch;
      overflow-x: hidden;
    }
    .progress-container .finish {
      background-image: linear-gradient(45deg,
      #f3f730 25%,
      #000000 0,
      #000000 50%,
      #f3f730 0,
      #f3f730 75%,
      #000000 0);
      background-size:15px 15px;
      width: 0%;
      transition: all 3s ease-in;
    }
```
到这里的页面效果如图
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/878ac2bd8860437bb3a9af50bce865b9~tplv-k3u1fbpfcp-zoom-1.image)
#### 1.3 页面交互的js实现
最终的效果是：页面加载完成，计算出今年已经过去多少了，用进度条和百分比表示，并且进度条和百分比需要有逐渐增加的“动画效果”，点击刷新按钮能够重新计算并执行动画。这其中涉及的计算可能有些繁琐，但不算难，这里篇幅有限，就不作过多解释，[点击这里体验交互效果](http://almostdoit.club/)
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/501c50b9f1594c078557460f27c2efc0~tplv-k3u1fbpfcp-zoom-1.image)
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/141cfd197f614d4b89a2c05ebdcf1972~tplv-k3u1fbpfcp-zoom-1.image)

### 2.页面文件拆分(js,css分离)以及采用ES6以上新语法
#### 2.1页面文件拆分(js,css分离)
这一步相当简单，只是将css和js部分分别抽离到单独的文件夹，并将其链接的到html页面
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12ab9b04e11343a9aa39f18cbeb9ff96~tplv-k3u1fbpfcp-zoom-1.image)

#### 2.2采用ES6以上新语法特性
这一部分也没那么难，几乎就是把方法和变量搬到class里面，改用箭头函数，并且注意`this`指向。（这一部分操作，主要是为了后面webpack打包，编译成ES5做准备）
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7ebaa2b4b6b4e1fa4c2df1816aae09c~tplv-k3u1fbpfcp-zoom-1.image)

### 3.webpack前端工程化(安装node环境这一部分自己Google或Baidu)
#### 3.1 npm 初始化并添加.gitignore
在项目根目录下面执行：`npm init -y`，这一步将在项目下面添加一个`package.json`文件

添加.gitignore文件，并在其中写入`node_modules
dist`，这是将这写入的两个文件夹忽略不提交到git仓库，虽然现在这两个文件夹还不存在
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c352a539cad4379a291f4428d1b14cd~tplv-k3u1fbpfcp-zoom-1.image)

#### 3.2 webpack前端工程化准备
首先，我们需要安装webpack依赖,其中`webpack`是核心代码包，`webpack-cli`是命令行工具
```
npm install webpack webpack-cli --save-dev
// or
cnpm install webpack webpack-cli --save-dev
```
接着，在项目根目录下面新建一个webpack配置文件`webpack.config.js`,这是webpack最简单的配置，配置了入口文件和输出位置
```js
const path = require('path');

module.exports = {
  mode: 'none',
  entry: './index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```
接着，我们在`package.json`文件中的`scripts`添加一句命令，添加这个命令之后，我们就可以让`npm`来帮忙执行打包命令了,只要执行`npm run build`(相当于`npx webpack --config ./webpack.config.js`）就可以打包了，打包完之后，我们会发现多了dist文件夹，里面有一个`main.js`的文件
```json
 "scripts": {
    "build": "webpack --config ./webpack.config.js"
  },
```
把打包出来`main.js`文件，在html中引入，发现一样能实现交互效果。
这个时候问题就来了：既然只是处理一下js文件，好像也没带来多少好处啊？那是因为我们只是配置了最简单的打包，`module`和`plugins`配置才是让webpack活起来的灵魂
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe97a2e9b2684817b0988adf2583c967~tplv-k3u1fbpfcp-zoom-1.image)

**以前我们的js文件，里面引入的文件，都只是js文件，如果引入css文件或者图片，那么执行的时候肯定会报错，而我们有了`webpack`之后，就可以直接在js里面引入其他类型的文件，然后通过配置loader来解析不同的文件，最终打包出可以执行的文件**

#### 3.3 webpack配置实践
这一小节的配置，我是参考着掘金作者宫小白的文章[webpack——从基础使用到手动实现](https://juejin.im/post/6847009773448069128#heading-20)进行配置的，他已经将一些配置进行了解说，所以下面我实现的步骤不会详细讲解，如果疑问，大家可以跳过去查询对应的文章部分; 当然也可以参考这篇掘金文章-[「一劳永逸」由浅入深配置webpack4](https://juejin.im/post/6859888538004783118)

- 需求：我希望可以打包的时候，同时从原本的index.html生成一个html文件，自己引入打包出来其他文件，比如js,css那些。（现在我得自己手动引入打包出来的东西才能看效果）

```js
// 先安装依赖
npm i html-webpack-plugin -D
// or
cnpm i html-webpack-plugin -D
```
在`webpack.config.js`里面进行配置
```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
...

module.exports = {  
  ...
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',//模板文件地址
      filename: 'index.html',//指定打包后的文件名字
    }),
  ],
};
```
然后执行一次打包`npm run build`，如图，我们会发现dist目录下面多了`index.html`,那么原本的`index.html`里面多余引入了`index.js`了，应该去掉，然后再打包一次
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d3c1366644542cd985036f2b52ce580~tplv-k3u1fbpfcp-zoom-1.image)

此时，我们在浏览器打开生成出来的index.html，会发现，没有样式，没有背景图，只剩html和交互效果了，如图
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d686d1d4ee9b487eb4d8a4ebe5417aea~tplv-k3u1fbpfcp-zoom-1.image)

因此，接下来我们的目标很明确，打包出来需要有样式

- 需求：将样式打包进来

```
// 先安装依赖
npm i css-loader style-loader -D
// or
cnpm i css-loader style-loader -D
```
在`webpack.config.js`里面进行配置
```js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
    ]
  }
};
```
在`index.js`文件首行添加(奇特吧！本来css是html引入的，现在改为js引入)：
```js
import './style.css'
```
然后把原本的`index.html`的`<link rel="stylesheet" href="./style.css">`引入css去掉；另外，我们还没配置打包图片，所以这时候打包肯定会出错，我们先把`style.css`里面引用背景图片注释掉
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b86a1a9c4d2f4ea5b141ffd841f294da~tplv-k3u1fbpfcp-zoom-1.image)

执行`npm run build`打包，然后再次用浏览器打开看看，效果符合预期：除了我们注释掉的背景图片，其他样式都正常出现了，所以我们对于样式的配置没有问题
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d946bb0e389844e1900f0ebb3ba24217~tplv-k3u1fbpfcp-zoom-1.image)

这个时候，我不想要css样式最终弄在html里面，而是单独出来一个文件，避免样式太多，导致html里面插入太多的样式

```
// 先安装依赖
npm i mini-css-extract-plugin -D
// or
cnpm i mini-css-extract-plugin -D
```
在`webpack.config.js`里面进行配置
```js
const MinniCssExtractPlugin = require('mini-css-extract-plugin')
...
module.exports = {
  ...
  plugins: [
    ...
    new MinniCssExtractPlugin({
      //指定输出的文件名
      filename: 'main.css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ MinniCssExtractPlugin.loader,'css-loader'] // 将style-loader替换了
      },
    ]
  }
};
```
再执行一次`npm run build`，发现dist目录下面现在多了一个`main.css`,在同目录下面的`index.html`也引入了该css文件

- 需求：出于浏览器兼容考虑，打包出来的css样式添加厂商前缀
```
// 先安装依赖
npm i postcss-loader autoprefixer -D
// or
cnpm i postcss-loader autoprefixer -D
```
在`webpack.config.js`里面进行配置
```js
...
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ MinniCssExtractPlugin.loader,'css-loader', 'postcss-loader'] // 添加一个post-loader
      },
    ]
  }
};
```
在根目录下面添加一个`postcss.config.js`文件
```js
module.exports = {
    plugins: [
        require("autoprefixer")({
            overrideBrowserslist: ["last 2 versions", ">1%"]
        })
    ]
};
```
再执行一次`npm run build`，查看`main.css`，可以看到是已经添加了厂商前缀了，关于css的打包也就先到这里了
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea3cbea3a21f4f55b8fdb7aa9ad1b512~tplv-k3u1fbpfcp-zoom-1.image)

- 需求：背景图片也要打包进去

```
// 先安装依赖
npm i file-loader url-loader -D
// or
cnpm i file-loader url-loader -D
```

在`webpack.config.js`里面进行配置
```js
...
module.exports = {
  ...
  module: {
    rules: [
      ...
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
    ]
  }
};
```
将我们前面注释掉的背景样式解开，再执行一次`npm run build`，dist目录下面的已经多了dist/public/imgs/Chihiro.jpg, 然后在浏览器打开打包出来的`index.html`,可以看到，背景图片已经出来了

- 需求：处理好了html,css，图片，接下来是js了，转化为ES5

目前打包出来的js代码，只是原样地弄过来，并没有处理
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f106b421a1d4694895155fa93ee82ef~tplv-k3u1fbpfcp-zoom-1.image)

```
// 先安装依赖
npm i babel-loader @babel/core @babel/preset-env @babel/plugin-proposal-class-properties -D
// or
cnpm i babel-loader @babel/core @babel/preset-env @babel/plugin-proposal-class-properties -D
```
在`webpack.config.js`里面进行配置
```js
...
module.exports = {
  ...
  module: {
    rules: [
      ...
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
```
配置之后，再次执行`npm run build`, 查看打包出来的`main.js`,可以看到js代码已经被转换了
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8a3a05c83344a539869a709410aba48~tplv-k3u1fbpfcp-zoom-1.image)

配置到这里，打包的部分基本没有需求了，但是前端工程化，可不能只是打包，还有提高开发效果所以有了如下需求
- 需求: 我们需要能够在本地起一个服务器，让我们开发时，能够自动打包更新代码

```
// 先安装依赖
npm i webpack-dev-server -D
// or
cnpm i webpack-dev-server -D
```
在`webpack.config.js`里面进行配置
```js
...
module.exports = {
  ...
  devServer: {
    port: 3000,
    contentBase: './dist',  // 起服务的地址(即定位到我们的输出文件地址)
    open: true,              // 自动打开浏览器
    compress: true,         // gzip压缩
    hot: true,   // 开启热更新
  },
  ...
  plugins: [
    ...
    new webpack.HotModuleReplacementPlugin(),
  ],
};
```
在`package.json`的`scripts`字段里面在添加一句命令
```json
 "scripts": {
    ...
    "dev": "webpack-dev-server --config ./webpack.config.js"
  },

```

这次执行`npm run dev`,项目就会自动跑起来，运行在`http://localhost:3000/`,并且能够在项目文件更改之后进行更新了

#### 3.4 项目结构优化
上一节的演示，已经基本说明了配置的过程，以后有需求在上面进行拓展配置就行。

现在我们的项目文件，全部都在根目录下面，没有区分，这对于以后的拓展不利，不方便管理；其次就是，我们webpack的配置，也没有能够区分development和production模式，这里也可以进行文件的拆分

- 首先，我们进行项目文件的结构调整

新建src文件夹和build文件夹，将文件调整如下图
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a836f7b4dfb469e9a7c643784c1edac~tplv-k3u1fbpfcp-zoom-1.image)

在这之后，需要把文件里面的引用，重新进行调整
```js
//index.js
- import './style.css'
+ import './style/style.css'
```
```css
/*style.css*/
- background-image: url('./Chihiro.jpg');
+ background-image: url('../assets/img/Chihiro.jpg');
```

`webpack.config.js`的改动如图
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dacbf6a2f2c645deb2b3c7c7dc76e5be~tplv-k3u1fbpfcp-zoom-1.image)

- 然后webpack配置文件环境划分的调整
```js
// 先安装依赖
npm i webpack-merge -D
// or 
cnpm i webpack-merge -D
```
在`build`目录下面添加两个文件，分别是`webpack.dev.js`和`webpack.prod.js`
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/553379f4cd0c46a498388422573508ab~tplv-k3u1fbpfcp-zoom-1.image)
```js
// webpack.dev.js
const {merge} = require('webpack-merge')
const base = require('./webpack.config.js')
const path = require('path')

module.exports = merge(base, {
  mode: 'development',
  devtool: 'cheap-module-source-map', //这里是配置报错时，追溯源码的代码位置
  devServer: {
    port: 3000,
    contentBase:  path.join(__dirname, '../dist'), // 起服务的地址(即定位到我们的输出文件地址)
    open: true,              // 自动打开浏览器
    compress: true,         // gzip压缩
    progress: true
  },
})
```
```js
// webpack.prod.js
const {merge} = require('webpack-merge')
const base = require('./webpack.config.js')

module.exports = merge(base, {
  mode: 'production'
})
```
而原本的的`webpack.config.js`就删除`devServer`字段的配置，只放公共的配置

package.json里面的命令的配置文件路径也就需要更改了
```json
  "scripts": {
    "build": "webpack --config ./build/webpack.prod.js",
    "dev": "webpack-dev-server --config ./build/webpack.dev.js"
  },
```

至此，项目结构的调整也完成了。

### 教程总结
优点：

1. **纯粹**：项目没有采用框架，用原生的js代码，可以排除框架影响，单纯地学习webpack前端工程化的配置流程

2. **渐进**：项目从最原始的html,一步步地展示了页面的实现；webpack配置也是逐个提需求，逐个配置，不会一下子让新手读者眼花，让读者能够抓住主流程，更好地理解

不足：

1. **简陋**：页面的实现，用的flex弹性布局，在一些旧的浏览器可能出现问题；webpack配置远远不止我教程写的那些，还有很多，不过配置还是上面那样，有需求，就查，然后配置（代码分片、代码压缩、css预编译等等）

---



点个赞或者给个star呗，码字挺累的，鼓励一下🥰🥰🥰









