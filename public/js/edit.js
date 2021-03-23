$(function () {
  // 1.获取参数
  // 下面这种方式权宜之计，它只适合只有一个参数的情况下，但是现实的开发场景中，多参数的情况比比皆是
  // 通用的作法是将key=value&key=value这种格式的字符串转换为对象
  // let id = location.search.split('=')[1]
  let id = itcast.getParameter(location.search).id
  console.log(id)

  // 2.根据参数查询用户数据，进行默认数据的渲染
  // 13："英雄"案例根据ID查询单个英雄数据
  // - 请求路径：http://127.0.0.1:3002/getHeroById
  // - 请求方法：get
  $.ajax({
    url: 'http://127.0.0.1:3002/getHeroById',
    data: { id }, // ES6的新语法，如果对象的key和值同名，那么就只需要写一个
    dataType: 'json',
    success: function (res) {
      console.log(res)
      if (res.code == 200) {
        // 生成动态结构
        $('.usercontent').html(template('usercontentTemp', res.data))
      }
    }
  })

  // 实现文件上传
  // 实现文件上传，选择好文件就会触发change事件
  // jq在绑定事件的时候，如果元素不存在，不会报错咧，但是事件绑定不会成功
  // 使用事件委托来为img元素绑定事件
  $('.usercontent').on('change', '#img', function () {
    // 1.使用formdata收集文件数据
    let myfile = $('#img')[0].files[0]
    // 我们现在只是实现文件的上传，并不需要将表单的其它元素的数据也传递过去，所以不使用传入整个表单的方式来收集数据
    let formdata = new FormData()
    // 将文件数据追加到formdata中
    formdata.append('img', myfile)

    // 2.ajax请求，以formdata做为参数
    // 8：图片上传(英雄案例中图片上传也是使用这个)
    // - 请求路径：http://127.0.0.1:3002/uploadFile
    // - 请求方法：post

    $.ajax({
      type: 'post',
      url: 'http://127.0.0.1:3002/uploadFile',
      data: formdata,
      // 3.注意要设置两个属性为false:processData   contentType
      processData: false, // 不要让ajax进行数据的处理
      contentType: false,// 不要让ajax进行参数的编码处理
      dataType: 'json',
      success: function (res) {
        console.log(res)
        if (res.code == 200) {
          // 实现预览
          $('#photo').attr('src', 'http://127.0.0.1:3002/images/' + res.img)
          // 将图片的名称存储到隐藏域
          $('[name=img]').val(res.img)
        }
      }
    })
  })

  // 实现用户编辑
  // 11："英雄"案例实现用户编辑提交
  // - 请求路径：http://127.0.0.1:3002/edit
  // - 请求方法：post

  $('#sub').on('click', function () {
    console.log($('#myform').serialize())
    $.ajax({
      type: 'post',
      url: 'http://127.0.0.1:3002/edit',
      data: $('#myform').serialize(),
      dataType: 'json',
      success: function (res) {
        if (res.code == 200) {
          alert('编辑成功')
          location.href = './index.html'
        }
      }
    })
  })

})