$(function () {
  // 实现文件上传，选择好文件就会触发change事件
  $('#img').on('change', function () {
    console.log(111);
    // 1.使用formdata收集文件数据
    let myfile = $('#img')[0].files[0]
    // 我们现在只是实现文件的上传，并不需要将表单的其它元素的数据也传递过去，所以不使用传入整个表单的方式来收集数据
    let formdata = new FormData()
    // 将文件数据追加到formdata中
    formdata.append('img', myfile) // 文件
    // formdata.append('username', '我是58期的大佬') // 普通键值对

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
          // 将图片的名称存储到隐藏域,方便后期使用serialize直接获取数据
          $('[name=img]').val(res.img)
        }
      }
    })
  })


  // 实现用户数据的新增
  // 10："英雄"案例实现新增用户信息
  // - 请求路径：http://127.0.0.1:3002/add
  // - 请求方法：post

  $('#sub').on('click', function () {
    // let data = $('#myform').serialize()
    // console.log(data)
    $.ajax({
      type: 'post',
      url: 'http://127.0.0.1:3002/add',
      // serialize()可以收集指定表单中拥有name属性的表单元素的value值
      data: $('#myform').serialize(),
      dataType: 'json',
      success: function (res) {
        console.log(res)
        if (res.code == 200) {
          alert('新增成功')
          // 重新跳转到列表页
          location.href = './index.html'
        }
      }
    })
  })
})