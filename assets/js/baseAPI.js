// 52. 注意每次调用$.get 或 $.post 或 $.ajax 之前先调用$.ajaxPrefilter函数，在这里函数中可以拿到给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    console.log(options.url);
    options.url = "http://www.liulongbin.top:3007" + options.url;
    console.log(options.url);
});