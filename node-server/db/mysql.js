const mysql = require('mysql')
const { MYSQL_CONF } = require('../conf/db')

// 创建连接对象，服务启动后一直保持连接
const conn = mysql.createConnection(MYSQL_CONF)

// 开始连接
conn.connect()
// 统一执行 sql 的函数，并封装为异步操作
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

// 对外提供一个执行 sql 语句的函数
module.exports = {
  exec,
  escape: mysql.escape // escape 是内置的用于防止 sql 注入的
}
