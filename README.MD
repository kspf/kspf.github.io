### 预览地址
> https://kspf-github-io-95l2oeysm.vercel.app/

### token
> b6a2e7057acdbf8478a35340adbda120a04bd2d0


# 笔记

## 搭建自己的SSR

### 渲染一个Vue实例

1. 创建项目文件 

```
mkdir 文件夹名
```

2. 初始化`package.json`文件 

```
npm init -yes
```

3. 安装 `vue`、`vue-server-renderer`

```
npm install vue  vue-server-renderer --save
```

4. 创建 `server.js`

5. 引入 `vue`  创建 `vue` 实例

```javascript
const Vue = require('vue');
const app  = new Vue({
    template: `
        <div id="app">
            <h1>{{ message }}</h1>
        </div>
    `,
    data:{
        message: '小马哥'
    } 
})
```

6. 器渲染vue实例为字符串   需要 `vue-server-renderer`包

```javascript
//创建一个渲染器
const renderer = require('vue-server-renderer').createRenderer();
//两个参数 第一个为vue实例  第二个为回调函数 回调函数第一个参数为错误对象 第二个为渲染后的 字符串
renderer.renderToString(app ,(err,html) => {
    if(err) {

    };
    console.log(html)
})

```

### 结合到Web服务中

> 使用express为例

1. 安装 `express` 

```javascript
npm install express --save
```

2. 引入 并 创建 `express` 服务实例

```javascript
const express = require('express');
 
// 创建一个服务
const server = express();
```

3. 设置路由并返回解析后的字符串

```javascript
server.get('/', (req,res) => {
    const app  = new Vue({
        template: `
            <div id="app">
                <h1>{{ message }}</h1>
            </div>
        `,
        data:{
            message: '大马哥'
        } 
    })
    //两个参数 第一个为vue实例  第二个为回调函数 回调函数第一个参数为错误对象 第二个为渲染后的 字符串
    renderer.renderToString(app , (err, html) => {
        if(err) {
            return res.status(500).end('服务器错误')
        };
        //如果出现乱码需要设置header编码为utf-8解析
        res.setHeader('Content-type', 'text/html; charset=utf8')
        // 第二种meta标签设置charset
        let sendData = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            ${html}
        </body>
        </html>`
        //
        res.send(sendData)
    })
})



//监听端口
server.listen(800 , () => {
    console.log("服务启动 端口为 800")
});
```

- 如果出现乱码解决方法(建议两种都设置)

  - 设置响应请求头

```javascript
res.setHeader('Content-type', 'text/html; charset=utf8')
```

 - 返回meta标签设置charset UTF-8

```javascript
 // 第二种meta标签设置charset
        let sendData = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            ${html}
        </body>
        </html>`
        //
        res.send(sendData)
```



###  使用HTML模板

> 通过模板的方式来配置公共的模板内容

1. 创建`index.template.html` 文件 并写入一下内容
   - 注意`<!--vue-ssr-outlet-->` 是render的占位符 必须保持一致不能有空格，不然会报错**在模板中找不到内容占位符**，解析后的字符串会替换到`<!--vue-ssr-outlet-->`标记的位置

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <!--vue-ssr-outlet-->
</body>
</html>
```

2. 在渲染器中使用模板，请求直接返回生成后的内容

```javascript
const fs = require('fs')
//创建一个渲染器
const renderer = require('vue-server-renderer').createRenderer({
    // 使用模板
    template: fs.readFileSync('./index.template.html','utf-8')
});

server.get('/', (req,res) => {
    const app  = new Vue({
        template: `
            <div id="app">
                <h1>{{ message }}</h1>
            </div>
        `,
        data:{
            message: '大马哥'
        } 
    })
    //两个参数 第一个为vue实例  第二个为回调函数 回调函数第一个参数为错误对象 第二个为渲染后的 字符串
    renderer.renderToString(app , (err, html) => {
        if(err) {
            return res.status(500).end('服务器错误')
        };
        res.send(html)
    })
})
```



###  在模板中使用外部数据

> 例如需要模板中使用外部传入的title

1. 在渲染器的`renderToString`设置第二个可选参数

```js
renderer.renderToString(app ,{
        title: '这是title'
    } ,(err, html) => {
        if(err) {
            return res.status(500).end('服务器错误')
        };
        res.send(html)
    })
