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
