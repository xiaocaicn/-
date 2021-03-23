$(function () {
  // 实现页面的动态渲染
  // 9：“英雄”案例获取所有数据
  // - 请求路径：http://127.0.0.1:3002/getalldata
  // - 请求方法：get
  function init () {
    $.ajax({
      url: 'http://127.0.0.1:3002/getalldata',
      dataType: 'json',
      // headers:可以设置请求头，它是一个对象
      // headers: {
      //   'Authorization': 'Bearer ' + localStorage.getItem('mytoken_58')
      // },
      // xhr就是那个异步对象
      // beforeSend: function (xhr) {
      //   xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('mytoken_59'))
      // },
      success: function (res) {
        console.log(res)
        if (res.code == 200) {
          $('tbody').html(template('userlistTemp', res))
        }
        else if (res.code == 401) {
          alert(res.message)
          location.href = '/login'
        }
      }
    })
  }
  init()


  // 实现用户的删除
  // 12："英雄"案例实现删除单个用户
  // - 请求路径：http://127.0.0.1:3002/delete
  // - 请求方法：get

  $('tbody').on('click', '.userdel', function (e) {
    let data = $(this).data() // {id:1}
    if (confirm('是否真的需要删除？')) {
      $.ajax({
        url: 'http://127.0.0.1:3002/delete',
        data: data,
        // beforeSend: function (xhr) {
        //   xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('mytoken_59'))
        // },
        dataType: 'json',
        success: function (res) {
          console.log(res)
          if (res.code == 200) {
            alert('删除成功')
            // 刷新
            init()
          }
        }
      })
    }
  })
})