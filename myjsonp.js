
const express = require('express')
const cors = require('cors')

const app = express()
// 为了配合前台页面已经写好的效果，我们这里将端口设置为3002
app.listen(3008, () => {
  console.log('http://127.0.0.1:3008');
})

app.use(cors())
// 实现跨域资源共享
// 通过中间件语法实现
// app.use((request, response, next) => {
//   // 设置 CORS 跨源资源共享,*代表允许所有源进行跨域请求
//   response.setHeader('Access-Control-Allow-Origin', '*');
//   // 中间件记得 next()
//   next();
// });


app.get('/getdata', (req, res) => {
  // res.end('test(1)')
  // let fn = req.query.callback
  let list = [
    { name: 'jack', age: 20 },
    { name: 'rose', age: 30 }
  ]
  // res.end(`${fn}(${JSON.stringify(list)})`)
  res.end(JSON.stringify(list))
})