// 52. 注意每次调用$.get 或 $.post 或 $.ajax 之前先调用$.ajaxPrefilter函数，在这里函数中可以拿到给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // console.log(options.url);

    // 在这里统一拼接url地址
    options.url = "http://www.liulongbin.top:3007" + options.url;
    // console.log(options.url);


    // 统一为有权限的接口配置headers
    if (options.url.indexOf("/my/") !== -1) {
        options.headers = { Authorization: localStorage.getItem("token") || "" };
    }

    // 全局统一挂载complete回调函数
    options.complete = function(res) {
        // 在complete回调函数中可以用res.responseJSON拿到回调数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 强制清空token
            localStorage.removeItem("token");
            // 强制跳转登录界面
            location.href = "./login.html";
        }
    }


});