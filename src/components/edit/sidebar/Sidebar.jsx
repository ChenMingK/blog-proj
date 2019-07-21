import React, { Component } from 'react'
import './Sidebar.scss'

// 编辑文章-侧边栏
class Sidebar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      menuList: [
        '查看主页',
        '文章管理',
        '专栏管理',
        '个人分类管理',
        '博客搬家',
        '百度关键词',
        '博客设置'
      ]
    }
  }

  menuList() {
    const listItems = this.state.menuList
    return listItems.map(item => {
      return <div className="list-item" key={item}>{item}</div>
    })
    
  }
  render() {
    return (
      <React.Fragment>
        <div className="sidebar-wrap">
          {this.menuList()}
        </div>
        <div className="sidebar-img-wrap">
          <img alt="" src="images/codeImg.jpg" />
          <div className="sidebar-text">QQ客服</div>
        </div>
      </React.Fragment>
    )
  }
}

export default Sidebar