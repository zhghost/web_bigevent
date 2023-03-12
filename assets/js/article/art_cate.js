$(function() {


    var layer = layui.layer;
    var form = layui.form;


    initArtCateList();


    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                // console.log(res);
                var htmlStr = template("tpl-table", res); // 这里是res不是res.data
                $("tbody").html(htmlStr);
            }
        })
    };


    // 定义添加类别按钮弹出层索引
    var indexAdd = null;

    // 为添加类别按钮绑定点击事件
    $("#btnAddCate").on("click", function() {
        indexAdd = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "添加文章分类",
            content: $("#dialog-add").html()
        });

    });



    // 通过代理的形式为form-add表单绑定submit事件（因为form表单是动态生成的，所有文件加载完成后还没有form表单，也就无法拿到form表单的id），绑定到body身上
    $("body").on("submit", "#form-add", function(e) {
        e.preventDefault();
        // console.log("ok");
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("新增分类失败！");
                }
                // 成功，重新获取文章分类列表
                initArtCateList();
                layer.msg("新增分类成功！");
                // 根据索引indexAdd关闭弹出层
                layer.close(indexAdd);
            }
        })
    });





    // 通过代理的形式为form-edit表单绑定submit事件（因为form表单是动态生成的，所有文件加载完成后还没有form表单，也就无法拿到form表单的id），绑定到body身上
    $("body").on("submit", "#form-edit", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    // console.log(res);
                    return layer.msg("更新分类数据失败！");
                }
                layer.msg("更新分类数据成功！");
                // 关闭弹出层
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    });



    // 定义编辑按钮弹出层索引
    var indexEdit = null;


    // 通过代理的形式为编辑（btn-edit）按钮绑定点击事件，这个按钮在tbody中
    $("tbody").on("click", ".btn-edit", function(e) {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "修改文章分类",
            content: $("#dialog-edit").html()
        });

        var id = $(this).attr("data-id");
        // console.log(id);
        // 由id可以知道编辑的是哪一行，
        // 发起请求获取对应分类（行）的数据
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function(res) {
                form.val("form-edit", res.data);
            }
        })
    });





    // 通过代理的形式为删除（btn-delete）按钮绑定点击事件，这个按钮在tbody中
    $("tbody").on("click", ".btn-delete", function() {
        // console.log("OKKKK");

        var id = $(this).attr("data-id");
        // 由id可以知道删除的是哪一行，
        // 发起请求获取对应分类（行）的数据

        // 提示用户是否要删除
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        // console.log(res);
                        return layer.msg("删除分类失败！");
                    }
                    layer.msg("删除分类成功！");
                    // 只有成功之后才关闭层
                    layer.close(index);
                    // 重新获取文章分类列表
                    initArtCateList();
                }
            });

        });
    })



});