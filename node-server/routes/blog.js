const express = require('express')
const xss = require('xss')
const router = express.Router()
const {
  getArticleList,
  getWriterList,
  getDetail,
  getUserInfo,
  postArticle
} = require('../controller/blog')

const { SuccessModel, ErrorModel } = require('../model/resModel')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' })
})

// Home 页获取文章列表
router.get('/getPartArticles', (req, res) => {
  const result = getArticleList()
  return result.then(data => {
    res.json(
      new SuccessModel(data)
    )
  })
})

// Home 页获取作者列表
router.get('/getPartWriters', (req, res) => {
  const result = getWriterList()
  return result.then(data => {
    res.json(
      new SuccessModel(data)
    )
  })
})

// Detai 页获取文章信息
router.get('/getDetail', (req, res) => {
  const id = req.query.id
  const result = getDetail(id)
  return result.then(data => {
    res.json(
      new SuccessModel(data[0]) // select 出来的是数组
    )
  })
})

// 通过 nickname 获取作者信息
router.get('/getUserInfo', (req, res) => {
  const nickname = req.query.nickname
  const result = getUserInfo(nickname)
  return result.then(data => {
    res.json(
      new SuccessModel(data[0])
    )
  })
})

// 上传文章 注意 xss 防范
router.post('/postArticle', (req, res) => {
  let { title, author, content, abstract } = req.body
  const createTime = Date.now()
  // 标题和内容做 xss 处理
  title = xss(title)
  content = xss(content)
  abstract = xss(abstract)
  const result = postArticle(title, author, content, createTime, abstract)
  return result.then(() => {
    res.json(
      new SuccessModel()
    )
  })
})
module.exports = router
