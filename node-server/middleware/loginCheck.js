// 中间件
const { ErrorModel } = require('../model/resModel')
const { get } = require('../db/redis')
// 作为每个路由处理之前的中间件，做登录验证，如果 cookie 中没有相关登录信息则直接拒绝
module.exports = (req, res, next) => {
  let userid = req.cookies.userid // 看 cookie 中是否有登录信息，如果没有则拒绝拒绝后续操作
  if (userid) {
    next ()
  } else {
    res.json(
      new ErrorModel('未登录')
    )
  }
}