$(function() {

    var layer = layui.layer;


    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比（裁剪框什么形状，不是图片区域时裁剪框）（1代表正方形）
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 给上传按钮绑定点击事件（点击时，触发文件选择框的点击事件）
    $("#btnChooseImage").on("click", function() {
        $("#file").click();
    })


    // 给文件选择框绑定change事件
    $("#file").on("change", function(e) {
        // console.log(e);
        // 获取用户选择的文件
        var files = e.target.files;
        console.log(files);
        if (files.length === 0) {
            return layer.msg("请选择照片！");
        }


        // 拿到用户选择的文件
        var file = e.target.files[0];
        // 根据选择的文件，创建一个URL地址
        var newImgURL = URL.createObjectURL(file);
        // 销毁旧的裁剪区、重设图片路径、创建新的裁剪区
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });



    // 点击确定按钮上传头像
    $("#btnUpload").on("click", function(e) {
        // 1.拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png'); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 2. 调用接口，把头像上传到服务器
        $.ajax({
            method: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("更换头像失败！");
                }
                layer.msg("更换头像成功！");
            }
        });
        // 重新获取用户信息
        window.parent.getUserInfo();
    })


});