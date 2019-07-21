import * as actionType from './action-type';

let defaultState = {
  articleList: [], // 文章列表
  writerList: [], // 作者列表
  userinfo: {} // 当前登录的用户信息：用户名，头像等 {username, nickname, signature, articlenumbers, avatarurl}
}

// reducer 是一个函数，返回新的 state，无副作用
export default (state = defaultState, action) => {
  switch (action.type) {
    case actionType.SAVE_ARTICLE_LIST: {
      return {...state, ...{articleList: action.articleList}} // 浅复制?
    }
    case actionType.SAVE_WRITER_LIST: {
      return {...state, ...{writerList: action.writerList}}
    }
    case actionType.SAVE_USERINFO: {
      return {...state, ...{userinfo: action.userinfo}}
    }
    default: {
      return state
    }
  }
}
