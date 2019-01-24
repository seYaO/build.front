# mCustomScrollbar介绍 
参考
[1](http://blog.wpjam.com/article/jquery-mcustomscrollbar-js/)
[2](http://www.jiangweishan.com/article/mCustomScrollbar.html)
## 前期准备
```
JS :
<script type="text/javascript" src="js/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="js/jquery.mCustomScrollbar.concat.min.js"></script>

<!--[if lt IE 9]>
<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<script src="http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js"></script>
<![endif]-->   


CSS：

<link rel="stylesheet" href="css/jquery.mCustomScrollbar.css">
<link rel="stylesheet" href="css/style.css">

HTML：

<div class="content">内容</div>
```
说明：

1、这个调用方法是mCustomScrollbar最新版3.X的，相比2.X版本优化了很多。

2、建议把jquery.mCustomScrollbar.css合并到项目公用CSS文件里去，减少请求！这里我只是为了让大家看明白，没有合并到style.css里。

3、对.content定义overflow，高度（或最大高度）的属性，相信大家比我还清楚，:-)

## mCustomScrollbar原理
跟大多数滚动插件差不多，它首先获取要修改滚动条样式的内容区块，然后使用 CSS 隐藏掉默认滚动条，然后使用 Javascript 添加很多 HTML 结构，再配合 CSS 做出一个滚动条的效果。然后再使用 CSS 定义滚动条的样式，使用 Javascript 相应鼠标的滚动事件，产生滚动下滑的效果。

## mCustomScrollbar应用
使用JS调用mCustomScrollbar，代码如下：
```
<script type="text/javascript">
    (function($){
        $(window).load(function(){
            $(".content").mCustomScrollbar();
        });
    })(jQuery);
</script> 
```

## 配置选项和参数说明
- set_width:false | 设置你内容的宽度 值可以是像素或者百分比
- set_height:false | 设置你内容的高度 值可以是像素或者百分比
- horizontalScroll:Boolean | 是否创建一个水平滚动条 默认是垂直滚动条 值可为:true(创建水平滚动条) 或 false
- scrollInertia:Integer | 滚动的惯性值 在毫秒中 使用0可以无滚动惯性 (滚动惯性可以使区块滚动更加平滑)
- scrollEasing:String | 滚动动作类型 
- mouseWheel:String/Boolean | 鼠标滚动的支持 值为:true.false,像素 默认的情况下 鼠标滚动设置成像素值 填写false取消鼠标滚动功能
- mouseWheelPixels:Integer | 鼠标滚动中滚动的像素数目 值为以像素为单位的数值
- autoDraggerLength:Boolean | 根据内容区域自动调整滚动条拖块的长度 值:true,false
- scrollButtons:{   enable:Boolean  } | 是否添加 滚动条两端按钮支持 值:true,false
- scrollButtons:{   scrollType:String  } | 滚动按钮滚动类型 值:”continuous”(当你点击滚动控制按钮时断断续续滚动)  “pixels”(根据每次点击的像素数来滚动) 
- scrollButtons:{   scrollSpeed:Integer  } | 设置点击滚动按钮时候的滚动速度(默认 20) 设置一个更高的数值可以更快的滚动
- scrollButtons:{   scrollAmount:Integer   } | 设置点击滚动按钮时候每次滚动的数值 像素单位 默认 40像素
- advanced:{   updateOnBrowserResize:Boolean  } | 根据百分比为自适应布局 调整浏览器上滚动条的大小 值:true,false 设置 false 如果你的内容块已经被固定大小
- advanced:{   updateOnContentResize:Boolean   } | 自动根据动态变换的内容调整滚动条的大小 值:true,false 设置成 true 将会不断的检查内容的长度并且据此改变滚动条大小 建议除非必要不要设置成 true 如果页面中有很多滚动条的时候 它有可能会产生额外的移出 你可以使用 update 方法来替代这个功能
- advanced:{   autoExpandHorizontalScroll:Boolean   } | 自动扩大水平滚动条的长度 值:true,false 设置 true 你可以根据内容的动态变化自动调整大小
- advanced:{   autoScrollOnFocus:Boolean   } | 是否自动滚动到聚焦中的对象 例如表单使用类似TAB键那样跳转焦点 值:true false
- callbacks:{   onScrollStart:function(){}   } | 使用自定义的回调函数在滚动时间开始的时候执行 
- callbacks:{   onScroll:function(){}   } | 自定义回调函数在滚动中执行 Demo 同上
- callbacks:{   onTotalScroll:function(){}  } | 当滚动到底部的时候调用这个自定义回调函数 Demo 同上
- callbacks:{   onTotalScrollBack:function(){}   } | 当滚动到顶部的时候调用这个自定义回调函数 Demo 同上
- callbacks:{   onTotalScrollOffset:Integer   } | 设置到达顶部或者底部的偏移量 像素单位
- callbacks:{  whileScrolling:function(){}  } | 当用户正在滚动的时候执行这个自定义回调函数
- callbacks:{  whileScrollingInterval:Integer  } | 设置调用 whileScrolling 回调函数的时间间隔 毫秒单位

上面只是列举了一些常用的，如果想看更加详情的，请猛戳这里：[更多配置选项和参数说明](http://manos.malihu.gr/jquery-custom-content-scroller/)

## mCustomScrollbar方法

### 1. update

用法：$(selector).mCustomScrollbar(“update”);

调用 mCustomScrollbar 函数的 update 方法去实时更新滚动条当内容发生变化（例如 通过 Javascript 增加或者移除一个对象、通过 ajax 插入一段新内容、隐藏或者显示一个新内容等）

### 2. scrollTo

用法：$(selector).mCustomScrollbar(“scrollTo”,position);

你可以使用这个方法自动的滚动到你想要滚动到的位置。这个位置可以使用字符串（例如 “#element-id”，“bottom” 等）描述或者是一个数值（像素单位）。下面的例子将会滚动到最下面的对象
```
$(".content").mCustomScrollbar("scrollTo","last");
```
scrollTo 方法的参数
- $(selector).mCustomScrollbar(“scrollTo”,String); | 滚动到某个对象的位置，字符串型的值可以是 id 或者 class 的名字
- $(selector).mCustomScrollbar(“scrollTo”,”top”); | 滚动到顶部（垂直滚动条）
- $(selector).mCustomScrollbar(“scrollTo”,”bottom”); | 滚动到底部（垂直滚动条）
- $(selector).mCustomScrollbar(“scrollTo”,”left”); | 滚动到最左边（水平滚动条）
- $(selector).mCustomScrollbar(“scrollTo”,”right”); | 滚动到最右边（水平滚动条
- $(selector).mCustomScrollbar(“scrollTo”,”first”); | 滚动到内容区域中的第一个对象位置
- $(selector).mCustomScrollbar(“scrollTo”,”last”); | 滚动到内容区域中的最后一个对象位置
- $(selector).mCustomScrollbar(“scrollTo”,Integer); | 滚动到某个位置（像素单位）

scrollTo 方法还有两个额外的选项参数
- moveDragger: Boolean | 滚动滚动条的滑块到某个位置像素单位，值：true，flase。例如：$(selector).mCustomScrollbar(“scrollTo”,200,{ moveDragger:true });
- callback：Boolean | 执行回调函数当 scroll-to 完成之后，值：true，false 例如：$(selector).mCustomScrollbar(“scrollTo”,200,{ callback:true });

### 3. disable

用法：$(selector).mCustomScrollbar(“disable”);

调用 disable 方法去使滚动条不可用。如果想使其重新可用，调用 update方法。disable 方法使用一个可选参数（默认 false）你可以设置 true 如果你想重新让内容区域滚动当 scrollbar 不可用时。例如：
```
$(".content").mCustomScrollbar("disable",true);
```

### 4. distroy

用法：$(selector).mCustomScrollbar(“destroy”);

调用 destroy 方法可以移除某个对象的自定义滚动条并且恢复默认样式