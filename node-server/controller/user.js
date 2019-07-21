const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

// 登录逻辑
const login = (_username, _password) => {
  let username = escape(_username) // 防止 sql 注入，对字符串做相应处理
  // 因为存入数据库的密码是加密后的，所以用同样的加密方式对密码进行加密再进行验证
  // 密码一样的话加密结果(字符串)也是一样的
  let password = genPassword(_password)
  password = escape(password) // 因为用于输入的用户名和密码是直接注入数据库的，所以要做 sql 注入防范
  const sql = `SELECT username FROM users WHERE username=${username} AND password=${password}` // 使用了 escape 不用加单引号了
  return exec(sql).then(rows => {
    return rows[0] || {} // 如果能 select 到说明正确
  })
}

// 注册逻辑
const register = (_username, _password, _nickname) => {
  let username = escape(_username)
  // 先对用户输入的密码进行加密后再存入数据库 md5
  let password = genPassword(_password)
  password = escape(password)
  let nickname = escape(_nickname)
  // 注意使用了 escape 后模板字符串中不需要加 ''
  // 头像这里随机抽取
  const avatars = [
    'http://cmk1018.cn/wp-content/uploads/2019/07/avatar8.jpg',
    'http://cmk1018.cn/wp-content/uploads/2019/07/avatar7.jpg',
    'http://cmk1018.cn/wp-content/uploads/2019/07/avatar6.jpg',
    'http://cmk1018.cn/wp-content/uploads/2019/07/avatar5.jpg',
    'http://cmk1018.cn/wp-content/uploads/2019/07/avatar4.jpg',
    'http://cmk1018.cn/wp-content/uploads/2019/07/avatar3.jpg',
    'http://cmk1018.cn/wp-content/uploads/2019/07/avatar2.jpg',
    'http://cmk1018.cn/wp-content/uploads/2019/07/avatar1.jpg'
  ]
  const avatarurl = avatars[Math.floor(Math.random() * avatars.length)]
  const sqlUsers = `INSERT INTO users (username, password) VALUES (${username}, ${password})`
  const sqlUserInfo = `INSERT INTO userinfo (username, nickname, avatarurl) VALUES (${username}, ${nickname}, '${avatarurl}')` // 其他的列有默认值

  // 用户注册时，需要做两个插入操作，在 users 表和 userinfo 表同时插入

  const promise1 = exec(sqlUsers)
  const promise2 = exec(sqlUserInfo)

  return Promise.all([promise1, promise2]).then(res => {
    return res || {} // res 是两个 resolve 出来的结果的数组
  })
}
module.exports = {
  login,
  register
}