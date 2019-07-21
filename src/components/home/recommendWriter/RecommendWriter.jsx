import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './RecommendWriter.scss'

class RecommendWriter extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    // 假设影响渲染内容的 prop 只有 completed 和 text，只需要确保
    // 这两个 prop 没有变化，函数就可以返回 false
    return nextProps.writerList.length !== this.props.writerList.length
  }

  render() {
    const writerList = this.props.writerList.slice(0, 5) // 随机抽 5 个
    return (
      <div className="recommend-wrap">
        <div className="top-wrap">
          <span>推荐作者</span>
          <i className="icon-spin">换一批</i>
        </div>
        {
          writerList.map(item => {
            return (
              <div className="list-wrap" key={item.id}>           
                <img alt="" src={item.avatarurl} />
                <span className="name">
                  {item.nickname}
                </span>
                <span className="description">
                  {item.signature}
                </span>
                <span className="follow">
                  <span className="add">+</span>
                  <span>关注</span>
                </span>
              </div>      
            )
          })
        }
        <div className="more">
          <Link to="/writer" className="link">查看全部</Link>
          <i className="icon-forward"></i>
        </div>
      </div>
    )
  }
}

export default RecommendWriter