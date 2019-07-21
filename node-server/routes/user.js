const express = require('express')
const router = express.Router()
const { login, register } = require('../controller/user')
const { getUserInfoByUsername } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { get, set } = require('../db/redis')

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

// 处理注册的路由
router.post('/register', (req, res) => {
  //  从 req.body 取 POST 请求的数据
  const { username, password, nickname } = req.body // 解构赋值
  const result = register(username, password, nickname)
  return result.then(data => {
    if (data) {
      res.json(
        new SuccessModel('register success')
      )
      return
    }
    res.json(
      new ErrorModel('registerfail')
    )
  })
})

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
module.exports = router
