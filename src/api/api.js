import axios from 'axios'

let BASE_URL
if (process.env.NODE_ENV === 'development') {
  BASE_URL = 'http://192.168.197.1:3001'
} else if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'http://39.108.122.248:8086'
}
// 传入 blog id 获取文章信息
export function getDetail (id) {
  return axios({
    method: 'get',
    url: `${BASE_URL}/api/getDetail`,
    params: {
      id
    }
  })
}

export function register (username, password, nickname) {
  return axios({
    method: 'post',
    url: `${BASE_URL}/user/register`,
    data: {
      username,
      password,
      nickname
    }
  })
}

export function login (username, password) {
  return axios({
    method: 'post',
    url: `${BASE_URL}/user/login`,
    data: {
      username,
      password
    },
    withCredentials: true // 难道不设置这个 server 端的 set-cookie 也无效？
  })
}

export function getPartArticles () {
  return axios({
    method: 'get',
    url: `${BASE_URL}/api/getPartArticles`,
  })
}

export function getPartWriters () {
  return axios({
    method: 'get',
    url: `${BASE_URL}/api/getPartWriters`,
  })
}

// 通过 nickname 获取对应作者信息
export function getUserInfo (nickname) {
  return axios({
    method: 'get',
    url: `${BASE_URL}/api/getUserInfo`,
    params: {
      nickname
    }
  })
}

export function getUserArticles (username) {
  return axios({
    method: 'get',
    url: `${BASE_URL}/api/getUserArticles`,
    params: {
      username
    }
  })
}

// 上传文章
export function postArticle (title, author, content, abstract) {
  return axios({
    method: 'post',
    url: `${BASE_URL}/api/postArticle`,
    data: {
      title,
      author,
      content,
      abstract
    }
  })
}

// 用于自动登录
export function autoLogin () {
  return axios({
    method: 'get',
    url: `${BASE_URL}/user/autoLogin`,
    withCredentials: true // 注意 axios 默认是不携带 cookie 的！！！！！
  })
}