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
## react-router-dom 路由跳转的几种方式
1.引入\<Link> 组件并使用，但是其有默认的样式（比如下划线），还要修改其默认样式
```jsx
import <Link> from 'react-router-dom'
...
<Link to="/login" className="login-btn">
  <span className="login-text">登录</span>
</Link>
```
2.导入 withRouter 使用 js 方式跳转
```jsx
import { withRouter } from 'react-router-dom'

// 需要对该组件做如下处理（这是与 redux 连接的同时又使用 withRouter 的情况）
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))

// js 方法实现路由跳转
this.props.history.push('/')

// 简单来说就是通过某种方式(context?)把 history 给传递到这个组件了
```

## 回到顶部的过渡效果
1.利用 `window.scrollTo(xpos, ypos)` 方法加上 `transition: all linear .2s` 来实现 - 该方案无效

2.利用元素的 scrollTop 属性，点击回到顶部按钮时设置元素的 scrollTop: 0 再添加 transition 属性来实现 - 无法对 scrollTop 属性实现过渡

3.该元素的 css 中添加 `scroll-behavior: smooth;` 点击回到顶部按钮时设置元素的 scrollTop: 0 - OK

## 利用 \<hr> 画分割线

<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/_M(%60%5D%40Z_HN3C1CP1UQ%24RR%60R.png" />

```scss
hr {
  border-color: #eaeaea;
  border: 0; // 默认横线
  border-top: 1px solid #eee; // 画条灰色横线
  margin-left: 65px; // 这是块级元素，可以用 margin 来控制横线长度
  margin-right: 15px;
}
```
## 利用 transform:scaleX() 实现下划线伸缩效果

<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/underline.gif"/>

```scss
.menu-item {
  @include center;
  width: 100px;
  color: #969696;
  font-weight: 700;
  font-size: 16px;
  position: relative;
  .icon {
    margin-right: 5px;
  }
  // 利用伪元素给这个 item 加 "下划线"
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    border-bottom: 2px solid #646464;
    top: 100%;
    transform: scaleX(0);
    transition: all linear .2s;
  }
  // hover 时改变 scaleX
  &:hover {
    color: #646464;
    cursor: pointer;
    &:after { // 咋选的?
      transform: scaleX(1);
    }
  }
}
```

## 利用 DOM 操作手动添加的事件处理程序要手动移除
```js
// 假设在加载组件时这样添加事件处理程序
componentDidMount() {
  let app = document.getElementsByClassName('App')[0]
  app.addEventListener('scroll', this.handleScroll, false)
}

// 就需要这么移除，否则会报内存泄漏，另外注意这里的 this.handleScroll 必须是与上面的 addEventListener 相同的引用
componentWillUnmount() {
  let app = document.getElementsByClassName('App')[0]
  app.removeEventListener('scroll', this.handleScroll, false)
}
```

## 防止无意义的渲染
```js
shouldComponentUpdate(nextProps, nextState) {
  // ArticleList 组件是从父组件拿到的 articlelist，发现在内容没变的情况下页面向下滚动就会触发 render 函数
  // 投机取巧......
  return nextProps.articleList.length !== this.props.articleList.length
}
```

## 自己实现一个带边框的 tooltip
<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/%7D%5BNNZ8%5B%7D6%7B3UL_%5D%25WMTT)2F.png" />

小三角就用我们熟悉的 css 画三角来画，如果我们想给这个 tooltip 外层加一个边框？可以再利用一次伪元素来画一个三角形，其颜色
就是边框颜色，利用高度差来实现这个边框效果。

