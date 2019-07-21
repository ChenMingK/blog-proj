import React, { Component } from 'react'
import { getPartWriters } from '../../api/api'
import './Writer.scss'

class Writer extends Component {

  constructor (props) {
    super(props)

    this.state = {
      writerList: []
    }
  }

  componentDidMount () {
    getPartWriters().then(res => {
      let data = res.data.data
      this.setState({
        writerList: data
      })
    })
  }

  render () {
    return (
      <div className="writer-container">
        <div className="banner-wrap">
          <img alt="" src="/images/recommend-banner.png" />
          <p className="banner-text">
            <i className="icon-help"></i>
            如何成为签约作者
          </p>
        </div>
        <div className="writer-list-wrap">
          {this.state.writerList.map(item => {
            return (
              <div className="list-item-wrap" key={item.id}>
                <div className="bg-wrap">
                  <img className="avatar-img" alt="" src={item.avatarurl}/>
                  <div className="description-wrap">
                    <p className="name">{item.nickname}</p>
                    <p className="sign">{item.signature}</p>
                    <div className="btn-follow-wrap">
                      +&ensp;关注
                    </div>
                  </div>
                  <hr /> {/* 用这玩意画分割线 */}
                  <div className="meta">
                    最近更新
                  </div>
                  <div className="recent-update">
                    <p>xxxxx (2019.7.12)</p>
                    <p>xxxxx (2019.7.12)</p>
                    <p>xxxxx (2019.7.12)</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="load-more">加载更多</div>
      </div>
    )
  }
}


export default Writer