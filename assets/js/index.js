$(function() {
    // 调用getUserInfo函数获取用户的基本信息
    getUserInfo();
    var layer = layui.layer;
    // 退出
    $("#btnLogout").on("click", function() {
        // console.log("ok");
        // 弹出提示消息框，提示用户是否确认退出
        // 点击确定时执行回调函数
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // console.log("OK");
            // 清空本地存储的token
            localStorage.removeItem("token");
            // 跳转到登录页
            location.href = "./login.html";
            // 关闭confirm询问框
            layer.close(index);
        });
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // headers就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败！");
            }
            // 调用renderAvatar渲染用户的头像
            renderAvatar(res.data);
        },
        // 无论成功还是失败都会调用complete还是，成了先调用success再调用这个，失败先调用error还是，再调用这个函数
        // complete: function(res) {
        //     // console.log("执行了complete回调");
        //     // console.log(res);
        //     // 在complete回调函数中可以用res.responseJSON拿到回调数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         // 强制清空token
        //         localStorage.removeItem("token");
        //         // 强制跳转登录界面
        //         location.href = "./login.html";
        //     }

        // }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    // 获取用户名称
    var name = user.nickname || user.username;
    // 设置欢迎文本
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
    // 按需渲染用户头像
    if (user.user_pic !== null) {
        // 有图片头像，显示图片头像
        $(".layui-nav-img").attr("src", user.user_pic).show();
        // 隐藏文本头像
        $(".text-avatar").hide();
    } else {
        // 没有图片头像
        $(".layui-nav-img").hide();
        // 文本头像的第一个字符
        var first = name[0].toUpperCase();
        // 展示文本头像
        $(".text-avatar").html(first).show();
    }
}