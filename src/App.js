import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Header from './components/common/header/Header'
import Home from './pages/home/Home'
import Detail from './pages/detail/Detail'
import Editor from './pages/postedit/Postedit'
import Writer from './pages/writer/Writer'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import Me from './pages/me/Me'
import store from './store/store'
import { Provider } from 'react-redux'

// 尽量统一组件的创建方式，更改了 create-react-app 脚手架的函数形式
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <BrowserRouter>
            <Header />
            <React.Fragment> {/* only child 限制 */}
              <Route path="/" exact component={Home}></Route> {/* exact 可以保证访问 /detail 路由时不渲染根路由的组件 */}
              <Route path="/detail" exact component={Detail}></Route>
              <Route path="/editor" exact component={Editor}></Route>
              <Route path="/writer" exact component={Writer}></Route>
              <Route path="/login" exact component={Login}></Route>
              <Route path="/register" exact component={Register}></Route>
              <Route path="/me" exact component={Me}></Route>
            </React.Fragment>
          </BrowserRouter>
        </div>
      </Provider>
    )
  }
}

export default App;
