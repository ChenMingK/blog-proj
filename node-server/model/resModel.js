// 封装响应的数据格式
class BaseModel {
  // data: 数据对象  message: 消息
  constructor (data, message) { 
    if (typeof data === 'string') {
      this.message = data
      data = null
      message = null
    }
    if (data) {
      this.data = data
    }
    if (message) {
      this.message = message
    }
  }
}

// 处理成功后的响应格式
class SuccessModel extends BaseModel {
  constructor (data, message) {
    super(data, message)
    this.errno = 0 // error number 0
  }
}


// 处理失败返回的响应格式
class ErrorModel extends BaseModel {
  constructor (data, message) {
    super(data, message)
    this.errno = -1
  }
}

module.exports = {
  SuccessModel,
  ErrorModel
}