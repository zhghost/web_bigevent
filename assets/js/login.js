$(function() {
    // 12. 点击去注册账号链接
    $("#link_reg").on("click", function() {
        // 13. 隐藏登陆div
        $(".login-box").hide();
        // 14. 显示注册div
        $(".reg-box").show();
    });

    // 15. 点击去登陆链接
    $("#link_login").on("click", function() {
        // 16. 隐藏注册div
        $(".reg-box").hide();
        // 17. 显示登陆div
        $(".login-box").show();
    });

    // 39. 从layui中获取form对象（只要导入layui就有layui这个对象）
    var form = layui.form;
    // 48. 从layui中获取layer对象（只要导入layui就有layui这个对象）
    var layer = layui.layer;

    // 40. 通过form.verify()这个函数自定义校验规则
    form.verify({
        // 41. 自定义一个pwd的校验规则（pwd是校验规则名，可以任意起）
        pwd: [
            // ,前面是校验规则，当输入的内容不满足规则时，返回,后面的字符串
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 42. 校验两次密码是否一致的规则
        repwd: function(value) {
            // 43. 通过形参value拿到是确认密码框的内容，还需要拿到密码框中的内容
            // 密码框的值
            var pwd = $(".reg-box [name=password]").val();
            if (pwd !== value) {
                return "两次密码不一致";
            }
        }
    });

    // 45. 监听注册表单的提交事件
    $("#form_reg").on("submit", function(e) {
        // 46. 阻止表单的默认提交行为
        e.preventDefault();
        // 47. 发起POST请求
        $.ajax({
            method: "POST",
            url: "/api/reguser",
            data: {
                username: $("#form_reg [name=username]").val(),
                password: $("#form_reg [name=password]").val()
            },
            success: function(res) {
                if (res.status !== 0) {
                    // return alert(res.message);
                    // 49.layer提示
                    layer.msg(res.message);
                }
                // alert("注册成功！");
                // 49.layer提示
                layer.msg("注册成功，请登录！");
                // 50. 注册成功后，跳转到登陆界面（模拟点击行为）
                $("#link_login").click();
            }
        })
    });

    // 51. 监听登陆表单的提交事件
    $("#form_login").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/login",
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("登陆失败！");
                }
                layer.msg("登陆成功！");
                // 将登陆得到的token字符串，保存到localStorage中
                localStorage.setItem("token", res.token);
                console.log(res.token);
                // 跳转到后台主页（登陆很快，很可能上面的token看不到就已经跳转了，要么注释掉下面，要么slow 3G）
                location.href = "./index.html";
                // location.href = "./index.html";
            }
        })
    });
});