$(function () {
  // 获取用户基本信息
  getUserinfo()


  var layer = layui.layer
  $('#btnlogout').on('click', function () {
    // 提示用户是否确认退出
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
      //do something
      // 1.清token
      localStorage.removeItem('token')
      // 2.跳转登录
      location.href = '/login.html'
      layer.close(index);
    });
  })


  function getUserinfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      // 请求头配置对象
      // headers: {
      //   Authorization: localStorage.getItem('token') || ''
      // },
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('获取用户信息失败!')
        }
        // 调用渲染头像函数
        renderAvator(res.data)
      },
      // 无论成功还是失败都调用complete函数
      // complete: function (res) {
      //   // console.log('执行了complete函数')
      //   // console.log(res)
      //   // 在complete回调函数中,可以使用res.responseJSON拿到服务器响应回来的数据
      //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      //     // 强制清空token然后调转登录页
      //     localStorage.removeItem('token')
      //     location.href = '/login.html'
      //   }
      // }
    })
  }
  function renderAvator(user) {
    // 1.获取用户名称
    var name = user.nickname || user.username
    // 2.设置欢迎文本
    $('#welcome').html(`欢迎&nbsp&nbsp${name}`)
    // 3.按需渲染用户头像
    if (user.user_pic !== null) {
      // 3.1渲染头像
      $('.layui-nav-img').attr('src', user.user_pic).show()
      $('.text-avator').hide()
    } else {
      $('.layui-nav-img').hide()
      var first = name[0].toUpperCase()
      $('.text-avator').html(first).show()
    }
  }





})