$(function() {


    var layer = layui.layer;
    var form = layui.form;


    initCate();
    // 初始化富文本编辑器
    initEditor();



    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg("获取文章分类失败！");
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                // 动态添加的元素，是无法监听到的，一定要调用form.render才可
                form.render();
            }
        })
    }




    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)




    // 为选择封面的按钮绑定点击事件
    $("#btnChooseImage").on("click", function() {
        $("#coverFile").click();
    })



    // 为隐藏文件选择框绑定change事件，获取用户选择的文件列表
    $("#coverFile").on("change", function(e) {
        // 获取到文件的列表数组
        var files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return;
        }
        // 根据文件创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })




    // 定义文章的发布状态
    var art_state = "已发布";


    // 为存为草稿按钮绑定点击事件处理函数
    $("#btnSave2").on("click", function() {
        art_state = "草稿";
    })


    // 为form表单绑定submit事件
    $("#form-pub").on("submit", function(e) {
        // 1. 阻止表单的默认提交
        e.preventDefault();
        // 2. 基于form表单,快速创建一个FormData对象
        // FormData是原生的，应该把jQuery对象转换成原生对象
        var fd = new FormData($(this)[0]);
        // 3. 将文章的发布状态存在fd中
        fd.append("state", art_state);
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象（blob）存储到fd中
                fd.append("cover_img", blob);
                // 6. 发起ajax数据请求（定义一个发布文章的方法）
                publishArticle(fd);
            })
    });



    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            // 注意：向服务器提交FormData格式的数据必须添加以下两个属性（否则会失败）
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("发布文章失败！");
                }
                layer.msg("发布文章成功！");
                // 发表文章成功后，跳转到文章列表页
                location.href = "/dashijian/article/art_list.html";
            }
        })
    }

})