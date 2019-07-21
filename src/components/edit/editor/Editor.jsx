import React, { Component } from 'react'
import { postArticle, autoLogin } from '../../../api/api'
import { connect } from 'react-redux' // 与 store 连接
import { actions } from '../../../store/home'
import { withRouter } from 'react-router-dom' // 用 withRouter 高阶组件来连接使得子组件可以调用 this.props.history.push() 等方法
import './Editor.scss'

// 该组件负责富文本编辑器的逻辑和一些样式
class Editor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editor: null,
      title: '',
      author: ''
    }

    this.titleChange = this.titleChange.bind(this)
  }

  // 自定义菜单配置
  configureMenu () {
    this.editor.customConfig.menus = [
      'head',  // 标题
      'bold',  // 粗体
      'fontSize',  // 字号
      'fontName',  // 字体
      'italic',  // 斜体
      'underline',  // 下划线
      'strikeThrough',  // 删除线
      'foreColor',  // 文字颜色
      'backColor',  // 背景颜色
      'link',  // 插入链接
      'list',  // 列表
      'justify',  // 对齐方式
      'quote',  // 引用
      'emoticon',  // 表情
      'image',  // 插入图片
      'table',  // 表格
      'video',  // 插入视频
      'code',  // 插入代码
      'undo',  // 撤销
      'redo'  // 重复
    ]
  }

  // 配置图片上传
  configureImgUpload () {
    this.editor.customConfig.uploadImgServer = '/admin.php/Upload/wang_editor';  // 上传图片到服务器
    // 3M
    this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
    // 限制一次最多上传 5 张图片
    this.editor.customConfig.uploadImgMaxLength = 1;
    // 自定义文件名
    this.editor.customConfig.uploadFileName = 'editor_img';
    // 将 timeout 时间改为 3s
    this.editor.customConfig.uploadImgTimeout = 5000;

    this.editor.customConfig.uploadImgHooks = {
        before: function (xhr, editor, files) {
            // 图片上传之前触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

            // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
            // return {
            //     prevent: true,
            //     msg: '放弃上传'
            // }
            // alert("前奏");
        },
        success: function (xhr, editor, result) {
            // 图片上传并返回结果，图片插入成功之后触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
            // var url = result.data.url;
            // alert(JSON.stringify(url));
            // editor.txt.append(url);
            // alert("成功");
        },
        fail: function (xhr, editor, result) {
            // 图片上传并返回结果，但图片插入错误时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
            alert("失败");
        },
        error: function (xhr, editor) {
            // 图片上传出错时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
            // alert("错误");
        },
        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
        customInsert: function (insertImg, result, editor) {
            // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
            // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
            // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
            var url = result.data[0];
            insertImg(url);
            // result 必须是一个 JSON 格式字符串！！！否则报错
        }
    }
  }

  // 设置编辑器内容
  configureEditorContent () {
    // 设置内容
    // editor.txt.html(content);
    // 第六步，获取内容

    // // 获取内容
    // var content = editor.txt.html();
  }

  // 将标题内容存入 state
  titleChange (e) {
    this.setState({
      title: e.target.value
    })
  }

  componentDidMount() {
    let self = this
    // 自动登录，获取用户信息后存进 store 以供其他组件使用
    autoLogin().then(res => {
      if (res.data.errno === -1) { // 如果未登录不允许写文章
        window.alert('登录后才能写文章')
        this.props.history.push('/login')
      } else {
        const info = res.data.data
        this.setState({
          author: info[0].nickname
        })
        this.props.saveUserInfo(info[0])
      }
    })

    let loadCDN = document.createElement('script')
    loadCDN.src = 'https://unpkg.com/wangeditor@3.1.1/release/wangEditor.min.js'
    document.getElementsByTagName('head')[0].appendChild(loadCDN)
    // 需要等到 script 加载完成后再挂载到DOM节点，有个问题就是只能挂载在最外层的节点
    loadCDN.onload = function () {
      let E = window.wangEditor
      let editor = new E(document.getElementById('editor'))
      editor.create()
      
      document.getElementsByClassName('btn-submit')[0].addEventListener('click', function () {
        let abstract = editor.txt.text() // 纯文本内容作为摘要
        abstract = abstract.length > 100 ? abstract.substr(0, 100) + '...' : abstract + '...'
        // 获取 nickname(author), title 后一同上传
        const htmlContent = editor.txt.html()
        const title = self.state.title
        const author = self.state.author
        postArticle(title, author, htmlContent, abstract).then(() => {
          window.alert('文章发表成功')
          self.props.history.push('/')
        })
      }, false)
    }
    
  }

  render() {
    return (
      <React.Fragment> {/* 这样不会有多余的DOM元素 */}
        <div className="title-wrap">
          <input className="input-text" type="text" placeholder="输入文章标题" onChange={this.titleChange} />
          <span className="max-length">0/100</span>
        </div>
        <div id="editor"></div>
        <div className="btn-wrap">
          <div className="btn-submit">提交</div>
          <div className="btn-clear">清空</div>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  userinfo: state.home.userinfo
})

const mapDispatchToProps = dispatch => ({
  saveUserInfo (userinfo) {
    dispatch(actions.saveUserInfo(userinfo))
  }
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Editor))