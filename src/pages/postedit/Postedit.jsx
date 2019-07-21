import React, { Component } from 'react'
import './Postedit.scss'
import Editor from '../../components/edit/editor/Editor'
import Sidebar from '../../components/edit/sidebar/Sidebar'

// 该组件整体为编辑文章页面，在组件内部书写相关样式这里不写，这样更好地分离和控制
class Postedit extends Component {

  render() {
    return (
        <main className="editor-container">
          <div className="editor-left">
            <Sidebar />
          </div>
          <div className="editor-right">
            <Editor />
          </div>
          
        </main>
    )
  }
}

export default Postedit