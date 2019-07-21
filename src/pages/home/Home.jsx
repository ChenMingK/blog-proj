import React, { Component } from 'react'
import Slider from '../../components/home/slider/Slider' // 暂时不用@，默认的 webpack 配置貌似有问题
import ArticleList from '../../components/home/articleList/ArticleList'
import Topic from '../../components/home/topic/Topic'
import Advertise from '../../components/common/advertise/Advertise'
import RecommendWriter from '../../components/home/recommendWriter/RecommendWriter'
import { connect } from 'react-redux' // 与 store 连接
import { actions } from '../../store/home'
import { getPartArticles, getPartWriters, autoLogin } from '../../api/api'
import './Home.scss'

class Home extends Component {

  constructor(props) {
    super(props)

    this.state = {
      offsetTop: 0
    }
    
    this.handleScroll = this.handleScroll.bind(this) // 一些 DOM 事件往往需要绑定 this，否则其 this 指向的是 DOM 元素而不是该组件
  }

  // 利用元素的 scrollTop 属性，另外添加过渡属性然后又删掉防止再次滚动出现问题
  scrollToTop() {
      // window.scrollTo(0, 0) // scrollTo(xpos,ypos) 无效?
      let app = document.getElementsByClassName('App')[0]
      app.scrollTop = 0 // 我们直接在 reset.scss 里利用 scroll-behavior 属性来实现 !!!
  }

  handleScroll(e) {
    this.setState({
      offsetTop: e.target.scrollTop
    })
  }

  componentDidMount() {
    // 滚动滑轮触发 scrollFunc 方法  // ie 谷歌  
    let app = document.getElementsByClassName('App')[0]
    app.addEventListener('scroll', this.handleScroll, false)

    getPartArticles().then(res => {
      this.props.saveArticleList(res.data.data)
    })

    getPartWriters().then(res => {
      this.props.saveWriterList(res.data.data)
    })

    // 首页自动登录，获取用户信息后存进 store 以供其他组件使用
    autoLogin().then(res => {
      if (res.data.errno === -1) {
        return
      }
      const info = res.data.data
      this.props.saveUserInfo(info[0])
    })
  }
  // 记得删除添加的事件监听器，否则会报内存泄漏
  componentWillUnmount() {
    let app = document.getElementsByClassName('App')[0]
    app.removeEventListener('scroll', this.handleScroll, false)
  }

  render() {
    return (
      <React.Fragment>
        <main className="home-container">
          <div className="left-container">
            <Slider />
            <ArticleList articleList = {this.props.articleList} /> {/* 直接传递对象不好? */}
          </div>
          <div className="right-container">
            <Topic />
            <Advertise />
            <RecommendWriter writerList = {this.props.writerList} />
          </div>
        </main>
        <div className={`btn-backtotop ${this.state.offsetTop > 200 ? 'active' : null}`} onClick={this.scrollToTop}>
          <i className="icon-up-arrow"></i>
          <div className="tooltip">回到顶部</div>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  articleList: state.home.articleList,
  writerList: state.home.writerList
})

const mapDispatchToProps = dispatch => ({
  saveArticleList (articleList) {
    dispatch(actions.saveArticleList(articleList))
  },
  saveWriterList (writerList) {
    dispatch(actions.saveWriterList(writerList))
  },
  saveUserInfo (userinfo) {
    dispatch(actions.saveUserInfo(userinfo))
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(Home)