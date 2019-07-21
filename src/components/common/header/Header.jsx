import React, { Component } from 'react'
import { connect } from 'react-redux' // 与 store 连接
import { Link, withRouter } from 'react-router-dom'
import './Header.scss'

class Header extends Component {

  constructor (props) {
    super(props)

    this.jumpToHome = this.jumpToHome.bind(this)
  }

  renderLogin () {
    if (this.props.userinfo.avatarurl) { // 如果有用户信息（表示登录状态）
      return (
        <Link to="/me" className="login-img">
          <img alt="" src={this.props.userinfo.avatarurl} />
        </Link>
      )
    } else {
      return (
        <Link to="/login" className="login-btn">
          <span className="login-text">登录</span>
        </Link>
      )   
    }
  }

  jumpToHome () {
    this.props.history.push('/')
  }

  render() {
    return (
      <div className="header-wrap">
        <div className="header-left">
          <img className="logo" alt="" src="https://cdn2.jianshu.io/assets/web/nav-logo-4c7bbafe27adc892f3046e6978459bac.png"/>
        </div>
        <div className="header-middle">
          <div className="tab-home" onClick={this.jumpToHome}>
            <i className="icon-home"></i>
            <span className="home-text">首页</span>
          </div>
          <div className="tab-download">
            <i className="icon-download"></i>
            <span className="download-text">下载App</span>
          </div>
          <div className="search-wrap">
            <input className="search" type="text" placeholder="搜索"/>
            <i className="icon-search"></i>
          </div>
        </div>
        <div className="header-right">
          <div className="switch-mode-btn">
            <span className="mode-text">Aa</span>
          </div>
          <div className="diamond-logo">
            <img alt="" src="/images/diamond-logo.png" /> {/* 放在public目录,注意没有/public */}
          </div>
          {/* <div className="login-btn">
            <span className="login-text" onClick={this.jumpToLogin}>{this.renderLogin}</span>
          </div> */}
          {this.renderLogin()}
          <Link to="/register" className="register-btn">
            <span className="register-text">注册</span>
          </Link>
          <Link to="/editor" className="writting-btn">
            <i className="icon-pen"></i>
            <span className="writting-text">写文章</span>
          </Link>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userinfo: state.home.userinfo
})

const mapDispatchToProps = dispatch => ({

})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))