```

2. 在模板中使用`{{ 数据 }}`来设置

```html
<title>{{ title }}</title>
```



> 输出标签（使用`{{{ 数据 }}`}）

1. 在渲染器的`renderToString`设置第二个可选参数

```javascript
 renderer.renderToString(app ,{
        title: '这是title',
        meta: '<meta name="description" content="biubiubiu">'
    } ,(err, html) => {
     .......
 })
```

2. 在模板中使用`{{{ 数据 }}}`来设置

```vue
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    {{{ meta }}}
</head>
<body>
    <!--vue-ssr-outlet-->
</body>
</html>
```



### 构建配置-基本思路

> 服务端渲染只是把vue实例处理成纯静态的html字符串发送给客户端，需要客户端动态交互的内容是不会被处理的 比如@click 事件 v-model="message" 等

- 为什么没有客户端动态交互功能
  - 因为没有客户端脚本

#### 构建步骤流程图

![image-20210106213105845](C:\Users\m1762\AppData\Roaming\Typora\typora-user-images\image-20210106213105845.png)

- 源代码
  - 服务端入口
    - 处理服务端渲染
  - 客户端入口
    - 处理客户端渲染
    - 接管服务端渲染内容激活成一个动态页面
- webpack
  - 对服务端打包为server bundle
    - 做服务端渲染
  - 对客户端打包为client bundle
    - 接管服务端渲染好的静态页面，激活为动态的客户端页面



###  构建配置-源码结构

> 目录结构：

```bash
src
├── components
│   ├── Foo.vue
│   └── Baz.vue
│   └── .......
├── App.vue
├── app.js # 通用 entry(universal entry)
├── entry-client.js # 仅运行于浏览器
└── entry-server.js # 仅运行于服务器
```


- `App.vue`
- id="app"为必须 其他的vue实例会挂载到这里

```vue
<template>
  <div id="app">
    <h1>{{ message }}</h1>
    <input v-model="message" />
    <button @click="onClick"></button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "大马哥",
    };
  },
  methods: {
    onClick() {
      console.log("点击");
    },
  },
};
</script>

<style>
</style>
```


-  `app.js `

> `app.js` 是我们应用程序的「通用 entry」。在纯客户端应用程序中，我们将在此文件中创建根 Vue 实例，并直接挂载到 DOM。但是，对于服务器端渲染(SSR)，责任转移到纯客户端 entry 文件。`app.js` 简单地使用 export 导出一个 `createApp` 函数：

```js
/** 
 * 通用启动入口
*/
import Vue from 'vue'
import App from './App.vue'

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp () {
  const app = new Vue({
    // 根实例简单的渲染应用程序组件。
    render: h => h(App)
  })
  //为什么是对象 因为未来还是有 路由等
  return { app }
}
```


- ### `entry-client.js`

```js
import { createApp } from './app'

// 客户端特定引导逻辑……

const { app } = createApp()

// 这里假定 App.vue 模板中根元素具有 `id="app"`
app.$mount('#app')
```


- ### `entry-server.js`

> 服务器 entry 使用 default export 导出函数，并在每次渲染中重复调用此函数。此时，除了创建和返回应用程序实例之外，它不会做太多事情 - 但是稍后我们将在此执行服务器端路由匹配 (server-side route matching) 和数据预取逻辑 (data pre-fetching logic)。

```javascript
import { createApp } from './app'

export default context => {
    const { app } = createApp()
    //服务端路由处理、数据预取。。。
    return app
}
```



### 构建配置-安装依赖



#### （1）安装生产依赖

```js
npm i vue vue-server-renderer express cross-env
```

| 包                  | 说明                                |
| ------------------- | ----------------------------------- |
| vue                 | Vue.js 核心库                       |
| vue-server-renderer | Vue 服务端渲染工具                  |
| express             | 基于 Node 的 Web 服务框架           |
| cross-env           | 通过 npm scripts 设置跨平台环境变量 |



#### （2）安装开发依赖

```
npm i -D webpack webpack-cli webpack-merge webpack-node-externals @babel/core @babel/plugin-transform-runtime @babel/preset-env babel-loader css-loader url-loader file-loader rimraf vue-loader vue-template-compiler friendly-errors-webpack-plugin
```

| 包                                                           | 说明                                   |
| ------------------------------------------------------------ | -------------------------------------- |
| webpack                                                      | webpack 核心包                         |
| webpack-cli                                                  | webpack 的命令行工具                   |
| webpack-merge                                                | webpack 配置信息合并工具               |
| webpack-node-externals                                       | 排除 webpack 中的 Node 模块            |
| rimraf                                                       | 基于 Node 封装的一个跨平台 rm -rf 工具 |
| friendly-errors-webpack-plugin                               | 友好的 webpack 错误提示                |
| @babel/core  <br/>@babel/plugin-transform-runtime <br/>@babel/preset-env<br/>babel-loader | Babel 相关工具                         |
| vue-loader <br/>vue-template-compiler                        | 处理 .vue 资源                         |
| file-loader                                                  | 处理字体资源                           |
| css-loader                                                   | 处理 CSS 资源                          |
| url-loader                                                   | 处理图片资源                           |



### **配置文件及打包命令**

#### （1）初始化webpack打包配置文件

```sh
build 
├── webpack.base.config.js # 公共配置 
├── webpack.client.config.js # 客户端打包配置文件 
└── webpack.server.config.js # 服务端打包配置文件
```



##### webpack.base.config.js  公共配置

```javascript
/**
 * 公共配置
 */
