// 每次调用$.get()或$.post()的时候.会调用ajaxPrefilter这个函数,在这个函数中可以拿到给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  // console.log(options.url)
  options.url = 'http://www.liulongbin.top:3007' + options.url

  // 统一为有权限的接口设置请求头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }
  // 全局统一挂载complete回调函数
  options.complete = function (res) {
    // console.log('执行了complete函数')
    // console.log(res)
    // 在complete回调函数中,可以使用res.responseJSON拿到服务器响应回来的数据
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 强制清空token然后调转登录页
      localStorage.removeItem('token')
      location.href = '/login.html'
    }
  }
})