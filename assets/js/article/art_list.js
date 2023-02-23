$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage


  // 定义一个美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    const y = padZero(dt.getFullYear())
    const m = padZero(dt.getMonth() + 1)
    const d = padZero(dt.getDate())
    const hh = padZero(dt.getHours())
    const mm = padZero(dt.getMinutes())
    const ss = padZero(dt.getSeconds())

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

    function padZero(n) {
      return n > 9 ? n : '0' + n
    }
  }


  // 定义一个查询的参数对象,将来请求数据的时候,需要将请求参数对象提交服务器
  var q = {
    pagenum: 1,//页码值,默认请求第一页数据
    pagesize: 2,//每页显示几条数据
    cate_id: '',//文章发布的id
    state: '',//文章发布状态
  }

  initTable()
  initCate()
  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取失败!')
        }
        // layer.msg('获取成功!')
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        // 调用渲染分页方法
        renderPage(res.total)
      }
    })
  }


  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取失败!')
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res)
        // console.log(htmlStr)
        $('[name=cate_id]').html(htmlStr)
        // 通过layui重新渲染表单区域的UI结构
        form.render()
      }
    })
  }

  // 为筛选表单绑定submit事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    // 为查询参数对象q对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件,重新渲染表格的数据
    initTable()
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    laypage.render({
      elem: 'pageBox', //分页容器的ID
      count: total, //总数据条数
      limit: q.pagesize, //每页显示几条数据
      curr: q.pagenum, //默认显示哪一页
      layout: ['count', 'prev', 'page', 'next', 'skip', 'limit'],
      limits: [2, 3, 5, 10],
      jump: function (obj, first) {
        // 分页发生切换的时候触发jump回调
        // 只要调用laypage.render就会触发jump回调
        // console.log(obj);
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        // 根据最新的q获取对应的数据列表并渲染表格
        if (!first) {
          initTable()
        }
      }
    })

    // 事件委托绑定删除按钮的事件处理函数
    $('tbody').on('click', function () {
      var len = $('#btn-delete').length()
      var id = $(this).attr('data-id')
      // 询问用户是否要删除数据
      layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
        $.ajax({
          method: 'GET',
          url: '/my/article/deletecate/' + id,
          success: function (res) {
            if (res.status !== 0) {
              return layer.msg('删除文章失败!')
            }
            layer.msg('删除文章成功!')
            // 数据删完就判断当前页有无数据,没有就-1页再initTable()
            if (len === 1) {
              q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
            }
            initTable()
          }
        })

        layer.close(index)
      })
    })
  }





})