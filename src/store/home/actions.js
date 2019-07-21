import * as actionType from './action-type'

// action 就是一个对象，这里写创建 action 的函数

// 保存文章列表(这里不采用异步 action，axios 发送 GET 请求后再调用 action)
export const saveArticleList = (articleList) => ({ // 箭头函数写法，返回一个对象
  type: actionType.SAVE_ARTICLE_LIST,
  articleList
})

// 保存作者列表
export const saveWriterList = (writerList) => ({
  type: actionType.SAVE_WRITER_LIST,
  writerList
})

// 保存当前用户某些信息
export const saveUserInfo = (userinfo) => ({
  type: actionType.SAVE_USERINFO,
  userinfo
})
