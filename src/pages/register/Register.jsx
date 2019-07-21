import React, { Component } from 'react'
import { Link } from 'react-router-dom' // 路由跳转
import { register } from '../../api/api'
import './Register.scss'

class Register extends Component {
  constructor (props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      nickname: '',
      ifWarningShow: false,
      warningMsg: '' // server 端传回的错误信息
    }

    this.usernameChange = this.usernameChange.bind(this)
    this.passwordChange = this.passwordChange.bind(this)
    this.nicknameChange = this.nicknameChange.bind(this)
    this.registerCheck = this.registerCheck.bind(this)
    this.showWarningMsg = this.showWarningMsg.bind(this) // 有没有什么办法可以不这么麻烦?
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

  nicknameChange (e) {
    this.setState({
      nickname: e.target.value
    })
  }

  // 检验用户名及密码，如果成功发送 AJAX 请求
  registerCheck (e) {
    let self = this
    let username = this.state.username
    let password = this.state.password
    let nickname = this.state.nickname
    if (!username || !password || !nickname) {
      this.showWarningMsg('用户名和密码和昵称都不能为空')
      return
    }
    register(username, password, nickname).then(res => {
      // { errno: 0, message: ''}
      let info = res.data // res.data.data才是
      const errno = info.errno
      // 检查error_code和msg来确定下一步操作
      if (errno === 0) { // 正确
        window.alert('注册成功')
        self.props.history.push('/login') // this.props.history.push(方法来跳转) 实际上改变的是 URL ?
       
      } else {
        window.alert('注册失败')
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

  render () {
    return (
      <div className="register">
        <div className="bg-wrap"></div>
        <div className="loginForm-wrap">
          <div className="text-wrap">
            <Link className="login-text" to="/login">登录</Link>
            <span>·</span>
            <span className="register-text">注册</span>
          </div>
          <div className="form-wrap">
            <div className="input-user-wrap">
              <span className="icon-member"></span>
              <input type="text" placeholder="用户名" onChange={this.usernameChange} />
            </div>
            <div className="input-nickname-wrap">
              <span className="icon-member"></span>
              <input type="text" placeholder="昵称" onChange={this.nicknameChange} />
            </div>
            <div className="input-password-wrap">
              <span className="icon-password"></span>
              <input type="password" placeholder="设置密码" onChange={this.passwordChange} />
            </div>
            
            <div className="warning-wrap">
              <span className="icon-warning"></span>
              <span className="warning-text">{this.state.warningMsg}</span>
            </div>
            <div className="login-btn" onClick={this.registerCheck}>
              <span>注册</span>
            </div>
            <div className="footer-text">
              <span>点击 “注册” 即表示您同意并愿意遵守用户协议 和 隐私政策 </span>
            </div>
          </div>
        </div>
      </div>
    ) 
  }
}

export default Register
