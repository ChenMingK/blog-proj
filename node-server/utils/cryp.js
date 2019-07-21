const crypto = require('crypto') // 自带的库

// 密匙
const SECRET_KEY = 'abc_123#'

// md5 加密
function md5 (content) {
  let md5 = crypto.createHash('md5')
  return md5.update(content).digest('hex') // 输出为 16 进制
}

// 加密函数
function genPassword (password) {
  const str = `password=${password}&key=${SECRET_KEY}`
  return md5(str)
}

module.exports = {
  genPassword
}