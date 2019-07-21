// 配置文件
const env = process.env.NODE_ENV

// mysql 配置, redis 配置
let MYSQL_CONF
let REDIS_CONF

// 开发环境
if (env === 'dev') {
  // mysql
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'xiaokang',
    port: '3306',
    database: 'myblog'
  }

  // redis
  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  }
}

// 线上环境
if (env === 'production') {
  // mysql
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '6EAb64c1e91b',
    port: '3306',
    database: 'myblog'
  }

  // redis
  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  }
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF
}