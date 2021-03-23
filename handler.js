const path = require('path')
const fs = require('fs')
// 这个模块实现真正的业务处理
const mysql = require('mysql')
// 引入实现文件上传的第三方模块
const formidable = require('formidable')
const jwt = require('jsonwebtoken')
// 创建一个连接并添加配置
const conn = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'mybase'
})

module.exports = {
  // 1.响应所有英雄数据: get /getalldata
  getalldata: function (req, res) {
    console.log('------');
    console.log(req.user);
    console.log('------');
    // 创建sql语句
    let sql = 'select * from heros where isdel = 0'
    // 调用方法执行sql语句并接收处理结果
    conn.query(sql, (error, results) => {
      if (error) {
        res.json({
          code: 500,
          msg: '数据查询失败，请重试'
        })
      } else {
        res.json({
          code: 200,
          msg: '数据查询成功',
          // 一定要记得将数据响应，查询所获取的结果是数组  data这个键是我自己定义的
          data: results
        })
      }
    })
  },
  // 2.实现文件上传
  uploadFile: function (req, res) {
    // 创建文件上传对象
    const form = formidable()
    // const form = new formidable.IncomingForm({})
    // 添加文件上传的配置
    // 1.配置上传文件的存放目录,这里注意，一定要设置绝对路径
    form.uploadDir = __dirname + '/public/images'
    // 2.配置保留扩展名
    form.keepExtensions = true

    // 3.实现文件上传
    // req:上传文件需要获取到用户所传递的数据及其它的相关信息
    // 上传完成之后，就自动调用所传入的回调函数，同时给这个回调传入三个参数
    // err:上传文件失败的错误信息对象
    // fields:本次传递普通的键值对,它是一个对象
    // files：这是当前上传文件的原始信息和上传成功之后的服务器端的文件信息
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err);
        res.json({ code: 500, msg: '文件上传失败' })
      } else {
        // console.log(fields);
        // console.log('------------------')
        // console.log(files);
        // console.log('------------------')
        // console.log(files.img.path);
        // console.log('------------------')
        // console.log(path.basename(files.img.path));
        res.json({
          code: 200,
          msg: '文件上传成功',
          // path.basename:可以获取路径的最后一部分
          img: path.basename(files.img.path)
        })
      }
    })
  },
  // 3.实现用户数据的新增
  add: function (req, res) {
    // 接收参数
    console.log(req.body);
    if (!req.body.name) { // 说明name没有  {name:'a',gender:'b',img:'c'}
      // insert into heros(name,gender,img) values('a','b','c')
      return res.json({ code: 400, msg: 'name参数不正确' })
    }
    // 创建sql语句  ?参数占位是mysql模块提供的，它会根据你所传入的数据对象的属性，更新表中的对应的字段值
    let sql = 'insert into heros set ?'
    // 发起数据请求
    conn.query(sql, req.body, (err) => {
      if (err) {
        console.log(err);
        res.json({ code: 500, msg: '新增失败' })
      } else {
        res.json({ code: 200, msg: '新增成功' })
      }
    })
  },
  // 4.根据id获取英雄数据
  getHeroById: function (req, res) {
    // 接收参数id，express中接收get方式所传递的参数，通过req.query,它是一个对象
    console.log(req.query);
    let id = req.query.id
    // 创建sql语句
    let sql = 'select * from heros where id = ' + id
    // 数据请求
    conn.query(sql, (err, results) => {
      if (err) {
        console.log(err);
        res.json({ code: 500, msg: '数据查询失败' })
      } else {
        res.json({
          code: 200,
          msg: '数据查询成功',
          // 1.查询返回的是结果集，对应的数据类型是数组
          // 2.id是唯一的，所以如果查询，只能返回1条数据，意味着我们可以在后台获取到这数据对象进行响应,而不是直接响应数组
          data: results[0]
        })
      }
    })
  },
  // 5.实现用户数据的编辑
  edit: function (req, res) {
    // 接收参数
    console.log(req.body);
    if (!req.body.id) {
      return res.json({ code: 400, msg: 'id参数不正确' })
    }
    // 创建sql语句
    let sql = 'update heros set ? where id = ?'
    // 数据请求
    conn.query(sql, [req.body, req.body.id], (err) => {
      if (err) {
        console.log(err);
        res.json({ code: 500, msg: '编辑失败' })
      } else {
        res.json({ code: 200, msg: '编辑成功' })
      }
    })
  },
  // 6.实现英雄数据的删除
  delete: function (req, res) {
    let id = req.query.id
    console.log(id);
    // 创建sql语句：我们使用软删除，软删除本质是一个更新操作，仅仅是修改数据的删除标记
    let sql = 'update heros set isdel = 1 where id = ' + id
    conn.query(sql, (err) => {
      if (err) {
        console.log(err);
        res.json({ code: 500, msg: '删除失败' })
      } else {
        res.json({ code: 200, msg: '删除成功' })
      }
    })
  },
  // 响应登陆页面
  getLoginPage: function (req, res) {
    fs.readFile(path.join(__dirname, '/views/login.html'), (err, data) => {
      if (err) return res.json({ code: 404 })
      res.end(data)
    })
  },
  // 实现登陆验证：post /login
  login: function (req, res) {
    let obj = req.body
    console.log(obj);
    // 根据用户名查询用户数据
    let sql = 'select * from manager where username = ?'
    conn.query(sql, [obj.username], (err, results) => {
      if (err) {
        res.json({ code: 500, msg: '服务器异常，请重试' })
      } else {
        // 判断根据用户名是否查询到了数据
        if (results.length > 0) {
          // 再判断密码
          if (results[0].password == obj.password) { // 密码匹配，登陆成功
            // 生成token
            // sign:就可以使用第三方模块生成token
            // sign(用户自定义数据，密钥，配置)
            // expiresIn:token有效期
            const token = jwt.sign({ username: results[0].username, classname: '广州前端59期' }, 'hero', { expiresIn: '3000s' })
            // 响应token到客户端
            res.json({ code: 200, msg: '登陆成功', token: token })
          } else {
            res.json({ code: 500, msg: '密码错误' })
          }
        } else { // 用户名不存在
          res.json({ code: 500, msg: '用户名不存在' })
        }
      }
    })
  }
}