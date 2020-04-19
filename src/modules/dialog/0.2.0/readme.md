dialog组件
=============================

集成用法（[详见demo页面](index.html)）
-------
####引用+初始化
```javascript
    // 加载入口模块
    seajs.use("dialog/0.2.0/dialog", function (Dialog) {
        //全局装载模板
        $dialog = new Dialog({ skin: 'skin1' });
    });
```

####alert 确认对话框
```javascript
  $dialog.alert('样式1', function () {
            //alert('ok');
        });
```



####confirm 选择确认对话框
```javascript
  $dialog.confirm("确认样式1", function () {
            //alert('ok');
        }, function () {
            //alert('cannel');
        });
```

####tooltip 提示对话框
```javascript
    $dialog.tooltip('tooltip 样式一',1000, function () {
            //alert('ok');
        });
```

####modal模态框
```javascript
 var config = {
            type: 'div',
            url: 'htmlpage.html',
            title: '标题1'
        };
        _modal = $dialog.modal(config);

        _modal.show();

```


基础属性介绍
----------

> type   : 内容呈现方式（html，div，iframe）默认html <br>
> skin	   : 皮肤（目前有skin1和skin2，待补充）<br>
> template	: 重定义模板样式，设置项会覆盖已选skin样式						<br>
> url	   : type为ifirame和div时有效								<br>
> content	: 内容，type=html时有效						<br> 
> title	   : 标题，为空时不显示标题							<br>
> titlestyle:	标题样式								<br>
> lock	   :   是否锁定屏幕，阻塞模式							<br>
> mask	   :  是否显示遮罩层									<br>
> quickClose: 	为true时触发快捷关闭对话框功能（esc或点击其他区域）<br>
> width		:宽度											<br>
> height		:高度									<br>
> time		:关闭时间（毫秒），默认-1，大于0时触发定时关闭效果<br>


常用方法
-----------
> show()：显示 <br />
> hide()：隐藏 <br />
> refresh()： 刷新内容 <br />



事件
----------------
> show <br />
> hide <br />
> close <br />


自定义模板介绍
--------------
###配置说明
```javascript
  var template = {
                alert: {
                    width: '宽度',
                    height: '高度',
                    html: '内容'
                },
                confirm: {
                    width: '宽度',
                    height: '高度',
                    html: '内容'
                },
                tooltip: {
                    width: '宽度',
                    height: '高度',
                    html: '内容'
                },
                modal: {
                    width: '宽度',
                    height: '高度',
                    html: '内容'
                }
            };
```

###内容特殊标记

> data-dialog-title:	标题		  <br>
> data-dialog-content:	内容	  <br>
> data-dialog-submit:	提交	  <br>
> data-dialog-hide:	隐藏		  <br>
> data-dialog-close:	关闭		<br>
> data-dialog-drag:	拖动标记	<br>
> data-dialog-arrows:箭头 <br>


###关于tooltip

tooltip附属函数

 /*
  * 附着某元素，主要确定位置用
  * @ele 可为选择器或者obj对象
  * @triggertype 触发类型'click','hover' 默认为'click',
  * @align  显示方位 top bottom left right
  */
> triggerShow(ele,triggertype,align)