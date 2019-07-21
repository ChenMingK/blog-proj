// 广告组件
import React, { Component } from 'react'
import './Advertise.scss'

class Advertise extends Component {
  constructor(props) {
    super(props)

    this.state = {
      imgOpacity: 0
    }
  }


  render() {
    return (
      <div className="advertise-wrap">
        <div className="top-wrap">
          <img alt="" src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1407202035,1955608583&fm=26&gp=0.jpg" />
          <div className="title">下载手机App</div>
          <div className="description">随时随地发现和创作内容</div>
          <div className="codeImg-wrap">
            <img alt="" src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1407202035,1955608583&fm=26&gp=0.jpg" />
          </div>
        </div>
        <div className="bottom-wrap">
          <img alt="" src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3333054251,3458078978&fm=15&gp=0.jpg" />
          <span className="advertise-text">广告</span>
        </div>
      </div>
    )
  }
}

export default Advertise