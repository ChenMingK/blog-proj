import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Login.scss'
import { login } from '../../api/api'

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      ifWarningShow: false,
      warningMsg: '' // server 端传回的错误信息
    }

    this.usernameChange = this.usernameChange.bind(this)
    this.passwordChange = this.passwordChange.bind(this)
    this.loginCheck = this.loginCheck.bind(this)
    this.showWarningMsg = this.showWarningMsg.bind(this)
  }

  // 用户输入用户名时设置到 state 中
  usernameChange (e) {
    this.setState({
      username: e.target.value
    })
  }

  // 用户输入密码时设置到 state 中
  passwordChange (e) {
    this.setState({
      password: e.target.value
    })
  }

  // 跳转到注册页面
  jumpToRegister () {
    this.props.history.push('/register')
  }

  loginCheck () {
    let self = this
    let username = this.state.username
    let password = this.state.password
    if (!username || !password) {
      this.showWarningMsg('用户名和密码不能为空')
      return
    }
    login(username, password).then(res => {
      // { errno: 0, message: ''}
      let info = res.data
      const errno = info.errno
      // 检查 error_code 和 msg 来确定下一步操作
      if (errno === 0) { // 正确
        window.alert('登录成功')
        self.props.history.push('/') // 路由跳转
      } else {
        window.alert('登录失败')
      }
    })  
  }

  showWarningMsg (msg) {
    this.setState({
      ifWarningShow: true,
      warningMsg: msg
    })
    let el = document.querySelector('.warning-wrap')
    el.style.opacity = 1
  }

  render() {
    return (
      <div className="login">
        <div className="bg-wrap"></div>
        <div className="loginForm-wrap">
          <div className="text-wrap">
            <span className="login-text">登录</span>
            <span>·</span>
            <Link className="register-text" to="/register">注册</Link>
          </div>
          <div className="form-wrap">
            <div className="input-user-wrap">
              <span className="icon-member"></span>
              <input type="text" placeholder="用户名" onChange={this.usernameChange} />
            </div>
            <div className="input-password-wrap">
              <span className="icon-password"></span>
              <input type="password" placeholder="密码" onChange={this.passwordChange} />
            </div>
            <div className="warning-wrap">
              <span className="icon-warning"></span>
              <span className="warning-text">{this.state.warningMsg}</span>
            </div>
            <div className="login-btn" onClick={this.loginCheck}>
              <span>登录</span>
            </div>
            <div className="footer-text">
              <span>温馨提示:行车不规范，亲人两行泪</span>
            </div>
          </div>
        </div>
      </div>
    ) 
  }
}

export default Login