// 处理.vue资源的插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// 处理路径
const path = require('path')
//提供webpack打包的时候友好的错误日志输出
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
//拼接传入的文件路径返回绝对路径
const resolve = file => path.resolve(__dirname, file)
//判断是否是生产模式 以生产/开发构建
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  //production 会压缩优化 ， development不会优化 打包速度快
  mode: isProd ? 'production' : 'development',
  output: {
    //把打包结果输出到项目的dist目录
    path: resolve('../dist/'),
    //用来设定文件的加载和请求路径的前缀为dist开头，防止打包出来的结果文件和本身路由结果冲突
    publicPath: '/dist/',
    // 输出的文件名和hash拼凑成文件名 防止缓存 请求新的资源
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    //配置别名
    alias: {
      // 路径别名，@ 指向 src
      '@': resolve('../src/')
    },
    // 加载资源的时候 可以省略的扩展名
    // 当省略扩展名的时候，按照从前往后的顺序依次解析
    extensions: ['.js', '.vue', '.json']
  },
  //配置项目打包的sourceMap 正式和开发不同
  devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',
  module: {
    rules: [
      // 处理图片资源
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 
              limit: 8192,
            },
          },
        ],
      },

      // 处理字体资源
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
      },

      // 处理 .vue 资源
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },

      // 处理 CSS 资源
      // 它会应用到普通的 `.css` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      
      // CSS 预处理器，参考：https://vue-loader.vuejs.org/zh/guide/pre-processors.html
      // 例如处理 Less 资源
      // {
      //   test: /\.less$/,
      //   use: [
      //     'vue-style-loader',
      //     'css-loader',
      //     'less-loader'
      //   ]
      // },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new FriendlyErrorsWebpackPlugin()
  ]
}
```



##### webpack.client.config.js 客户端打包配置

```javascript
/**
 * 客户端打包配置
 */
// 用来合并webpack配置信息
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js') 
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = merge(baseConfig, {
  entry: {
    /**
     *  webpack打包入口文件
     *  入口文件的相对地址是相对于执行命令的命令行路径
    */
    app: './src/entry-client.js'
  },

  module: {
    rules: [
      // ES6 转 ES5
      // 只需要在客户端 因为 nodejs  本身支持es6
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            cacheDirectory: true,
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
    ]
  },

  // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
  // 以便可以在之后正确注入异步 chunk。
  optimization: {
    splitChunks: {
      name: "manifest",
      minChunks: Infinity
    }
  },

  plugins: [
    // 此插件在输出目录中生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin()
  ]
})

```



##### webpack.server.config.js 服务端打包配置

```javascript
/**
 * 服务端打包配置
 */
