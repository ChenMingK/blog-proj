const redis = require('redis')
const { REDIS_CONF } = require('../conf/db.js')

// 创建 redis 客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('errpr', err => {
  console.log(err)
})

// 往 redis 中存数据
function set (key, val) {
  if (typeof val === 'object') {
    val = JSON.stringify(val)
  }
  redisClient.set(key, val, redis.print) // print?
}

function get (key) {
  const promise = new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        reject(err)
        return
      }
      if (val === null) {
        resolve(null)
        return
      }
      try {
        resolve(JSON.parse(val)) // 返回值？
      } catch(ex) {
        resolve(val)
      }
    })
  })
  return promise
}

module.exports = {
  set,
  get
}