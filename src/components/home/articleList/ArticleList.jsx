import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './ArticleList.scss'

class ArticleList extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    // 假设影响渲染内容的 prop 只有 completed 和 text，只需要确保
    // 这两个 prop 没有变化，函数就可以返回 false
    return nextProps.articleList.length !== this.props.articleList.length
  }

  render () {
    // 为什么会滚动页面会触发重新渲染? 后期在 shouldComponentUpdate 钩子做一下优化
    const articleList = this.props.articleList // 从 Home 容器组件获取文章列表信息
    return (
      <div className="article-list-wrap">
        {
          articleList.map((item, index) => {
            return (
              <div className="list-item" key={item.id}>
                <Link to={{pathname: '/detail', query: {id: item.id, nickname: item.author}}} className="title">{item.title}</Link>
                <p className="abstract">{item.abstract}</p>
                {
                  item.coverurl ? <div className="img-wrap"><img alt="" src={item.coverurl} /></div>
                              : null
                }
                <div className="meta">
                  <span className="jsd-meta">
                    <i className="icon-diamond"></i>
                    66
                  </span>
                  <span className="author">
                    {item.author}
                  </span>
                  <span className="comment">
                    <i className="icon-bubble"></i>
                    13
                  </span>
                  <span>
                    <i className="icon-heart"></i>
                    25
                  </span>
                </div>
              </div>
            )
          })
        }
        <div className="load-more">加载更多</div>
      </div>
    )
  }
}

export default ArticleList