```scss
&:after {
  content: ''; // 记得加 content 才行
  width: 0;
  height: 0;
  border-width: 10px;
  border-style: solid;
  border-color: #fff transparent transparent transparent;
  position: absolute;
  top: 100%;
  left: 50%;
  z-index: 101;
  margin-left: -10px;
}
// 如果我想给小三角再加个边框?
&:before {
  content: '';
  width: 0;
  height: 0;
  border-width: 11px;
  border-style: solid;
  border-color: #f0f0f0 transparent transparent transparent;
  position: absolute;
  top: calc(100% + 1px); // calc 大法好
  left: 50%;
  z-index: 100;
  margin-left: -11px;
}
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

## 登录验证（用户信息持久化）
这里分析一下只使用 cookie 和 cookie 和 session 结合使用的区别，也可以说是分析下为什么会有这样的技术迭代。

假设我们使用最原始的方法：用户输入用户名和密码验证成功后，服务器向客户端设置 cookie，我们假设这个 cookie 存储一个 username 字段（显然这是一个很愚蠢的行为），那么在用户首次登录之后他下次再登录的时候就拥有了这个 cookie，前端可以设置在用户一打开应用时就向服务器发送一个请求（自动携带 cookie），后端就通过检测 cookie 中的信息就可以使得用户直接进入登录状态了。

整理一下：
- ① 首次登录拥有了 cookie 
- ② 再次登录通过检验 cookie 的存在与否来确定登录状态


*****
在 cookie 中直接暴露用户信息是愚蠢的行为，下面我们来升级一下。

我们在 cookie 中存储一个 userid，服务器根据传来的 userid 来得到对应的 username，那么就需要花费空间来存储这一映射关系，假设我们用全局变量来存储（即存储在内存中），这就是所谓的 session 了，即 server 端存储用户信息。

那么现在就变成了：
- ① 首次登录拥有了 cookie，但这次记录的是 userid 
- ② 再次登录发送 cookie，服务器分析 cookie 并根据存储的映射关系判断登录状态

看上去不错，但是仍然存在一些问题：假设我们是 node.js 的一个进程做服务，用户数量不断增加，内存将会暴增，而 OS 是会限制一个进程所能使用的最大内存的；另外，假设我为了充分利用 CPU 的多核特性我开个多进程一起来做服务，那么这些进程之间的内存无法共享，即用户信息无法共享，这就不太妙了。

*****
于是我们可以通过使用 redis 来解决这一问题，redis 不同于 mysql，其数据存放在内存中（虽然昂贵但访问存快），我们把原先要在各个进程中存储的全局变量改为统一存储在 redis 中，这样就可以做到多进程共享信息（全部通过访存 redis 来实现）

那么 node.js 中应该怎么写呢？

本来 express-session 这个中间件可以十分方便地帮我们实现这一需求的，只需要大概如下的配置就可以实现我们上述所说的需求
（向客户端设置 cookie，将相关信息存储进 redis），具体的可以参考
<a href="https://blog.csdn.net/chaoyangsun/article/details/79240888">这篇文章</a> 
```js
const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
})
app.use(session({
  secret: 'WJiol#23123_',
  cookie: {
    // path: '/',   // 默认配置
    // httpOnly: true,  // 默认配置
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}))
```
然而使用时却一直有 bug，简单来说就是一个路由设置 req.session.xxx 的值后，理论上应该存入了 redis 且设置了相应的 cookie，下次携带该 cookie 的请求
到达时，可以直接通过 req.session.xxx 来取值，bug 就是取不到这个值。网上没找到解决方案于是自己大致地实现了一下这个功能。

简单来说就是这样：
- 用户成功登录后，设置一个 cookie，我们称其为 userid，同时将 userid - username 这个键值对存入 redis
- 该用户再次打开应用（如首页或其他页面），发起一个自动登录的请求，该请求会携带 cookie.userid，后端检查 redis 中是否有与这个 userid 相同的键，如果有则取出 username，必要的话再利用 username 查询一些用户信息并返回给前端；如果没有则表示该用户未登录过。

仅贴出部分代码：
```js
// 路由负责解析请求中的数据以及返回响应,controller 提供数据库逻辑操作函数
router.post('/login', function(req, res, next) {
  const { username, password } = req.body // 中间件会帮我们把 POST body 中的数据存入 req.body
  const result = login(username, password) // 返回的是一个 Promise 对象
  return result.then(data => {
    if (data.username) { // 如果不成功，data 为空对象
      // 设置 session - 登录之后就在 redis 中存储了用户信息

      // 登录成功后给用户设置一个 cookie 存储一个 userid
      // 然后 redis 中存储 cookie / username 的键值对
      const userid = `${Date.now()}_${Math.random()}` // 随机生成一个 userId 串
      set(userid, data.username) // redis 操作
      res.cookie('userid', `${userid}`, {expires: new Date(Date.now() + 24 * 60 * 60 * 1000), httpOnly: true}) // path 默认 / domain 默认为 app 的，认为设置 domain 的话要注意一些细节问题
      res.json( // res.json 接收一个对象作为参数，返回 JSON 格式的数据
        new SuccessModel()
      )
      return
    }
    res.json(
      new ErrorModel('loginfail')
    )
  })
})
```
```js
router.get('/autoLogin', (req, res) => {
  const userid = req.cookies.userid
  if (userid) {
    get(userid).then(data => {
      const username = data // 我们拿到的是 username, 然后要利用 username 获取用户信息
      const result = getUserInfoByUsername(username)
      return result.then(userinfo => {
        if (userinfo) {
          res.json(
            new SuccessModel(userinfo)
          )
        } else {
          res.json(
            new ErrorModel('获取用户信息失败')
          )
        }
      })
    })
  } else {
    res.json(
      new ErrorModel('没有 cookie')
    )
  }
})
```
## 与 cookie 相关的跨域问题
相信大部分人在初次接触 cookie 的设置及发送问题时都会遇到这种坑，这里记录下
- 使用 axios 库时，AJAX 请求默认不允许携带 cookie，需要如下设置：
```js
// 用于自动登录
export function autoLogin () {
  return axios({
    method: 'get',
    url: `${BASE_URL}/user/autoLogin`,
    withCredentials: true // 注意 axios 默认是不携带 cookie 的！！！！！
  })
}
```
- server 端的 Access-Control-Allow-Origin 不能为 *，Access-Control-Allow-Credentials 要为 true
```js
app.all('*', function(req, res, next) {
  // 注意 cookie 的跨域限制比较严格，这里不能使用 *，必须与要发送 cookie 的 Origin 相同，本地测试时如 http://localhost:3000 而且不能指定多个只能指定一个！
  // 线上应该是挂载 html 页面的域名和端口号
  res.header("Access-Control-Allow-Origin", "http://localhost:3000")
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept')
  next();
})
```

## xss 与 sql 注入防范措施
我们来看看登录的 sql 语句
```js
const sql = `SELECT username, realname FROM users WHERE username='${username}' AND password='${password}'`
```
假设我们把 sql 语句改成这样，那么根本不用输入密码就能登录成功（即用户输入用户名为`zhangsan'--`）
```sql
SELECT username, realname FROM users WHERE username='zhangsan'--' AND password='123'
```
如果是这样就更危险了
```sql
SELECT username, realname FROM users WHERE username='zhangsan'; DELETE FROM users;--' AND password='123'
```
mysql 模块自带的 escape 方法可以帮我们解决这个问题
```js
username = escape(username)
password = escape(password)
const sql = `
    SELECT username, realname FROM users WHERE username=${username} AND password=${password} // 注意使用了 escape 后不加引号
  `
```
我们来看看 escape 函数处理上述输入后的输出：
```sql
// before
SELECT username, realname FROM users WHERE username='zhangsan'--' AND password='123'
// after
SELECT username, realname FROM users WHERE username='zhangsan\'--' AND password='123'
```
理论上来说，所有通过拼接变量执行的 sql 语句都需要做 sql 注入的考虑

下面再说下 xss 防范

`npm install xss --save`

如果用户输入的文章标题或内容是这样的就属于 xss 攻击
```html
<script>alert(document.cookie)</script>
```
我们只需要这么处理:
```js
let title = xss(ArticleTitle)
```
然后再把内容存入数据库即可，该工具会帮我们转义，即：
```
& -> &amp;
< -> &lt;
> -> &gt;
" -> &quot;
' -> &#x27;
/ -> &#x2F;
...
```
## 密码加密
考虑如果数据库被攻破了，如果数据库中明文存储用户的用户名和密码，那后果是无法预料的，所以我们还要对用户的密码做加密处理。

我们在注册时，不直接存储用户输入的密码，我们可以使用一些加密方法（如 md5）将密码加密后再存入数据库，下次该用户登录时，
仍然输入同样的密码，我们先对该密码串进行 md5 加密后再进行查询。这样就做到了密码加密。
```js
const crypto = require('crypto') // 自带库

// 密匙
const SECRET_KEY = 'wqeW123s_#!@3'

// MD5 加密
function md5(content) {
  let md5 = crypto.createHash('md5')
  return md5.update(content).digest('hex') // 输出变为16进制
}

// 加密函数
function genPassword(password) {
  const str = `password=${password}&key=${SECRET_KEY}`
  return md5(str)
}
```

## PM2 的使用
PM2 解决了哪些问题？
- 服务器稳定性：进程守护，系统崩溃自动重启，这个很重要！
- 充分利用服务器硬件资源，以提高性能：可以启动多进程提供服务
- 线上日志记录：自带日志记录功能

`npm install pm2 -g`

常用命令：
- pm2 start ...: 启动
- pm2 list: 查看 pm2 进程列表
- pm2 restart \<App name> / \<id>: 重启
- pm2 stop \<App name> / \<id>: 停止
- pm2 info \<App name> / \<id>
- pm2 log \<App name> / \<id>
- pm2 monit \<App name> / \<id>: 监控 CPU / 内存信息

可以自定义 PM2 的配置文件（包括设置进程数量，日志文件目录等）
```
{
  "apps": {
    "name": "pm2-test-server",
    "script": "app.js",
    "watch": true, // 监听文件变化自动重启(开发环境 / 线上环境)
    "ignore_watch": [ // 哪些文件变化是不需要监听的
      "node_modules",
      "logs"
    ],
    "instances": 4, // 多进程相关 CPU 核数
    "error_file": "logs/err.log", // 错误日志路径,未定义会有默认路径
    "out_file": "log/out.log", // console.log 打印的内容
    "log_date_format": "YYYY-MM-DD HH:mm:ss", // 日志时间格式，自动添加时间戳
  }
}
```
<img src="https://github.com/ChenMingK/ImagesStore/blob/master/imgs/pm2.png" />

## 日志分析技巧
使用 crontab 命令（linux）拆分日志：
- 日志内容会慢慢积累，放在一个文件中不好处理
- 按时间划分日志文件，如 2019-02-10.access.log

Linux 的 crontab 命令，即定时任务
- 设置定时任务，格式：* * * * * command
- 分钟 小时 月份 日 星期 command 是 shell 脚本

command 需要执行什么？

1.将 access.log 拷贝并重命名为 2019-02-10.access.log

2.清空 access.log 文件，继续积累日志

我们可以编写如下脚本：
```shell
// copy.sh
cd /Users/Proj/blog-proj
cp access.log $(date + %Y-%m-%d).access.log
echo "" > access.log
```
```shell
// 每天凌晨触发该 shell 脚本
crontab -e 1 * 0 * * * sh /Users/Proj/blog-Proj/copy.sh
```

