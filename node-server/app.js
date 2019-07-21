const createError = require('http-errors') // 错误页处理插件
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser') // 解析 cookie
// const logger = require('morgan') // 用于日志记录 不需要了 使用 pm2 做日志记录


// 引入路由
const usersRouter = require('./routes/user')
const blogRouter = require('./routes/blog')
// 初始化 app
const app = express()

// const ENV = process.env.NODE_ENV

// if (ENV !== 'production') {
//   // 开发环境不记录日志
//   app.use(logger('dev'))
// } else {
//   const logFileName = path.join(__dirname, 'logs', 'access.log')
//   const writeStream = fs.createWriteStream(logFileName, {
//     flags: 'a' // 写文件的形式, 'a' 表示下次再写时写在之前的位置之后
//   })
//   app.use(logger('combined', { // 可以自定义日志的形式
//     stream: writeStream // 利用 stream 流来写日志
//   }))
// }

app.all('*', function(req, res, next) {
  // 注意 cookie 的跨域限制比较严格，这里不能使用 *，必须与要发送 cookie 的 Origin 相同，本地测试时如 http://localhost:3000 而且不能指定多个只能指定一个！
  // 线上应该是挂载 html 页面的域名和端口号
  res.header("Access-Control-Allow-Origin", "http://localhost:3000") // Nginx 配的服务器端口
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept')
  next();
})

app.use(express.json()) // built-in middleware 基于 body-parser POST 请求有 4 种数据格式，因此需要与下面一个中间件结合使用
app.use(express.urlencoded({ extended: false })) // built-in middleware // Content-Type: x-www-... 用表单提交时的 POST 数据格式 解析结果会存入 req.body 和JSON格式数据一样
app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')))

// 注册路由
app.use('/user', usersRouter)
app.use('/api', blogRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// // error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
