# Introduction
技术栈：react + redux + react-router + express + Nginx

练习点：
- redux 连接
- react-router 路由跳转
- scss 样式书写
- 容器组件与展示组件的设计
- express 脚手架项目结构设计
- 用户信息持久化（cookie + redis）
- 常见安全问题处理（xss sql 注入 cookie 跨域）
- Promise 封装数据库操作
- PM2 进程守护

线上体验地址：<a href="http:www.cmk1018.cn:8085">点我跳转</a>
# Show
<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/show.gif" />

# Design
<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/2UXZBP33%7BB6D%4024X_UF~%7BE2.png" />


# 前端
## 项目结构
```
|-- src
  |-- api                 // 所有API请求(axios)
  |-- assets              // 字体图标、全局/混合样式
  |-- components          // 展示组件 / 作为某个页面的局部的组件
    |-- common            // 可复用的组件
    |-- home              // home 页面所用到的组件，即 home 页面由这些组件构成
    |-- edit              // edit 页面所用到的组件
  |-- pages               // 容器组件 / 该组件整体作为一个页面展示，与 redux 连接并将 store 中的数据传递给其子组件
    |-- login             // 登录页
    |-- home              // 首页
      |-- Home.jsx        // react 组件
      |-- Home.scss       // 该组件的样式文件 
      ......
  |-- store               // redux
    |-- home              // home 页对应的 store
      |-- action-type.js  // action 类型
      |-- actions.js      // action 构造器
      |-- index.js        // 用于整体导出
      |-- reducer.js      // 该 module 的 reducer
    |-- module2           // 这个文件夹只是为了说明如果有 redux 有新的 module 需要引入就和 home 文件夹下格式一样
    |-- store.js          // 合并 reducer，创建 store（全局唯一）并导出，如果需要应用中间件，在这里添加
|-- App.js                // 根组件 / 定制路由
|-- index.js              // 项目入口 / webpack 打包入口文件
```
# 后端
## 项目结构
```
|--bin
  |-- www                 // 入口文件 / 启动文件
|-- conf                  // 配置项
  |-- db.js               // 数据库连接配置 / redis 连接配置
|-- controller
  |-- blog.js             // 处理 blog 路由相关逻辑（将逻辑操作封装为函数并导出由供路由处理部分使用）
  |-- user.js             // 处理 user 路由相关逻辑
|-- db
  |-- mysql.js            // 建立 mysql 连接，将执行 sql 操作封装为 Promise 并导出
  |-- redis.js            // 建立 redis 连接，封装 set、get 操作并导出
|-- middleware
  |-- loginCheck.js       // 自定义的中间件
|-- model
  |-- resModel.js         // 封装响应的格式
|-- routes                // 定义相关的路由处理
  |-- blog.js             // 与博客文章相关的路由处理
  |-- user.js             // 与用户注册 / 登录相关的路由处理
|-- utils                 // 工具类
  |-- cryp.js             // 加密函数
|-- app.js                // 规定中间件的引入顺序 / 请求的处理顺序，整合路由
|-- package.json
```
## 使用 nodemon 和 cross-env
`npm install nodemon cross-env --save-dev`

nodemon 用于热重启，就是跟 webpack 的热更新差不多，保存文件后自动重启服务。

cross-env 用于配置环境变量。

packages.json 做如下脚本配置：
```js
"scripts": {
    "start": "node ./bin/www",
    "dev": "cross-env NODE_ENV=dev nodemon ./bin/www",
    "prd": "cross-env NODE_ENV=production pm2 start ./bin/www" // pm2 之后会介绍
  },
```
可以通过如下方式获取环境参数：从而根据环境来修改我们的一些配置（如 mysql redis）
```js
// 配置文件
const env = process.env.NODE_ENV

// mysql 配置, redis 配置
let MYSQL_CONF
let REDIS_CONF

// 开发环境
if (env === 'dev') {
  // mysql
  MYSQL_CONF = {
    ...
  }

  // redis
  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  }
}

// 线上环境
if (env === 'production') {
  ...
}
```
## 文件结构拆分
- 为什么要把 www 和 app.js 分离？ 

www 仅与 server（服务启动）相关，app.js 负责一些其他的业务，如果之后需要修改，那么与 server 相关就只需要负责 www 文件即可。
- router 和 controller 为什么要分离？

router 中只负责路由的响应与回复，不负责具体数据的处理（数据库操作）；
controller 只负责数据，传入参数操作数据库返回结果，相当于封装好的数据操作，与路由无关（路由负责调用）

## mysql 占位技巧
```js
let sql = `SELECT * FROM blogs WHERE 1 = 1` // 1 = 1的意义？占位，如果 author 和 keyword 都没有值这样不会报错
if (author) {
  sql += `AND author='${author}' `
}
if (keyword) {
  sql += `AND title LIKE '%${keyword}%' `
}
sql += `ORDER BY createtime DESC;`
```

## 将数据库执行语句封装为 Promise 对象
```js
// 统一执行 sql 的函数，并封装为 Promise 对象
function exec (sql) {
  const promise = new Promise((resolve, reject) => {
    conn.query(sql, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })
  return promise
}
```
我们在 controller 层再做一层封装：
```js
const getArticleList = () => {
  const sql = `SELECT * FROM articles`
  return exec(sql)
}
```
在路由处理时这样使用：
```js
// Home 页获取文章列表
router.get('/getPartArticles', (req, res) => {
  const result = getArticleList()
  return result.then(data => {
    res.json(
      new SuccessModel(data)
    )
  })
})
```
这么做的目的主要是让回调的顺序更为清晰，本来 Promise 就是为了解决回调地狱的问题，当然也可以采用 async / await 的写法：
```js
// 这是 koa2 的形式，koa2 原生支持 async / await 的写法
router.post('/login', async (req, res) => {
    // 原来做法
    // query('select * from im_user', (err, rows) => {
    //     res.json({
    //         code: 0,
    //         msg: '请求成功',
    //         data: rows
    //     })
    // })
    
    // 现在
    const rows = await query('select * from im_user')
    res.json({
        code: 0,
        msg: '请求成功',
        data: rows
    })  
})
```