// 合并webpack配置信息
const { merge } = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./webpack.base.config.js')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = merge(baseConfig, {
  // 将 entry 指向应用程序的 server entry 文件
  entry: './src/entry-server.js',

  // 这允许 webpack 以 Node 适用方式处理模块加载
  // 并且还会在编译 Vue 组件时，
  // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
  target: 'node',

  output: {
    filename: 'server-bundle.js',
    // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
    libraryTarget: 'commonjs2'
  },

  // 不打包 node_modules 第三方包，而是保留 require 方式直接加载
  externals: [nodeExternals({
    // 白名单中的资源依然正常打包
    allowlist: [/\.css$/]
  })],

  plugins: [
    // 这是将服务器的整个输出构建为单个 JSON 文件的插件。
    // 默认文件名为 `vue-ssr-server-bundle.json`
    new VueSSRServerPlugin()
  ]
})
```



####  (2) 构建配置-配置构建命令

- 客户端
  - 利用`cross-env` 设置`NODE_ENV`的值为`production` 
  - webpack打包 指定客户端打包配置文件

```json
{
     "scripts": {
          "build:client": "cross-env NODE_ENV=production webpack --config build/webpack.client.config.js"
     }
}
```

- 服务端
  - 利用`cross-env` 设置`NODE_ENV`的值为`production` 
  - webpack打包 指定服务端打包配置文件

```json
{
    "scripts": {
    "build:server": "cross-env NODE_ENV=production webpack --config build/webpack.server.config.js"
}
```

- build  （客户端和服务端整合）
  - 先删除dist目录
  - 再执行客户端打包
  - 再执行服务端打包

```json
{
    "scripts": {
    "build": "rimraf dist && npm run build:client && npm run build:serve"
  },
}
```

- 注意：

  - 打包服务端报错修改webpack版本

```json
{
"webpack": "^4.43.0",
"webpack-cli": "^3.3.12"
}
```

  

###  构建配置-启动应用

#### 传入 BundleRenderer

`vue-server-renderer` 提供一个名为 `createBundleRenderer` 的 API，用于处理此问题，通过使用 webpack 的自定义插件，server bundle 将生成为可传递到 bundle renderer 的特殊 JSON 文件。所创建的 bundle renderer，用法和普通 renderer 相同，但是 bundle renderer 提供以下优点：

- 内置的 source map 支持（在 webpack 配置中使用 `devtool: 'source-map'`）
- 在开发环境甚至部署过程中热重载（通过读取更新后的 bundle，然后重新创建 renderer 实例）
- 关键 CSS(critical CSS) 注入（在使用 `*.vue` 文件时）：自动内联在渲染过程中用到的组件所需的CSS。更多细节请查看 [CSS](https://ssr.vuejs.org/zh/guide/css.html) 章节。
- 使用 [clientManifest](https://ssr.vuejs.org/zh/api/#clientmanifest) 进行资源注入：自动推断出最佳的预加载(preload)和预取(prefetch)指令，以及初始渲染所需的代码分割 chunk。


1. 把createRenderer 换为 `createBundleRenderer` 这个方法接收的第一个参数 是 `serverBundle`

```javascript
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
//创建一个渲染器
const renderer = require('vue-server-renderer').createBundleRenderer(serverBundle,{
    .......
});

```

2. 把template 提出来， 并在`createBundleRenderer` 传入  `clientManifest`

```javascript
const clientManifest = require('./dist/vue-ssr-client-manifest.json')

const template = fs.readFileSync('./index.template.html','utf-8')
//创建一个渲染器
const renderer = require('vue-server-renderer').createBundleRenderer(serverBundle,{
    // 使用模板
    template,
    clientManifest
});
```

3. 在路由里面去掉vue实例

```javascript
serve.get('/', (req,res) => {
    // vue实例为entry-server.js里面的实例
    renderer.renderToString({
        title: '这是title',
        meta: '<meta name="description" content="biubiubiu">'
    } ,(err, html) => {
        if(err) {
            return res.status(500).end('服务器错误')
        };
        res.send(html)
    })
})
```

4. 设置dist静态目录、因为请求访问不到dist目录

```javascript
server.use("/dist", express.static('./dist'))
```



### 构建配置-解析渲染流程


> #### 文件介绍:
>
> vue-ssr-server-bundle.json （serverBundle - 服务端打包结果）
>
> - entery
>   - 服务端打包之后的入口（服务端打包的时候配置的文件名）
>   - 这个文件就是当前文件files中
>
> - files:
>   - key为entery设置的文件名
>   - value为 `entry-server.js` 打包后的结果
>
> - maps: 
>   - soureMap 信息
>
> 
>
> vue-ssr-client-manifest.json（clientBundle - 客户端打包资源清单，描述了客户端资源构建信息）
>
> - publicPath
>
>   - 访问静态资源的根相对路径，与 webpack 配置中的 publicPath 一致
>
> - all
>
>   - 打包后的所有静态资源文件路径
>
> - initial
>
>   - 页面初始化时需要加载的文件，会在页面加载时配置到 preload 中
>
> - async
>
>   - 页面跳转时需要加载的文件，会在页面加载时配置到 prefetch 中
>
> - modules
>
>   - 项目的各个模块包含的文件的序号，对应 all 中文件的顺序；moduleIdentifier和 
>
>     和all数组中文件的映射关系（modules对象是我们查找文件引用的重要数据）
>
> 






- 两个层面
  -  服务端渲染
     - 如何去输出内容
  -  客户端渲染
     - 如何接管激活



1. 服务端渲染

   1. 匹配路由
   2. 调用`renderer`的`renderToString`方法渲染
      1. `renderToString `把 `vue实例`渲染为`html字符串`发送给客户端
      2. `vue实例`从何而来
         1. `render`在渲染时会加载`serverBundle `里面的入口得到`entry-server.js`里面创建的`vue实例` 把`vue实例`进行渲染把`渲染结果`注入到`template`当中 

2. 客户端渲染

   - 服务器通过生成`render`时传入的`clientManifest`  把js脚本注入到HTML当中

   - 在 `entry-client.js` 中，我们用下面这行挂载(mount)应用程序：

    ```js
    // 这里假定 App.vue template 根元素的 `id="app"`
    app.$mount('#app')
    ```

   - 客户端不会重新渲染html 会"激活"这些静态的 HTML，然后使他们成为动态的（能够响应后续的数据变化）根据节点data-server-rendered="true"来便是是否为服务端渲染的HTML

   ```html
   <div id="app" data-server-rendered="true">
   ```

   - 激活模式

   ```js
   // 强制使用应用程序的激活模式
   app.$mount('#app', true)
   ```



- 注意：

  - 在开发模式下，Vue 将推断客户端生成的虚拟 DOM 树 (virtual DOM tree)，是否与从服务器渲染的 DOM 结构 (DOM structure) 匹配。如果无法匹配，它将退出混合模式，丢弃现有的 DOM 并从头开始渲染。**在生产模式下，此检测会被跳过，以避免性能损耗**

  - 使用「SSR + 客户端混合」时，需要了解的一件事是，浏览器可能会更改的一些特殊的 HTML 结构。例如，当你在 Vue 模板中写入：

    ```html
    <table>
      <tr><td>hi</td></tr>
    </table>
    ```

    浏览器会在 `<table>` 内部自动注入 `<tbody>`，然而，由于 Vue 生成的虚拟 DOM (virtual DOM) 不包含 `<tbody>`，所以会导致无法匹配。为能够正确匹配，请确保在模板中写入有效的 HTML。





### 构建配置开发模式-基本思路

实现项目中的开发模式构建，希望实现

- 写完代码，自动构建
- 自动重启 Web 服务
- 自动刷新页面内容
- .....



#### **基本思路**

关键在于 `render`

- render 是通过打包后的结果 调用了`createBundleRenderer` 创建出来的
- 开发模式下需要根据源代码的改变不断生成 打包后的文件 需要生成后重新 调用`createBundleRenderer` 来创建新的`render` 进行渲染



**设置开发与生产命令**

1. 设置开发与生产命令 
   - start 生产模式 
   - dev 开发模式

```json
{
    "start": "npm cross-env NODE_ENV=production node server.js",
	"dev": "node server.js"
}
```

2. 在server中判断是否为开发模式 执行不同操作
   - 生产模式
     - 直接读取打包后的文件生成渲染器
   - 开发模式
     - 开发模式 => 监视打包构建 => 重新生成renderer渲染器
     - 路由匹配到后等待渲染器生成好之后再进行渲染



#### **提取处理模块**









###  编写通用应用注意事项

- 避免状态污染
- 服务端只有 `beforeCreate` 和 `created`这两个生命周期
- 避免全局副作用的代码比如 `setInterval` 设置 timer。
- 访问平台api不通用问题 比如`window`或 `document`
- 自定义指令问题（大多数指令都是操作dom）
  - 推荐使用组件作为抽象机制，并运行在「虚拟 DOM 层级(Virtual-DOM level)」（例如，使用渲染函数(render function)）。
  - 如果你有一个自定义指令，但是不是很容易替换为组件，则可以在创建服务器 renderer 时，使用 [`directives`](https://ssr.vuejs.org/zh/api/#directives) 选项所提供"服务器端版本(server-side version)"。



## Gridsome基础-介绍

- 一个免费的开源的基于vue.js技术栈的静态网站生成器
- [文档](https://www.gridsome.cn/)


#### 什么是静态网站生成器

- 静态网站生成器是一系列配置、模板以及数据，生成静态html文件及相关资源的工具
- 这个功能也叫**预渲染**
- 生成的网站不需要类似PHP这样的服务器
- 只需要放到支持静态资源的webserver  或者 cdn即可运行

#### 静态网站的好处

- 省钱
  - 不需要专业的服务器，只需要托管静态文件的空间即可
- 快速
  - 不经过后端服务器处理，只传输类容
- 安全
  - 没有后端程序的执行，自然会更安全

####  常见的静态网站生成器

 - jekyll(Ruby)
 - Hexo(Node)
 - Hugo(Golang)
 - Gatsby(Node/React)
 - Gridsome(Node/Vue)
 - 另外，Next.js Nuxt.js 也能生成静态网站，但是他们更多被认为是 SSR（服务端渲染）框架



#### JAMStact （J: javascript  A: api M标记语言  stack：技术栈）

- 这类静态网站生成器还有个名字叫JAMStack
- 本质是一种胖前端，通过调用各种api来实现更多功能
- 其实也是一种前后端模式，只不过离的比较开，甚至后端来自多个不同的厂商

![image-20210113201111495](C:\Users\m1762\AppData\Roaming\Typora\typora-user-images\image-20210113201111495.png)



#### 静态应用的使用场景

- 不适合有大量路由页面的应用
  - 如果您的站点有成百上千条路由页面，则预渲染将非常缓慢，当然你的每次更新只需要做一次，但是可能要花一些时间。大多数人不会最终获得数千条静态路由页面，而只是以防万一
- 不适合有大量动态内容的应用
  - 如果渲染路线中包含特定于用户查看其内容哦或者其他动态源的内容，则因确保你具有可以显示的占位符组件，知道动态内容加载到客户端位置。否则可能有点怪异



#### Gridsome

- 使用Gridsome需要一定的vue基础，如果有基础看过文档只会觉得他比vue更简单一些





### Gridsome基础-创建Gridsome项目

#### (1) 安装gridsome cli 工具

```javascript
npm install --global @gridsome/cli
```

#### (2) 创建gridsome 项目

```javascript
gridsome create 项目名
```



#### 创建项目注意

> 依赖了**sharp** 但**sharp**很难安装成功

- **sharp** 是 用来处理图片 例如：压缩图片大小 转换图片格式
- 包含了c++文件 安装的时候需要编译 c++文件，需要**c++ 编译环境**
  - 依赖**libvips** 包很大 国内很难下载成功

> 解决方案

- [文档地址 ](https://sharp.pixelplumbing.com/install#chinese-mirror) 设置 npm 源

```javascript
 npm config set sharp_binary_host "https://npm.taobao.org/mirrors/sharp"
 npm config set sharp_libvips_binary_host "https://npm.taobao.org/mirrors/sharp-libvips"
```

- **c++环境**
  - 安装 `node-gyp` [文档地址](https://github.com/nodejs/node-gyp)
    - `npm install -g node-gyp`
    - 编译node中c++模块
  - 各种系统 需要环境不一样
  - 各种系统都需要**python**
  - window环境下：
    - Microsoft Store 里面安装 `python`
    - `npm install --global windows-build-tools` 安装需要管理员身份运行命令窗口

#### 启动项目

> 启动命令

```javascript
"build": "gridsome build"
"develop": "gridsome develop"
"explore": "gridsome explore"
```

- build
  - 编译构建预渲染页面

- develop 
  - 本地
- explore
  - 探索数据



>  输出了多个地址

  - Local:      本地访问地址
  - Network:     局域网地址
  - Explore GraphQL data at:  GraphQL 数据管理地址



### Gridsome基础-预渲染

- 不需要路由配置
- 打包构建后生成了html文件可以部署到任意web server环境
- 客户端渲染





###  Gridsome基础-目录结构

**[官方介绍](https://www.gridsome.cn/docs/directory-structure/)**

- .cache
  - 打包过程中缓存的文件图片啥的
- dist
  - 打包编译生成的结果
- static
  - 不需要打包编译的文件
- src
  - main.js 项目入口文件
    - 可以加载全局处理 css 等
  - templates
  - pages
    - 路由页面文件夹，gridsome会根据pages自动生成路由
  - layouts
    - 布局组件文件夹
  - components
    - 公共组件文件夹
  - .temp
    - 打包编译过程中自动生成的文件
- gridsome.config 
  - gridsome 配置文件
- gridsome.server.js
  - gridsome 配置文件 打包的服务配置
- package
  - 包管理文件
- README.md





### Gridsome基础-项目配置

> `gridsome.config.js`文件介绍，[官方介绍](https://www.gridsome.cn/docs/config/)



###  Gridsome基础-Pages

- 文件式

  - 大写都会编译成小写
  - index 会转为 / 
  - 多个单词用 `-` 拼接

- 编程式

  - `gridsome.server.js`中调用 api.createPages 方法

  ```javascript
  module.exports = function (api) {
    api.createPages(({ createPage }) => {
      createPage({
        path: '/my-page',
        component: './src/templates/MyPage.vue'
      })
    })
  }
  ```



#### 动态路由

动态页面用于客户端路由。路由参数可以通过将名称包装在方括号中来放置在文件和目录名称中。例如：

- `src/pages/user/[id].vue`成为`/user/:id`。
- `src/pages/user/[id]/settings.vue`成为`/user/:id/settings`。

在构建时，这将生成`user/_id.html`，`user/_id/settings.html`并且您必须具有重写规则以使其正常工作。

具有动态路由的页面的优先级低于固定路由。例如，如果您有`/user/create`和`/user/:id`路线，则该`/user/create`路线将优先。

这是一个基本的页面组件，它使用`id`路由中的参数来获取客户端的用户信息：

```html
<template>
  <div v-if="user">
    <h1>{{ user.name }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null
    }
  },
  async mounted() {
    const { id } = this.$route.params
    const response = await fetch(`https://api.example.com/user/${id}`)

    this.user = await response.json()
  }
}
</script>
```

*始终使用`mounted`挂钩来获取客户端数据。`created`由于在生成静态HTML时会执行数据，因此在挂钩中获取数据会引起问题。*



#### 编程式动态路由

```js
module.exports = function (api) {
  api.createPages(({ createPage }) => {
    createPage({
      path: '/user/:id(\\d+)',
      component: './src/templates/User.vue'
    })
  })
}
```



### 重写路由规则

普通静态web服务器没有处理_id.html 的路由规则

需要手动处理



#### 页面meta info

使用了 [vue-meta](https://vue-meta.nuxtjs.org/)  

```html
<template>
  <div>
    <h1>Hello, world!</h1>
  </div>
