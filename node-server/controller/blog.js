const { exec } = require('../db/mysql')
const xss = require('xss')

const getArticleList = () => {
  const sql = `SELECT * FROM articles`
  return exec(sql)
}

const getWriterList = () => {
  const sql = `SELECT * FROM userinfo`
  return exec(sql)
}

const getDetail = id => {
  const sql = `SELECT * FROM articles WHERE id = ${id}`
  return exec(sql)
}

const getUserInfo = nickname => {
  const sql = `SELECT * FROM userinfo WHERE nickname = '${nickname}'`
  return exec(sql)
}

const getUserInfoByUsername = username => {
  const sql = `SELECT * FROM userinfo WHERE username = '${username}'`
  return exec(sql)
}
// 个人主页根据用户名 / 昵称？来获取用户的文章
const getUserArticles = (author, keyword) => {
  let sql = `SELECT * FROM articles WHERE 1 = 1`
  if (author) {
    sql += `AND author = '${author}'`
  }
  if (keyword) {
    sql += `AND title LIKE '%${keyword}%'` // 目前没用到关键词
  }
  return exec(sql)
}

const postArticle = (title, author, content, createTime, abstract) => {
  // 方便起见, cover 随机几个吧，做个图片上传?
  const covers = [
    'http://cmk1018.cn/wp-content/uploads/2019/05/罪恶王冠6.jpg', 'http://cmk1018.cn/wp-content/uploads/2019/05/flower-8.jpg',
    'http://cmk1018.cn/wp-content/uploads/2019/05/59897c2fe7bce77b1b837c95.jpg', 'http://cmk1018.cn/wp-content/uploads/2019/05/59ccadade7bce729bf148965.png',
    'http://cmk1018.cn/wp-content/uploads/2019/04/aotu-7.jpg', 'http://cmk1018.cn/wp-content/uploads/2019/04/17.jpg',
    'http://cmk1018.cn/wp-content/uploads/2019/04/4.jpg'
  ]

  const coverurl = covers[Math.floor(Math.random() * 7)]
  const sql = `INSERT INTO articles (title, content, createtime, author, coverurl, abstract) VALUES ('${title}', '${content}', ${createTime}, '${author}', '${coverurl}', '${abstract}')`
  return exec(sql)
}

// 更新文章，传入 title content
const updateArticle = (id, blogData = {}) => {
  // id 就是要更新的博客的id
  // blogData 是一个博客对象，包含title content属性
  const title = xss(blogData.title) // xss 防范
  const content = blogData.content

  const sql = `UPDATE articles SET title='${title}', content='${content}' WHERE id=${id}`

  return exec(sql).then(updateData => {
    if (updateData.affectedRows > 0) { // 影响的行数来判断更新是否成功
      return true
    }
    return false
  })
}

// 删除文章，传入 id
const deleteArticle = (id, author) => {
  // id就是要删除博客的id
  // 也可以考虑软删除
  const sql = `DELETE FROM blogs WHERE id=${id} AND author='${author}'` // 加一个用户名保证不会误删别人的文章
  return exec(sql).then(deleteData => {
    if (deleteData.affectedRows > 0) { // 和 update 的数据结构一样
      return true
    }
    return false
  })
}
module.exports = {
  getArticleList,
  getWriterList,
  getDetail,
  getUserInfo,
  postArticle,
  updateArticle,
  deleteArticle,
  getUserArticles,
  getUserInfoByUsername
}