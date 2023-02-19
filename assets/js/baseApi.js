// 每次调用$.get()或$.post()的时候.会调用ajaxPrefilter这个函数,在这个函数中可以拿到给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  // console.log(options.url)
  options.url = 'http://www.liulongbin.top:3007' + options.url
})