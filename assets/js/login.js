$(function () {
  // 点击去注册账号的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  // 点击去登录账号的链接
  $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })
  // 从layui中获取form对象
  var form = layui.form
  var layer = layui.layer

  form.verify({
    // 自定义pwd校验规则
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    repwd: function (value) {
      // 通过形参拿到确认密码框的内容,还需密码框的内容,然后进行一次等于的判断,如果判断失败,则return一个错误消息
      var pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致!'
      }
    }
  })

  // 监听注册表单的提交事件
  $('#form_reg').on('submit', function (e) {
    e.preventDefault()
    // 发起ajax请求
    var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
    $.post('/api/reguser', data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message, { icon: 5 })
      }
      layer.msg('注册成功,请登录!', { icon: 6 })
      // 模拟人的点击行为
      $('#link_login').click()
    })
  })
  // 监听登录表单的提交事件
  $('#form_login').submit(function (e) {
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      // 快速获取表单中的数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登录失败!')
        }
        layer.msg('登录成功!')
        // 将登录成功得到的token字符串保存到localstorage中
        localStorage.setItem('token',res.token)
        // 跳转后台主页
        location.href='/index.html'
      }

    })
  })
})