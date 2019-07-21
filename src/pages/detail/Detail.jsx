import React, { Component } from 'react'
import { getDetail, getUserInfo } from '../../api/api'
import './Detail.scss'

class Detail extends Component {

  constructor (props) {
    super(props)

    this.state = {
      avatarUrl: '',
      title: '',
      author: '',
    }
  }
  componentDidMount() {
    const { id, nickname } = this.props.history.location.query // 获取路由跳转过来时传递的参数 
    console.log(nickname)
    getDetail(id).then(res => {
      let data = res.data.data
      let articleContent = data.content
      // 存入数据库的时候存在'\'的对引号的转义咋办?
      articleContent.replace('\\', '')
      document.getElementsByClassName('article-content')[0].innerHTML = articleContent
      this.setState({
        title: data.title,
        author: nickname
      })
    })

    getUserInfo(nickname).then(res => {
      let data = res.data.data
      console.log(res)
      this.setState({
        avatarUrl: data.avatarurl, // 注意大小写
      })
    })
  }

  render() {
    return (
      <main className="detail-container">
        <div className="top-wrap">
          <div className="title-wrap">
            {this.state.title}
          </div>
          <div className="writer-msg-wrap">
            <img className="img-wrap" alt="" src={this.state.avatarUrl} />
            <div className="info">
              <span className="author">{this.state.author}</span>
              <span className="follow">+关注</span>
              <br />
              <div className="meta">
                <span><i className="icon-diamond"></i>3.9</span>
                <span>2019.07.20 08:42</span>
                <span>字数 666</span>
                <span>阅读 666</span>
                <span>评论 2</span>
                <span>喜欢 3</span>
              </div>
            </div>
          </div>
        </div>
        <div className="article-content">
          
        </div>
        <div className="bottom-wrap">
          <p className="bottom-text">小礼物走一走，来简书关注我</p>
          <div className="bottom-btn-wrap"><span className="bottom-btn">赞赏支持</span></div>
        </div>


        <div className="side-tool">
          <div className="tool"><i className="icon-add"></i></div>
          <div className="tool"><i className="icon-bookmark"></i></div>
          <div className="tool"><i className="icon-heart"></i></div>
          <div className="tool"><i className="icon-private-see"></i></div>
        </div>
      </main>
    )
  }
}

export default Detail