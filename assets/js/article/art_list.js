$(function() {


    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;


    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 当前页面（默认值）
        pagesize: 2, // 每页显示几条数据（默认值）
        cate_id: "", // 文章分类的 Id
        state: "" // 文章的状态，可选值有：已发布、草稿
    };




    initTable();
    initCate();




    // 定义美化时间的过滤器
    template.defaults.imports.dateFormat = function(date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    };


    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : "0" + n;
    }








    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败！");
                }
                console.log(res);
                // 使用模板引擎渲染页面的数据
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr); // 获取的res，data是空的，所以不显示


                // 调用渲染分页函数
                renderPage(res.total);
            }
        });
    };






    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类失败！");
                }
                // 调用模板引擎渲染分类的可选性
                var htmlStr = template("tpl-cate", res);
                // console.log(htmlStr);
                $("[name=cate_id]").html(htmlStr); // 这里之后并未渲染所有分类下拉框，这是因为，art_list.html文件从上到下执行，执行到template-web.js时，<select name="cate_id"></select>内部是没有内容的，所以渲染不出来，而且还未执行当前文件（因为当前js(art_list.js),需要依赖template-web.js，所以必须写在template-web.js下面），等到执行art_list.js时，template-web.js已经执行过了，所以无法渲染



                // 解决：
                // 通知layui，重新渲染表单区域的UI结构
                form.render();
            }
        });
    };




    // 为筛选表单绑定submit事件
    $("#form-search").on("submit", function(e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $("[name=cate_id]").val();
        var state = $("[name=state]").val();
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件重新渲染表格数据
        initTable();
    });




    // 定义渲染分页的方法（先获取文章列表数据，才能知道当前是哪一页，当前页共几条数据，总共几条数据，根据这些才能渲染分页。不然不知道共几条数据，每页显示几条数据，无法分页，所以需要在initTable方法成功返回数据后，调用renderPage方法）
    function renderPage(total) {
        // console.log(total);
        // 调用laypage.render方法来渲染分页的结构
        laypage.render({
            elem: "pageBox", // 分页容器的id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 默认显示第几页
            // layout:[]是自定义排版
            layout: ["count", "limit", "prev", "page", "next", "skip"], // limit（是条目选项区域的意思）
            limits: [2, 3, 5, 10], // limits是每页条数的选择项（上面limit默认选项），根据需要改写
            // 分页发生切换时触发jump回调
            // 触发jump回调的方式有两种：
            // 1. 点击页码的时候会触发jump回调
            // 2. 调用laypage.render()方法，也会触发jump回调
            // jump: function(obj) {
            jump: function(obj, first) {
                // 可以first的值，来判断是通过哪种方式触发的jump回调
                // 如果first的值是true，证明是方式2触发的，否则是方式1触发的
                console.log(first);
                // console.log(obj.curr);
                // 把点击的页码值（点不同的页码实现不同页码之间的切换）赋值给q这个查询参数对象
                q.pagenum = obj.curr;
                // 把最新的条目数（点击下拉选项，选择每页显示几条数据），赋值到q这个查询参数对象的 pageSize属性中；（切换每页显示几条数据的下拉选项也会触发jump回调）
                q.pagesize = obj.limit;
                // 根据最新的q获取对应的数据列表，并渲染表格
                // initTable();这里直接调用会发生死循环（A函数里调B函数，又在B函数里调A函数）
                // 解决：
                // 当laypage.render()方法，触发jump回调时first=true，当点击页码的时候触发jump回调时first=undefined，所以在点击页码时再调用initTable函数
                if (!first) {
                    initTable();
                }
            }
        })
    }




    // 通过代理的方式，为删除按钮绑定点击事件处理函数（只有提交才阻止默认行为）
    $("tbody").on("click", ".btn-delete", function() {
        // 获取删除按钮的个数
        var len = $(".btn-delete").length;
        console.log("按钮个数：" + len);
        // 获取文章的id
        var id = $(this).attr("data-id");
        // 询问用户是否删除数据
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除文章失败！");
                    }
                    layer.msg("删除文章成功！");
                    // 假设共有4页数据，当删完第4页的数据那一刻仍然处在第4页，重新渲染列表，也是渲染第4页的数据，当然不会有表格
                    // 解决：
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据，如果没有剩余的数据了，则让页码 -1 之后，再重新调用initTable()

                    // 如果len的值等于1，那就证明删除完毕之后，页面上没有任何数据了
                    if (len === 1) {
                        // 页码值最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    // 重新渲染列表数据
                    initTable();
                }
            })

            layer.close(index);
        });
    })


})