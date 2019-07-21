import React, { Component } from 'react'
// import { getUserInfo } from '../../api/api'

import './Me.scss'

class Me extends Component {
  constructor (props) {
    super(props)

    this.state = {
      userInfo: {
        nickname: '1',
        articlenumbers: 1
      }
    }
  }

  // componentDidMount () {
  //   // username 存在哪?从 store 中获取? 进入首页时保存?
  //   getUserInfo(nickname, username).then(res => {
  //     let data = res.data.data
  //     this.setState({
  //       userInfo: data
  //     })
  //   })
  // }

  render() {
    const userInfo = this.state.userInfo
    return (
      <div className="me-container">
        <div className="left-wrap">
          <div className="top-wrap">
            <div className="top-left">
              <img alt="" src="https://upload.jianshu.io/users/upload_avatars/16841177/1ec6ebdc-d45a-475f-aa6f-ef10395513cd?imageMogr2/auto-orient/strip|imageView2/1/w/240/h/240" />
            </div>
            <div className="top-right">
              <div className="name">{userInfo.nickname}</div>
              <div className="info">
                <div className="info-block">
                  <span className="number">0</span>
                  <span className="text">关注</span>
                </div>
                <div className="info-block">
                  <span className="number">10</span>
                  <span className="text">粉丝</span>
                </div>
                <div className="info-block">
                  <span className="number">{userInfo.articlenumbers}</span>
                  <span className="text">文章</span>
                </div>
                <div className="info-block">
                  <span className="number">102</span>
                  <span className="text">字数</span>
                </div>
                <div className="info-block">
                  <span className="number">10</span>
                  <span className="text">收获喜欢</span>
                </div>
              </div>
            </div>
          </div>
          <div className="menu-wrap">
            <div className="menu-item">
              <i className="icon icon-bookmark"></i>
              <span>文章</span>
            </div>
            <div className="menu-item">
              <i className="icon icon-bookmark"></i>
              <span>动态</span>
            </div>
            <div className="menu-item">
              <i className="icon icon-bookmark"></i>
              <span>最新评论</span>
            </div>
            <div className="menu-item">
              <i className="icon icon-bookmark"></i>
              <span>热门</span>
            </div>
          </div>
          <div className="messages-wrap"> {/* 渲染信息列表 */}
            1111111111111
          </div>
        </div>
        <div className="right-wrap">
          <div className="right-top">
            <div className="follow-article">
              <i className="icon-menu"></i>
              <span>我关注的文章</span>
            </div>
            <div className="like-article">
              <i className="icon-heart"></i>
              <span>我喜欢的文章</span>
            </div>
          </div>
          <div className="right-bottom">
            <div className="my-topic">我创建的专题</div>
            <div className="new-topic">+ 创建一个新专题</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Me