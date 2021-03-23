// 这个文件用于路由模块的封装
// express中的路由：就是指用户请求与处理函数之间的映射，说白了就是某个用户请求需要调用某个处理函数来处理
// 我们这个项目到底有那些请求，后台要制定规则
const express = require('express')
const router = express.Router()
const handler = require('./handler')
// 查询：get   编辑+新增 ：post  删除：get/post

// 1.响应所有英雄数据: get /getalldata
router.get('/getalldata', (req, res) => {
  handler.getalldata(req, res)
})
// 2.实现文件上传: post  /uploadFile
router.post('/uploadFile', (req, res) => {
  handler.uploadFile(req, res)
})
// 3.实现用户数据的新增: post  /add
router.post('/add', (req, res) => {
  handler.add(req, res)
})
// 4.根据id获取英雄数据: get  /getHeroById
router.get('/getHeroById', (req, res) => {
  handler.getHeroById(req, res)
})
// 5.编辑用户数据: post /edit
router.post('/edit', (req, res) => {
  handler.edit(req, res)
})
// 6.实现英雄数据的删除:get /delete
router.get('/delete', (req, res) => {
  handler.delete(req, res)
})
// 7.响应登陆页面  get /login
router.get('/login', (req, res) => {
  handler.getLoginPage(req, res)
})
// 8.实现登陆验证：post /login
router.post('/login', (req, res) => {
  handler.login(req, res)
})

// 暴露
module.exports = router
