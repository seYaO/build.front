(function($) {
    Spy = {}
    /**
    * @desc 状态量
    */ 
    Spy.status = {
        isFirstMap:true,//是否是第一计算
        navItemLast:null, //上一次监听到的导航元素
        disable:false
    };

    /**
    * @desc 导航目标和按钮的匹配
    */ 
    Spy.array = [];

    /**
    * @desc 默认配置
    */
    Spy.defalutCfg = {
        navItemSelector:".nav-box .nav-item",
        navBoxSelector:".nav-box",
        currentClassName:"current",
        hideScrollTop:0,
        /*
        * @desc 回调参数
        * @param e.scrollTop 导航目标的滚动高度
        * @param e.scrollTopOffset 用户偏移量
        * @param e.navItem 导航按钮
        * @param e.navTarget 导航目标
        */
        firstTimeEnter:function(){}, //第一次进入区域的时候触发
        everyTimeEnter:function(){}, //每次进入区域的时候触发
        everyTimeSpy:function(){} // 每次滚动的时候触发
    }

    /**
    * @func init
    * @desc 初始化
    * @cfg 配置信息对象
    */
    function init(cfg){
        var _cfg = $.extend({},Spy.defalutCfg,cfg);
        // 验证参数
        verify(_cfg);
        // 计算导航距离
        mapScrollTop(_cfg);
        // 改变导航按钮状态
        changeNavItemStatus(_cfg);
        // 初始化事件
        initEvent(_cfg);
    }

    /**
    * @func initEvent
    * @desc 初始化事件
    * @cfg 配置信息对象
    */
    function initEvent(cfg){
        // 监听滚动条事件
        $(window).scroll(function() {
            // 根据滚动距离显示或者隐藏导航盒子
            changeNavBoxStatus(cfg)
            // 计算导航距离
            mapScrollTop(cfg);
            // 更改导航元素状态
            changeNavItemStatus(cfg);
        })
        // 重置锚点默认行为
        $(document).on("click", cfg.navItemSelector, function(event){
            var self = this;
            for(var index in Spy.array){
                var e = Spy.array[index];
                if($(e.navItem).get(0) === $(this).get(0)){
                    $(window).scrollTop(e.scrollTop); 
                    break;
                }
            }

            // $(cfg.navItemSelector).removeClass(cfg.currentClassName);
            // $(self).addClass(cfg.currentClassName);
            // Spy.status.disable = true;

            event.preventDefault();
            return false;
        })
    }

    /**
    * @func verify
    * @desc 验证配置参数正确性
    * @cfg 配置信息对象
    */
    function verify(cfg){
        // 验证
        if($(cfg.navItemSelector).length === 0){
            console.log("navItemSelector","指定的导航元素找不到");
        }
        if($(cfg.navBoxSelector).length === 0){
            console.log("navBoxSelector","指定的导航盒子找不到");
        }
        if(isNaN(parseInt(cfg.hideScrollTop))){
            console.log("hideScrollTop","指定的隐藏阈值必须为数值");
        }else if(cfg.hideScrollTop < 0){
            console.log("hideScrollTop","隐藏阈值不能为负数");
        }
        if(cfg.callback){
            if(typeof cfg.callback.firstTime !== 'function'){
                console.log("callback.firstTime","首次触发的回调函数必须为函数")
            }
            if(typeof cfg.callback.everyTime !== 'function'){
                console.log("callback.everyTime","每次触发的回调函数必须为函数")
            }
        }else{
            console.log("callback", "回调函数不正确")   
        }
    }

    /**
    * @func getOffsetTop
    * @desc 获取元素在文档中的y轴位移
    * @param o 需要计算位移的元素
    */
    function getOffsetTop(o) {
        var top = 0;
        var offsetParent = o;
        while (offsetParent != null && offsetParent != document.body) {
            top += offsetParent.offsetTop;
            offsetParent = offsetParent.offsetParent;
        }
        return top;
    }

    /**
    * @func changeNavBoxStatus
    * @desc 根据滚动条高度隐藏或者显示导航栏
    * @cfg 配置信息对象
    */
    function changeNavBoxStatus(cfg){
        if(cfg.hideScrollTop && (typeof cfg.hideScrollTop === "number")){
            if($(window).scrollTop()<cfg.hideScrollTop){
                $(cfg.navBoxSelector).hide();
            }else{
                $(cfg.navBoxSelector).show();
            }
        }
    }

    /**
    * @func changeNavItemStatus
    * @desc 根据滚动条高度修改导航元素的状态
    */
    function changeNavItemStatus(cfg){
        // if(Spy.status.disable){
        //     Spy.status.disable = false;
        //     return;
        // }
        var scrollTopNow = $(window).scrollTop();
        var navItemNow = null;
        for (var index in Spy.array) {
            var e = Spy.array[index];
            if (scrollTopNow >= parseInt(e.scrollTop)) {
                navItemNow = e.navItem;
                break;
            }
        }

        if(typeof e.everyTimeSpy === 'function')
            e.everyTimeSpy(e);
        else
            cfg.everyTimeSpy(e);

        if (!navItemNow) return;
        if(Spy.NavItemLast === navItemNow) return;
        Spy.NavItemLast = navItemNow;

        if(typeof e.everyTimeEnter === 'function')
            e.everyTimeEnter(e)
        else
            cfg.everyTimeEnter(e);

        if(e.isFirstArrive){
            e.isFirstArrive = false;

            if(typeof e.firstTimeEnter === "function")
                e.firstTimeEnter(e);
            else{
                cfg.firstTimeEnter(e); 
            }
        }

        $(cfg.navItemSelector).removeClass(cfg.currentClassName);
        $(navItemNow).addClass(cfg.currentClassName);
    }

    /**
    * @func mapScrollTop
    * @desc 匹配导航元素和对应的滚动条高度
    * @cfg 配置信息对象
    * @return 匹配的结果数组
    */
    function mapScrollTop(cfg){
        if(Spy.status.isFirstMap){
            Spy.status.isFirstMap = false;
            $(cfg.navItemSelector).each(function(index, navItem) {
                var anchor = $(navItem).attr("href"),
                    anchors = anchor.split("?"),
                    scrollTopOffset;
                anchor = anchors[0];
                scrollTopOffset = parseInt(anchors[1]);
                if(isNaN(scrollTopOffset)){
                    scrollTopOffset = 0;
                }
                var navTarget = $(anchor);
                var scrollTop = getOffsetTop(navTarget.get(0))+scrollTopOffset;

                Spy.array.push({
                    scrollTop: scrollTop, //导航目标的滚动高度
                    scrollTopOffset: scrollTopOffset, //用户偏移量
                    navItem: $(navItem),   //导航按钮
                    navTarget: navTarget, //导航目标
                    isFirstArrive: true,
                    everyTimeEnter: window[$(navItem).attr("data-everyTimeEnter")],
                    firstTimeEnter: window[$(navItem).attr("data-firstTimeEnter")],
                    everyTimeSpy: window[$(navItem).attr("data-everyTimeSpy")]
                })
            })
            Spy.array.sort(function(a, b) {
                // 从大到小
                return parseInt(b.scrollTop) - parseInt(a.scrollTop);
            })
        }else{
            for(var index in Spy.array){
                var e = Spy.array[index];
                e.scrollTop = getOffsetTop($(e.navTarget).get(0)) + e.scrollTopOffset
            }
        }
        // 对导航距离超过最大导航距离的元素做特殊处理
        var maxScrollTop = $(document).height() - $(window).height();
        var i = 0;
        for(var index in Spy.array){
            var e = Spy.array[index];
            if(e.scrollTop >= maxScrollTop)
                e.scrollTop = maxScrollTop - (i++);
        }
    }
    
    $.spyscroll = init;
    
})(Zepto)
