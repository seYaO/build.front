var Dialog = require("dialog/0.4.0/dialog");
var DialogDemo = function () {
};
DialogDemo.prototype = {
    init: function () {
        this.initDialog();
    },
    initDialog: function () {
            var dialog = new Dialog();
            // 警告对话框
            $(".J_warning").click(function() {
                var conf = {
                    title:"警告",
                    content:"这是一个警告提示框", //内容
                    buttons: {
                        "确认": function() {
                            console.log("1");
                        }
                    }
                };
                dialog.alert(conf);
            });
            // 确认对话框
            $(".J_confirm").click(function() {
                //确认按钮内容 ，是否插入图标，对话框内容
                var conf = {
                    icon:"warning", //icon图标
                    content:"这是一个确认对话框", //内容
                    time:2000,  //停留时间
                    title:"确认",
                    buttons: {
                        "确认": function() {
                            //这里是回调
                            console.log("ok");
                        },
                        "取消": function() {
                            console.log("cancel");
                        }
                    }
                };
                dialog.confirm(conf);
            });
            // 操作成功、失败、警告
            $(".J_operate").click(function() {
                var type = $(this).attr("data-type");
                var content = $(this).attr("data-content");
                var conf = {
                    content: content,
                    type: type, //绿色：success,红色：danger 黄色：warning
                    time: 2000,
                    icon:"success",
                    align:"center",  //top || center
                    fn: function() {
                        console.log("success");
                    }
                }
                dialog.prompt(conf);

            });
            // 提交成功
            $(".J_commitSuccess").click(function() {
                var conf = {
                    //title:"", //标题
                    icon:"success", //icon图标:成功：success,失败：danger,警告：warning
                    content:"提交成功", //内容
                    time:2000,  //停留时间
                    hidebutton:true,  //是否隐藏确定、取消按钮
                    width:"360px",   //弹框宽度
                    height: "80px",  //弹框高度
                    //top:"200px"       //弹框距离顶部距离
                };
                dialog.alert(conf);
            });
            // 提交失败
            $(".J_commitFailure").click(function() {
                var conf = {
                    icon:"danger", //icon图标
                    content:"提交失败", //内容
                    time:2000,  //停留时间
                    hidebutton:true,  //是否隐藏确定、取消按钮
                    width:"360px"    //弹框宽度
                };
                dialog.alert(conf);
            });
    }
};
module.exports = new DialogDemo();