import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk' // 目前还没用到 redux-thunk 
import { reducer as homeReducer } from './home'

// 开发者工具
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// 可以继续添加新的 reducer 在这里 combine
const reducer = combineReducers({
  home: homeReducer
  // filter: filterReducer
})

// const middlewares = []
// if (process.env.NODE_ENV !== 'production') {
//   middlewares.push(require('redux-immutable-state-invariant')())
// }
const store = createStore(reducer, composeEnhancers(
  applyMiddleware(thunk) // 使用 redux-thunk 中间件
))


export default store
