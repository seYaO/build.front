/**
 *  @file 实现了通用highlight方法。
 *  @name Highlight
 *  @desc 点击高亮效果
 *  @import zepto.js
 */
(function() {
    var $doc = $( document ),
        $el,    // 当前按下的元素
        timer;    // 考虑到滚动操作时不能高亮，所以用到了100ms延时

    // 负责移除className.
    function dismiss() {
        var cls = $el.attr( 'hl-cls' );
        clearTimeout( timer );
        $el.removeClass( cls ).removeAttr( 'hl-cls' );
        $el = null;
        $doc.off( 'touchend touchmove touchcancel', dismiss );
    }

    /**
     * @name highlight
     * @desc 禁用掉系统的高亮，当手指移动到元素上时添加指定class，手指移开时，移除该class.
     * 当不传入className是，此操作将解除事件绑定。
     *
     * 此方法支持传入selector, 此方式将用到事件代理，允许dom后加载。
     * @grammar  highlight(className, selector )   ⇒ self
     * @grammar  highlight(className )   ⇒ self
     * @grammar  highlight()   ⇒ self
     * @example var div = $('div');
     * div.highlight('div-hover');
     *
     * $('a').highlight();// 把所有a的自带的高亮效果去掉。
     */
    $.fn.highlight = function( className, selector ) {
        return this.each(function() {
            var $this = $( this );

            $this.css( {'-webkit-tap-highlight-color': 'rgba(255,255,255,0)'})
                .off( 'touchstart.hl' );

            className && $this.on( 'touchstart.hl', function( e ) {
                var match;

                $el = selector ? (match = $( e.target ).closest( selector,
                    this )) && match.length && match : $this;

                // selctor可能找不到元素。
                if ( $el ) {
                    $el.attr( 'hl-cls', className );
                    timer = setTimeout( function() {
                        $el.addClass( className );
                    }, 100 );
                    $doc.on( 'touchend touchmove touchcancel', dismiss );
                }
            } );
        });
    };
})();
//autoComplete 末日重构版本
;(function(){

    /*
     * ready时初始化，搜索框
     * 按不同的搜索类型提供预置的标签结构（城市或酒店名称商圈等）
     * 绑定事件 focus blur keyup hover click resize scroll
     * 根据不同的事件操作执行不同的操作 ajax ui改变 定位 传值
     *
     * @param {Object}
     * beside 相对元素
     * template 初始化标签
     * class 主题样式限定名（样式类名）
     * offset {Object}偏移量
     * request {Object}
     * print 打印函数
     * itemValueFn 取得当前所选项的值
     * submit 提交函数
     * title 头部提示
     * itemClass 每项的类名
     * highlightClass hover 或上下箭头所到项的高亮的类名
     */
    window.autoCompleteId = window.autoCompleteId || 1;

    function getAutoCompleteId(){
        return window.autoCompleteId++;
    }
    function main(param) {
        var beside, //表单内元素,后面被格式化为fish对象
            id = getAutoCompleteId(),                               //唯一id
            template = '<div id="autoComplete-' + id + '" class="autofill-wrap"><div class="show-title"><span class="autofill-hd-inner"></span><span class="autofill-close"></span></div><table class="autofill-tray" cellpadding="0" cellspacing="0"></table></div>',
            wrap,                                           //最父级节点
            titleWrap,                                      //title节点
            localData = [],                                 //本地数据
            defaultData = [],                               //默认点击或者无匹配的数据源
            printData = {},                                 //打印出来的数据集
            offset = {x:0, y:0},                            //偏移
            title = "输入中文/拼音",                        //默认title文字
            output = {},                                    //输出对象
            preSortFn = null,                               //排序前的数据处理函数
            sortFn = null,                                  //排序函数
            width = '100%',                                 //宽度，不指定时为自适应
            highlight = true,                               //是否高亮关键字
            max = 999,                                       //最高显示条目数
            originIndex = 0,                                //默认高亮的行号
            keepListOnNoResult = false,                     //是否保持无结果前有结果的列表 -_-
            url = "",                                       //异步地址
            requestValName = "val",
            type = "GET",                                   //异步类型
            dataType = "json",
            ignore = true,                                  //是否忽略大小写
            processPrintDataFn,                             //打印前的整理函数
            processAjaxDataFn,                              //需要返回标准数组
            itemPrintFn = function(){},                     //每行的打印函数,返回innerHTML
            itemValueFn = function(){},                     //获取每行的提交值的函数
            itemEnableFn = function(){return true},         //判定每行是否有效的函数，无效的行不会加上 hover的类名。也就不会响应 mouseover和click等
            ajaxFn = function (){},                         //异步回调函数
            itemHighlightFn = function(){return true},      //是否高亮关键字
            elemTouch = false,                              //保存是否被点击点中
            theme = "",                                     //主题,是个类名
            tableWrapElem,                                  //table节点
            itemClass = "autofill_item",                    //每行的类名
            enableClass = "enableListRow",                  //每行的类名
            chooseClass = "autofill-hover",                  //光标滑过的类名
            highlightClass = "autofill-hili",               //高亮关键字的类名
        //emptyClass = "autofill_empty",                  //表单为空值时的类名
        // fillWhenHover = false,                          //模糊匹配数据hover时填充数据
            needPositionWrap = false,                       //是否需要将容器相对输入框定位
            showUserInput = false,                          //在title显示用户输入的
            maxOverFlowNum=10,                              //输入提示最多显示多少
            isFirst = true,                                 //第一次打开的时候显示的默认数据
            content = "body",  //置放autocomplete容器
            needClose = false,
            showClosebtn = false,
            showTitle;
        var needEnter = true;

        beside = param.input ? $(param.input) : null;
        if(!beside[0]){
            throw new Error("The relevant element does not exist");
        }
        content = param.content ? $(param.content) : $(content);

        wrap = $(template).appendTo(content);
        // wrap = $("#autoComplete-" + id);

        titleWrap = $(".autofill-hd-inner", wrap);
        showTitle = $(".show-title", wrap);
        tableWrapElem = $(".autofill-tray", wrap)[0];


        offset.x = param.offsetX !== undefined ? param.offsetX : 0;
        offset.y = param.offsetY !== undefined ? param.offsetY : 0;

        processAjaxDataFn = typeof param.processAjaxDataFn === "function" ? param.processAjaxDataFn : null;

        itemPrintFn = typeof param.itemPrintFn === "function" ? param.itemPrintFn : null;

        if(typeof param.title === "string" && $.trim(param.title).length) {
            title = param.title;
            titleWrap.html(param.title);
        }else if(param.title === false){
            title = '';
            titleWrap.html('');
        }

        if(typeof param.theme === "string" && $.trim(param.theme).length) {
            theme = param.theme;
            wrap.addClass(param.theme);
        }

        if(typeof param.itemClass === "string" && $.trim(param.itemClass).length) {
            itemClass = param.itemClass;
        }

        if(typeof param.highlightClass === "string" && $.trim(param.highlightClass).length) {
            highlightClass = param.highlightClass;
        }

        if(typeof param.ajaxFn === "function"){
            ajaxFn = param.ajaxFn;
        }

        width = param.width ? param.width : width;
        processPrintDataFn = param.processPrintDataFn ? param.processPrintDataFn : processPrintDataFn;
        preSortFn = param.preSortFn ? param.preSortFn : preSortFn;
        max = param.max ? param.max : max;
        sortFn = param.sortFn ? param.sortFn : sortFn;
        keepListOnNoResult = param.keepListOnNoResult ? param.keepListOnNoResult : keepListOnNoResult;
        url = param.requestUrl ? param.requestUrl : url;
        type = param.requestType ? param.requestType : type;
        dataType = param.dataType ? param.dataType : dataType;
        itemPrintFn = param.itemPrintFn ? param.itemPrintFn : itemPrintFn;
        itemEnableFn = param.itemEnableFn ? param.itemEnableFn : itemEnableFn;
        itemValueFn = param.itemValueFn ? param.itemValueFn : itemValueFn;
        localData = param.localData ? param.localData : localData;
        defaultData = param.defaultData ? param.defaultData : defaultData;
        itemHighlightFn = param.itemHighlightFn ? param.itemHighlightFn : itemHighlightFn;
        // fillWhenHover = param.fillWhenHover != undefined ? param.fillWhenHover : fillWhenHover;

        //hover
        chooseClass = param.chooseClass ? param.chooseClass : chooseClass;
        //显示 X按钮
        showClosebtn = param.showClosebtn === true ? true :false;
        $(".autofill-close",wrap).css({"display" : (showClosebtn ? "block" : "none")});
        //在title显示用户输入的
        showUserInput = param.showUserInput ? param.showUserInput : showUserInput;

        width && wrap.css({width: width + "px"});
        //2013-8-16新增
        maxOverFlowNum=param.maxOverFlowNum ? param.maxOverFlowNum : maxOverFlowNum;
        //异步请求参数名称
        requestValName = param.requestValName ? param.requestValName : requestValName;

        wrap.needClose = param.needClose ? param.needClose : needClose;

        needEnter = param.needEnter === true ? true: false;

        needPositionWrap = param.needPositionWrap ? true : needPositionWrap;
        needPositionWrap && positionWrap(wrap, beside, offset);

        wrap.css({"display":"none"});

        var ajaxTimer;
        function ajaxToGetData(handledUrl){
            if(ajaxTimer){
                clearTimeout(ajaxTimer);
            }
            ajaxTimer = setTimeout(function(){
                if(beside.ajaxObj){
                    try{
                        beside.ajaxObj.abort();
                    }
                    catch(e){}
                }
                beside.ajaxObj = $.ajax({
                    url: handledUrl,
                    data : requestValName+ "=" + encodeURIComponent(output.val()),
                    type: type,
                    dataType :dataType,
                    error:function(a,b,c){
                    },
                    success: function(data){
                        ajaxFn(data);
                        var fData = processAjaxDataFn ? processAjaxDataFn(data) : data;
                        beside.origin = output.val();
                        if(fData && fData.length){
                            bulidTitleTips(title);
                            bulidTableList(fData,output.val());
                        }
                        else{
                            if(keepListOnNoResult){
                                bulidTableList();
                            }
                            if(!keepListOnNoResult){
                                cleanList(tableWrapElem);
                            }
                            var outputval = output.val();
                            if(outputval.length > maxOverFlowNum){ outputval = outputval.substring(0,maxOverFlowNum)+"...";}
                            if(param.title == false){
                                showTitle.css({"display":"block"});
                            }
                            bulidTitleTips('对不起，找不到：' +'<span class="' + highlightClass + '">' + outputval + '</span>');
                            outputval = null;
                        }
                    }
                });
                ajaxTimer = null;
            }, 200);
        }

        function bulidTableList(fData, highLightKey,num){
            if(fData && processPrintDataFn){
                processPrintDataFn.call(output, fData);
            }
            printData = fData;

            //分割数据
            var allList = [],list = [];
            for(var x = 0 ,y = fData.length;x < y ; x++){
                var z = list.length;
                list[z] = fData[x];
                if(z == (max - 1) || x == (fData.length - 1)){
                    allList[allList.length] = list;
                    list = [];
                }
            }
            _bulidTableList(allList, highLightKey,num);
        }

        function _bulidTableList(fData, highLightKey,num){
            num = num ? num : 0;

            var htmlTemp, enableTemp, hlTemp;
            cleanList(tableWrapElem);

            if(fData[num] && fData[num].length){
                for(n=0; n<fData[num].length; n++){
                    if(!fData[num][n]){
                        continue;
                    }
                    row = tableWrapElem.insertRow(-1);
                    cell = row.insertCell(-1);
                    enableTemp = itemEnableFn.call(row, fData[num][n], n);
                    row.className = itemClass;
                    if(enableTemp){
                        row.className += (" " + enableClass);
                    }
                    htmlTemp = itemPrintFn.call(row, fData[num][n], n);
                    if(htmlTemp === false){
                        tableWrapElem.deleteRow(-1);
                    }
                    else{
                        if(hlTemp = itemHighlightFn.call(row, fData[num][n], n)){
                            cell.innerHTML = processHighlight(htmlTemp, highLightKey);
                            // alert(cell.innerHTML);
                        }
                        else{
                            cell.innerHTML = htmlTemp;
                        }
                    }
                }
                //设置第一个可用的index
                // if(tableWrapElem.index !== -1){
                //     var list = $("." + itemClass, tableWrapElem);
                //     while(list[tableWrapElem.index] && !$(list[tableWrapElem.index]).hasClass(enableClass)){
                //         tableWrapElem.index++;
                //     };
                //     if(list[tableWrapElem.index]){
                //         $(list[tableWrapElem.index]).addClass(chooseClass);
                //     }
                //     else{
                tableWrapElem.index = -1;
                //     }
                // }
                $(".autofill_item",tableWrapElem).highlight("item-state-hover");
            }
        }

        function bulidTitleTips(html){
            output.setTitle(html);
        }



        function sub_matchData(key,data){
            var fData = [],
                tempCity, tempMatch, tempKey, tempMatchIndex, tempTempMatchIndex,
                tempMatchKey, matchKeyPri,
                i, iLength, j, jLength, k, kLength;
            var mData = data;
            //城市
            iLength = mData.length;
            for(var i=0; i<iLength; i++){
                tempCity = mData[i];
                tempMatch = tempCity.match;
                jLength = tempMatch.length;
                tempMatchIndex = -1;
                //关键字
                for(var j=0; j<jLength; j++){
                    tempKey = tempMatch[j];
                    //忽略大小写
                    if(ignore){
                        tempKey = tempKey.toLowerCase();
                    }
                    //找到最靠前的匹配
                    if( (tempTempMatchIndex = tempKey.indexOf(key)) > -1  && ((tempMatchIndex === -1) || (tempTempMatchIndex < tempMatchIndex)) ){
                        tempMatchIndex = tempTempMatchIndex;
                        tempMatchKey = tempKey;
                    }
                }
                if(tempMatchIndex > -1){
                    if(preSortFn){
                        preSortFn(tempCity, tempMatchKey, tempMatchIndex);
                    }
                    fData[fData.length] = tempCity;
                }
            }

            if(!fData.length && keepListOnNoResult){
                key = key.substr(0, key.length - 1);
                if(key !== ""){
                    fData = sub_matchData(key,mData);
                }
                fData.matchFalid = true;
            }
            else{
                fData.matchLength = key.length;
                if(!fData.length && !keepListOnNoResult){
                }
            }

            return fData;
        }


        function matchData(key,data){

            var fData;
            //TODO:支持大小写
            if(ignore){
                key = key.toLowerCase();
            }
            //最小匹配
            if(key===""){
                fData = defaultData;
            }else{
                fData = sub_matchData(key,data);
            }
            beside.origin = key;
            var key1 = key;
            if(key.length>maxOverFlowNum){ key1=key.substring(0,maxOverFlowNum)+"...";}
            if(fData.length){
                //排序
                if(sortFn){
                    fData.sort(sortFn);
                }
//                //剔除多余的数
                // if(max){
                //     fData.splice(max, fData.length);
                // }

                if(fData.matchFalid){
                    if(param.title == false){
                        showTitle.css({"display":"block"});
                    }
                    bulidTitleTips('对不起，找不到：' + '<span class="' + highlightClass + '">' + key1 + '</span>');

                }
                else{
                    bulidTitleTips(showUserInput && key != "" ? key + "，" + title : title);
                }
                bulidTableList(fData, key.substr(0, fData.matchLength),0);
            }
            else{
                if(param.title == false){
                    showTitle.css({"display":"block"});
                }
                bulidTitleTips('对不起，找不到：'+ '<span class="' + highlightClass + '">' + key1 + '</span>');
                if(!keepListOnNoResult){
                    cleanList(tableWrapElem);
                }
                param.emptyFn && param.emptyFn();

            }
            key1=null;

        }

        //处理高亮关键字
        function processHighlight(html, highLightKey){
            if(highlight && highLightKey !=="" ){  //beside.isHeightL  如果为false 表示他在返回值里面调用show
                var hightlightWords = highLightKey ? highLightKey : output.val();
                if(hightlightWords === "\\"){
                    hightlightWords = "\\\\";
                }
                var hightlightReg = new RegExp(hightlightWords, "g" + (ignore ? "i" : ""));
                return  html.replace(
                    /(>|^)([^>^<]+)(<|$)/g,
                    function($reg){
                        return $reg.replace(hightlightReg, function($mac){
                            return '<span class="' + highlightClass + '">' + $mac + '</span>';
                        } )
                    });
            }
            else{
                return html;
            }

        }

        // down 40
        // up 38

        beside.on("keyup",changeEvent);
        beside.on("input",changeEvent);
        function changeEvent(e){
            if(param.title == false){
                showTitle.css({"display":"block"});
            }
            if(e){
                var that = e.target,
                    key = getKey(e);
            }
            var tray = tableWrapElem,
                theValue,
                handledUrl,
                wrapIsNone = wrap.css("display");
            theValue = output.val();
            if(param.beforeRender && param.beforeRender.call(this,theValue,output)){
                return;
            }
            if(theValue === "") {
                output.show();
                if(defaultData.length !== 0){
                    matchData(theValue,defaultData);
                }else{
                    output.hide();
                    return;
                }
            }
            else{
                output.show();
            }
            if(key === 13 &&needEnter&&wrapIsNone !=="none") {  //如果敲击回车的时候面板已经被none，则不去做下面的事情
                var list = $("." + itemClass, tray);
                param.submit && param.submit(output);
                if(printData[tray.index]){

                    beside.val(itemValueFn.call(list[tray.index], printData[tray.index], tray.index));
                    if(param.selectItemFn && typeof(param.selectItemFn) == "function"){
                        param.selectItemFn(beside,list[tray.index]);
                    }
                }
                output.hide();
            }else if(key === 40 || key === 38) {
                highlightClassItem(key, tray, beside);
            }else if(key === 13 && wrapIsNone ==="none"){   //用来判断敲击回车键之前如果面板已经被none，则继续让它none
                output.hide();
            }else {
                handledUrl = url;
                if(handledUrl){
                    //异步调取数据
                    ajaxToGetData(handledUrl);
                }
                else{
                    //模糊匹配查询
                    matchData(theValue,localData);
                }
            }
        }
        beside.on("click focus",function(){
            if(defaultData.length !== 0){
                output.show();
            }
        });

        wrap.on("click",function(e) {
            var that = e.target,
                row,
                list,
                tray = tableWrapElem;
            list = $("." + itemClass, tray);
            while(that !== null) {
                row = $(that);
                if(row.hasClass(itemClass)) {
                    list.each(
                        function(index,ele) {
                            if(ele === that && $(that).hasClass(enableClass)) {
                                list.toggleClass(chooseClass,"");
                                row.addClass(chooseClass);
                                tray.index = index;
                                beside.val(itemValueFn.call(list[tray.index], printData[tray.index],tray.index));
                                if(param.selectItemFn && typeof(param.selectItemFn) == "function"){
                                    param.selectItemFn(beside,list[tray.index]);
                                }
                                return false;
                            }
                        }
                    );
                    output.hide();
                    break;
                }
                that = that.parentNode;
            }

        });

        showClosebtn && $(".autofill-close", wrap).on("click", function(){
            output.hide();
        })

        beside.on("mousedown", function(){
            elemTouch = true;
        });
        beside.on("mouseup", function(){
            elemTouch = false;
        });

        wrap.on("mousedown", function(){
            elemTouch = true;
        });
        wrap.on("mouseup", function(){
            elemTouch = false;
        });

        beside.on("blur",
            function(e) {
                setTimeout(function(){
                    if(!elemTouch){
                        output.hide();
                        elemTouch = false;
                    }
                }, 0);
            }
        );

        $(window).on(
            "resize orientationchange",
            function() {
                output.resetPosition();
            }
        );



        // 静态定位函数
        function positionWrap(wrap, beside, offset) {
            if (wrap && wrap[0].nodeType === 1 && beside && beside[0].nodeType === 1) {

                var viewWidth = $(window).width(),
                    viewHeight = $(window).height(),
                    besideWidth = beside.width(),
                    besideHeight = beside.height(),
                    wrapWidth = wrap.width(),
                    wrapHeight = wrap.height(),
                    besideOffset = beside.offset(),
                    temp;

                if (offset && !isemptyClass(offset)) {
                    offset.x = typeof offset.x === "number" ? offset.x : 0;
                    offset.y = typeof offset.y === "number" ? offset.y : 0;
                } else {
                    var offset = {x: 0,y: 0}
                }

                if ((temp = besideOffset.left) > viewWidth - (besideOffset.left) && viewWidth - (besideOffset.left) < wrapWidth) {
                    wrap.css({"left" : (besideOffset.left + besideWidth - wrapWidth - offset.x) + "px"});
                } else {
                    wrap.css({"left" : (besideOffset.left + offset.x) + "px"});
                }

                wrap.css({"top" : (besideOffset.top + besideHeight + offset.y) + "px"});

            } else {
                throw new Error("需要指定输入域和/或及其弹框！");
            }
        }

        function highlightClassItem(key, tray, beside) {
            var list = $("." + itemClass, tray),
                last = list.length - 1,
                ChoseDataNum=0;

            if(!list.length) {
                // 无列表
                return;
            }

            list.toggleClass(chooseClass,"");
            switch(key) {
                case 40:
                    do{
                        tray.index++;
                    }
                    while(list[tray.index] && !$(list[tray.index]).hasClass(enableClass));
                    if(tray.index > last){
                        tray.index = -1;
                        beside.val(beside.origin);
                    }
                    else{
                        $(list[tray.index]).addClass(chooseClass);
                        ChoseDataNum=tray.index;
                        beside.val(itemValueFn.call(list[tray.index], printData[ChoseDataNum], ChoseDataNum));
                    }

                    break;
                case 38:
                    do{
                        tray.index--;
                    }
                    while(list[tray.index] && ! $(list[tray.index]).hasClass(enableClass));
                    ChoseDataNum = tray.index;
                    if(tray.index === -1) {
                        beside.val(beside.origin);
                    }else if(tray.index < -1){
                        tray.index = last;
                        beside.val(itemValueFn.call(list[tray.index], printData[tray.index], tray.index));
                        $(list[tray.index]).addClass(chooseClass);
                    }
                    else{
                        $(list[tray.index]).addClass(chooseClass);
                        beside.val(itemValueFn.call(list[tray.index], printData[ChoseDataNum], ChoseDataNum));
                    }

                    break;
            }


        }

        function cleanList(tray) {
            tray.index = originIndex;
            var list = $("." + itemClass, tray),
                l = list.length;
            while(l-- > 0) {
                tray.deleteRow(-1);
            }
        }
        output.macth = function(data){
            if(data){
                matchData(output.val(),data);
            }
            else{
                matchData(output.val(),localData);
            }
        }
        output.hide = function(){
            wrap.needClose && wrap.css({"display":"none"});
        }
        output.show = function(){
            if(wrap.css("display") === "none"){
                wrap.css({"display":"block"});
                output.resetPosition();
            }
            if(isFirst === true && defaultData.length !== 0){
                param.title !== false && output.setTitle(title);
                bulidTableList(defaultData,"",0)
                isFirst = false;
            }else if(defaultData.reset){
                bulidTableList(defaultData,"",0);
                param.title === false && output.setTitle('');
            }
        }
        output.setTitle = function(title){
            titleWrap.html(title);
        }
        output.resetDefaultData = function(data){
            if(data){
                defaultData = data;
            }else{
                defaultData = [];
            }
            defaultData.reset = true;
        }
        output.val = function(value){
            if(value !== undefined){
                beside.val(value);
            }
            else{
                return $.trim(beside.val());
            }

        }
        output.resetPosition = function(){
            needPositionWrap && positionWrap(wrap, beside, offset);
        }
        output.requestUrl = function(urlFn){
            if(typeof urlFn === "string"){
                url = urlFn;
            }
        }
        output.localData = localData;

        output.resetlocalData = function(data){
            localData = data;
        }

        return output;
    }


    // 是否空对象（非内置对象）
    function isemptyClass(o) {
        for (var p in o) {
            return false;
        }
        return true;
    }
    // 获得键值
    function getKey(e) {
        e = e || vent;
        if(e.which) {
            return e.which;
        }else {
            return e.keyCode;
        }
    }

    $.autoComplete = function (param) {
        return new main(param);
    };
    $.fn.autoComplete = function (param) {
        param.input = this;
        return new main(param);
    };
    // fish.extend({autoComplete:main});
}());