</template>

<script>
export default {
  metaInfo: {
    title: 'Hello, world!',
    meta: [
      { name: 'author', content: 'John Doe' }
    ]
  }
}
</script>
```



#### 自定义404页面

创建一个`src/pages/404.vue`具有自定义404页面的组件





### Gridsome基础-Pages





### Gridsome基础-添加集合

> 在服务启动之前去获取数据

- gridsome.server.js中

```js
const axios = require("axios")

module.exports = function (api) {
  api.loadSource(async ({ addCollection }) => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api/


    const collection = actions.addCollection('Post')
    
    const { data } = await axios.get('http://jsonplaceholder.typicode.com/posts')

    for (const item of data) {
      collection.addNode({
        id: item.id,
        title: item.title,
        content: item.body
      })
    }
  })
}

```

每个集合将向[GraphQL模式](https://www.gridsome.cn/docs/data-layer/)添加两个根字段，这些根字段用于检索页面中的节点。字段名称是根据集合名称自动生成的。如果您命名集合`Post`，则将在模式中使用以下字段：

- `post`通过获取单个节点`id`。
- `allPost`获取节点列表。*（可以排序和过滤。）*



###  Gridsome基础-在GraphQL中查询数据

> 怎么查看集合里面的数据，只能在开发模式才能访问

- 打开项目 输出的___explore链接

- 点击DOCS 里面查询可以找到的数据

  

- 默认有的数据

  - metadata
  - page
  - allPage



![image-20210124160404286](C:\Users\m1762\AppData\Roaming\Typora\typora-user-images\image-20210124160404286.png)

#### 在页面中使用

[文档](https://www.gridsome.cn/docs/querying-data/)

您可以将数据从GraphQL数据层查询到任何**Page，Template或Component中**。查询在Vue组件中添加`<page-query>`或`<static-query>`块。

- 使用`<page-query>`在**网页和模板**。
- `<static-query>`在**组件中**使用。
- 会把page-query中查询到的数据 挂载到当前实例的  `$page` 上

注意： 

开发模式下看不出来效果

建议：

在`___explore`页面中先写好查询语句再copy到需要位置，因为编辑器不提示，没有高亮容易写错







### Gridsome基础-使用模板渲染节点页面

- gridsome.config.js 中指定templates的访问路径和指定模板

```javascript
module.exports = {
  siteName: '教育',
  plugins: [],
  templates: {
    // 默认情况回去找templates文件夹下 对象key.vue
    // Post: '/posts/:id' Post 为集合里面的key
    Post: [
      {
        // 此id 不能乱写 必须为集合里面 的数据 并且能够保证唯一的数据
        path:'/posts/:id',
        component: './src/templates/Post.vue'
      }
    ]
  },
}
```

- 在page-query中查询语句接收参数  ID! 标识id不能为空

```html
query ($id: ID!) {
  post(id: $id){
    id
    title
    content
  }
}
```



- title 显示 文章标题

```javascript
metaInfo () {
    return {
      title: this.$page.post.title
    }
}
```



注意： 

开发模式同样看不到效果，需要build之后 看文件内容 或者 打开到浏览器查看都可



### 使用strapi管理文章用户数据

[文档地址](https://strapi.io/documentation/developer-docs/latest/installation/cli.html)

#### 安装strapi

1.  yarn `yarn create strapi-app my-project --quickstart`
2.  npm `npx create-strapi-app my-project --quickstart`

#### 启动项目

1.  yarn `yarn develop`
2.  npm `npm  run develop`

### 安装 GRAPHQL

1. 可以在市场中 可视化安装，**不推荐应为查看不到错误**

2. npm run strapi install graphql  **推荐此方式**



### 把strapi的数据继承到 gridsome 中

在gridsome 中安装 strapi插件

[文档地址](gridsome.cn/plugins/@gridsome/source-strapi)

#### 安装

- `yarn add @gridsome/source-strapi`
- `npm install @gridsome/source-strapi`

#### 用法

```js
export default {
  plugins: [
    {
      use: '@gridsome/source-strapi',
      options: {
        apiURL: 'http://localhost:1337',
        queryLimit: 1000, // Defaults to 100
        contentTypes: ['article', 'user'],
        singleTypes: ['impressum'],
        // Possibility to login with a Strapi user,
        // when content types are not publicly available (optional).
        loginData: {
          identifier: '',
          password: ''
        }
      }
    }
  ]
}
```





[分页文档](https://www.gridsome.cn/docs/pagination/)



### 部署

strapi 

node环境 

config/databaes 切换数据库

    


## 封装 Vue.js 组件库

- CDD
  - 组件最大程度被重用
  - 并行开发
  - 可视化测试



### 处理组件的边界情况

- $root
  - 获取vue根实例
  - main.js 中的vue实例
- $parent 
  - 级联嵌套
- $children
  - 使用` this.$children`查找当前组件的直接子组件，可以遍历全部子组件， 需要注意 `$children` 并不保证顺序，也不是响应式的。

- $refs
  - dom对象则获取dom对象
  - 组件则获取 组件对象
- provide inject
  - provide  
    - 在父组件提供成员
  - inject
    - 注入父组件的成员
    - inject 不能修改 ，不是响应式数据

- $attrs
  - 从父组件传给自定义子组件的属性，如果没有 prop 接收 会自动设置到子组件内部的最外层标签上如果是 class 和 style 的话，会合并最外层标签的 class 和 style 
  - 如果子组件中不想继承父组件传入的非 prop 属性，可以使用 inheritAttrs 禁用继承   然后通过 v-bind="$attrs" 把外部传入的非 prop 属性设置给希望的标签上 但是这不会改变 class 和 style
- $listener
  - 展开父组件传进来的原生事件子组件需要元素标记 `v-on="$listeners"`





###  快速原型开发

- VueCLI中提供了一个插件可以进行原型快速开发
- .需要先额外安装一个全局的扩展
  - `npm install -g @vue/cli-service-global`
- 使用vue serve快速查看组件的运行效果



### 使用element ui开发组件

目录结构

> package.json

> main.js

```js
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Login from './src/Login.vue'

Vue.use(ElementUI)

new Vue({
  el: '#app',
  render: h => h(Login)
})

```

> App.vue
>
> src 文件夹



### 组件分类

- 第三方组件
- 基础组件
- 业务组件



使用 yarn  因为要使用yarn工作区

storybook

