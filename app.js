// 1.创建服务器
const express = require('express')
const path = require('path')
const router = require('./router')
const expressJWT = require('express-jwt')

// 引入body-parser
const bodyParser = require('body-parser')

const app = express()
// 为了配合前台页面已经写好的效果，我们这里将端口设置为3002
app.listen(3002, () => {
  console.log('http://127.0.0.1:3002');
})
// 2.托管首页
app.use('/', express.static(path.join(__dirname, '/views')))
// 3.托管页面中的静态资源
app.use(express.static('public'))

// 添加中间件的引入，use之后，可以通过query或者body获取参数，以下代码基本上包含了所有的使用场景
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// 添加对token的解析和排除不需要token验证的路由
// 将验证写在静态资源托管之后，否则会让静态资源的请求也经过token验证
// 6.0.0之后，一定要设置算法：algorithms: ['HS256'] }
// app.use(expressJWT({ secret: 'hero', algorithms: ['HS256'] }).unless({ path: ['/login'] }))


// 明确的安装路由功能
app.use(router)

// 错误处理中间件在写在路由注册之后
app.use((err, req, res, next) => {
  console.log(err.name);
  // 这次错误是由 token 解析失败导致的
  if (err.name === 'UnauthorizedError') {
    return res.send({
      code: 401,
      message: '无效的token',
    })
    // throw new Error('UnauthorizedError')
  } else {
    res.send({
      code: 500,
      message: '未知的错误',
    })
  }
})

