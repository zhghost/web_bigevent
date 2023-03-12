$(function() {
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // value：把校验规则（samePwd）给哪个密码框，value拿到的就是哪个密码框的值
        samePwd: function(value) {
            if (value === $("[name=oldPwd]").val()) {
                return "新旧密码不能相同！";
            }
        },
        rePwd: function(value) {
            if (value !== $("[name=newPwd]").val()) {
                return "两次密码不一致！";
            }
        }
    });


    // 给form表单绑定submit事件
    $(".layui-form").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg("更新密码失败！");
                }
                layui.layer.msg("更新密码成功！");
                // 重置表单（原生的form有reset方法，需要把jQuery对象转换成dom对象）
                $(".layui-form")[0].reset();
            }
        })
    });
});