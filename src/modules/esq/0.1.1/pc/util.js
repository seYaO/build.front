/*
* 部分用法暂不兼容如 end is not等，一些使用频率少的方法也没有兼容
* promise模块没有兼容...搞不定
* 所有fish精灵都没有引用、所以也没有兼容
* 由于fish自身存在兼容问题所以一些用法也没有兼容比如：
* <div class="demo" /> ```$("div").attr("class") // null
* <input checked = "true" />  ```$("input").attr("checked")  // ie true chrome undefined
* 由于没有引用sizzle模块所以选择器只能按照fish的用法来使用
* 下面这些用法都是没结果的
* $("form:input") // 报错
* $("div","body") // []
* */
;(function(window,fish){
    //构造函数fish
    function Fish(){}
    Fish.prototype = fish.admin.cores.exec;

    var ArrayProto = Array.prototype, ObjProto = Object.prototype,
        push             = ArrayProto.push,
        slice            = ArrayProto.slice,
        concat           = ArrayProto.concat,
        toString         = ObjProto.toString,
        hasOwnProperty   = ObjProto.hasOwnProperty;
    function isFunction(obj){
        return toString.call(obj) === "[object Function]";
    }
    function isArray( obj ) {
        return toString.call(obj) === "[object Array]";
    }
    function now(){
        return (new Date).getTime();
    }
    function getText( elems ) {
        var ret = "", elem;
        for ( var i = 0; elems[i]; i++ ) {
            elem = elems[i];
            // Get the text from text nodes and CDATA nodes
            if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
                ret += elem.nodeValue;
                // Traverse everything else, except comment nodes
            } else if ( elem.nodeType !== 8 ) {
                ret += getText( elem.childNodes );
            }
        }
        return ret;
    }
    function hash2Str(obj){
        var ret = "";
        for(var i in obj){
            ret += (i + ":"+ obj[i]+";");
        }
        return ret.substring(0,ret.length-1);
    }

    /**
     * @desc 将"1758.65625px"  转成 1759 四舍五入
     * @param val
     * @returns {number}
     */
    function fixValue( val ){
        val = val.replace("px","");
        return Math.round(val - 0);
    }
    var Foto = function(selector,context){
        return new Foto.fn.init(selector,context);
    };
    //继承fish
    Foto.fn = Foto.prototype = new Fish();
    //声明extend方法 copy jQuery1.9.0
    Foto.extend = Foto.fn.extend = function() {
        // copy reference to target object
        var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;
        // Handle a deep copy situation
        if ( typeof target === "boolean" ) {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }
        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && !isFunction(target) ) {
            target = {};
        }
        // extend Foto itself if only one argument is passed
        if ( length === i ) {
            target = this;
            --i;
        }
        for ( ; i < length; i++ ) {
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) != null ) {
                // Extend the base object
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];
                    // Prevent never-ending loop
                    if ( target === copy ) {
                        continue;
                    }
                    // Recurse if we're merging object literal values or arrays
                    if ( deep && copy && ( Foto.isPlainObject(copy) || Foto.isArray(copy) ) ) {
                        var clone = src && ( Foto.isPlainObject(src) || Foto.isArray(src) ) ? src
                            : Foto.isArray(copy) ? [] : {};
                        // Never move original objects, clone them
                        target[ name ] = Foto.extend( deep, clone, copy );
                        // Don't bring in undefined values
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }
        // Return the modified object
        return target;
    };
    //扩展foto成员
    Foto.extend(Foto.fn,{
        constructor: Foto,
        init: function(selector,context){
            var fishes;
            if(typeof selector === "string"){
                var reg = /^(?:[^<]*(<[\w\W]+>)[^>]*$)/;
                fishes = reg.test(selector) ? fish.create(selector) : fish.all(selector,context);
            }else if(selector instanceof Foto){
                return selector;
            }else if(Foto.isFunction(selector)){
                return fish.ready(selector);
            }else{
                fishes = fish.all(selector, context);
            }
            return Foto.makeArray(fishes,this);
        },
        foto: "0.1.1",
        selector: "",
        length: 0,
        push: push,
        sort: [].sort,
        splice: [].splice,
        toArray: function(){
            return slice.call(this,0);
        },
        size: function(){
            return this.length;
        },
        eq: function(index){
            return index === -1 ? this.slice( index ) : this.slice( index, +index + 1 );
        },
        get: function(index){
            return index == null ? this.toArray() : index < 0 ? this.slice(index)[0] : this[index];
        },
        slice: function(){
            return Foto.makeArray(slice.apply(this,arguments),Foto());
        }
    });
    Foto.fn.init.prototype = Foto.fn;
    if(!window.jQuery){
        window.$ = Foto;
    }
    window.Foto = Foto;

    Foto.extend(Foto.fn,{
        /*
        * wrapAll、wrapInner、wrap、unwrap 使用频率极少
        * */
        wrapAll: function(){
            //todo
        },
        wrapInner: function(){
            //todo
        },
        wrap: function(){
            //todo
        },
        unwrap: function(){
            //todo
        },
        append: function(node){
            if(Foto.isArray(node) && node.length){
                for(var i=0;i<node.length;i++){
                    this.html("bottom",node[i]);
                }
                return this;
            }
            return this.html("bottom",node);
        },
        prepend: function(node){
            return this.html("top",node);
        },
        before: function(node){
            return this.html("before",node);
        },
        after: function(node){
            return this.html("after",node);
        },
        remove: function(){
            return this.html("remove");
        },
        add: function(elem){
            elem = typeof elem === "string" ? $(elem) :elem;
            return fish.add.call(this,elem);
        },
        appendTo: function(node){
            return $(node).append(this);
        },
        prependTo: function(node){
            return $(node).prepend(this);
        },
        prev: function(){
            return fish.previous.call(this);
        }
    });
    var contains = document.compareDocumentPosition ? function(a, b){
        return !!(a.compareDocumentPosition(b) & 16);
    } : function(a, b){
        return a !== b && (a.contains ? a.contains(b) : true);
    };
    Foto.extend(Foto,{
        isFunction: isFunction,
        isArray: isArray,
        text: getText,
        contains: contains,
        isWindow: function( obj ) {
            return obj && typeof obj === "object" && "setInterval" in obj;
        },
        merge: function( first, second ) {
            var i = first.length, j = 0;
            if ( typeof second.length === "number" ) {
                for ( var l = second.length; j < l; j++ ) {
                    first[ i++ ] = second[ j ];
                }
            } else {
                while ( second[j] !== undefined ) {
                    first[ i++ ] = second[ j++ ];
                }
            }
            first.length = i;
            return first;
        },
        inArray: function( elem, array ) {
            if ( array.indexOf ) {
                return array.indexOf( elem );
            }
            for ( var i = 0, length = array.length; i < length; i++ ) {
                if ( array[ i ] === elem ) {
                    return i;
                }
            }
            return -1;
        },
        makeArray: function( array, results ) {
            var ret = results || [];
            if ( array != null ) {
                // The window, strings (and functions) also have 'length'
                // The extra typeof function check is to prevent crashes
                // in Safari 2 (See: #3039)
                // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
                var type = typeof array;
                if ( array.length == null || type === "string" || type === "function" || type === "regexp" || Foto.isWindow( array ) ) {
                    push.call( ret, array );
                } else {
                    Foto.merge( ret, array );
                }
            }
            return ret;
        },
        isPlainObject: function( obj ) {
            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            if ( !obj || toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval ) {
                return false;
            }
            // Not own constructor property must be Object
            if ( obj.constructor
                && !hasOwnProperty.call(obj, "constructor")
                && !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
                return false;
            }
            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.
            var key;
            for ( key in obj ) {}
            return key === undefined || hasOwnProperty.call( obj, key );
        },
        //重写each方法，因为fish自身的each方法只带有1个参数
        each: function( object, callback, args ) {
            var name, i = 0,
                length = object.length,
                isObj = length === undefined || Foto.isFunction(object);
            if ( args ) {
                if ( isObj ) {
                    for ( name in object ) {
                        if ( callback.apply( object[ name ], args ) === false ) {
                            break;
                        }
                    }
                } else {
                    for ( ; i < length; ) {
                        if ( callback.apply( object[ i++ ], args ) === false ) {
                            break;
                        }
                    }
                }
                // A special, fast, case for the most common use of each
            } else {
                if ( isObj ) {
                    for ( name in object ) {
                        if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
                            break;
                        }
                    }
                } else {
                    for ( var value = object[0]; i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
                }
            }
            return object;
        },
        data: function(elem, name, data){
            //fish的成员方法data和css接收的当前对象必须为fish对象，所以必须要转成数组后才能使用
            var $elem = Foto(elem);
            return fish.data.call($elem,name,data);
        },
        css: function(elem,property,value){
            var param,$elem;
            $elem = Foto(elem);
            if(value == null){
                if(typeof property === "string"){
                    return fixValue(fish.getCss.call($elem,property));
                }else{
                    param = hash2Str(property);
                }
            }else{
                param = property + ":" +value;
            }
            return fish.css.call($elem,param);
        }
    });
    /*
    * support 模块
    * 直接 copy
    * */
    (function() {
        Foto.support = {};
        var root = document.documentElement,
            script = document.createElement("script"),
            div = document.createElement("div"),
            id = "script" + now();
        div.style.display = "none";
        div.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";
        var all = div.getElementsByTagName("*"),
            a = div.getElementsByTagName("a")[0];
        // Can't get basic test support
        if ( !all || !all.length || !a ) {
            return;
        }
        Foto.support = {
            // IE strips leading whitespace when .innerHTML is used
            leadingWhitespace: div.firstChild.nodeType === 3,
            // Make sure that tbody elements aren't automatically inserted
            // IE will insert them into empty tables
            tbody: !div.getElementsByTagName("tbody").length,
            // Make sure that link elements get serialized correctly by innerHTML
            // This requires a wrapper element in IE
            htmlSerialize: !!div.getElementsByTagName("link").length,
            // Get the style information from getAttribute
            // (IE uses .cssText insted)
            style: /red/.test( a.getAttribute("style") ),
            // Make sure that URLs aren't manipulated
            // (IE normalizes it by default)
            hrefNormalized: a.getAttribute("href") === "/a",
            // Make sure that element opacity exists
            // (IE uses filter instead)
            // Use a regex to work around a WebKit issue. See #5145
            opacity: /^0.55$/.test( a.style.opacity ),
            // Verify style float existence
            // (IE uses styleFloat instead of cssFloat)
            cssFloat: !!a.style.cssFloat,
            // Make sure that if no value is specified for a checkbox
            // that it defaults to "on".
            // (WebKit defaults to "" instead)
            checkOn: div.getElementsByTagName("input")[0].value === "on",
            // Make sure that a selected-by-default option has a working selected property.
            // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
            optSelected: document.createElement("select").appendChild( document.createElement("option") ).selected,
            parentNode: div.removeChild( div.appendChild( document.createElement("div") ) ).parentNode === null,
            // Will be defined later
            deleteExpando: true,
            checkClone: false,
            scriptEval: false,
            noCloneEvent: true,
            boxModel: null
        };
        script.type = "text/javascript";
        try {
            script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
        } catch(e) {}
        root.insertBefore( script, root.firstChild );
        // Make sure that the execution of code works by injecting a script
        // tag with appendChild/createTextNode
        // (IE doesn't support this, fails, and uses .text instead)
        if ( window[ id ] ) {
            Foto.support.scriptEval = true;
            delete window[ id ];
        }
        // Test to see if it's possible to delete an expando from an element
        // Fails in Internet Explorer
        try {
            delete script.test;
        } catch(e) {
            Foto.support.deleteExpando = false;
        }
        root.removeChild( script );
        if ( div.attachEvent && div.fireEvent ) {
            div.attachEvent("onclick", function click() {
                // Cloning a node shouldn't copy over any
                // bound event handlers (IE does this)
                Foto.support.noCloneEvent = false;
                div.detachEvent("onclick", click);
            });
            div.cloneNode(true).fireEvent("onclick");
        }
        div = document.createElement("div");
        div.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";
        var fragment = document.createDocumentFragment();
        fragment.appendChild( div.firstChild );
        // WebKit doesn't clone checked state correctly in fragments
        Foto.support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

        // Figure out if the W3C box model works as expected
        // document.body must exist before we can do this
        Foto(function() {
            var div = document.createElement("div");
            div.style.width = div.style.paddingLeft = "1px";
            document.body.appendChild( div );
            Foto.boxModel = Foto.support.boxModel = div.offsetWidth === 2;
            document.body.removeChild( div ).style.display = 'none';
            div = null;
        });
        // Technique from Juriy Zaytsev
        // http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
        var eventSupported = function( eventName ) {
            var el = document.createElement("div");
            eventName = "on" + eventName;
            var isSupported = (eventName in el);
            if ( !isSupported ) {
                el.setAttribute(eventName, "return;");
                isSupported = typeof el[eventName] === "function";
            }
            el = null;
            return isSupported;
        };
        Foto.support.submitBubbles = eventSupported("submit");
        Foto.support.changeBubbles = eventSupported("change");
        // release memory in IE
        root = script = div = all = a = null;
    })();
    var r20 = /%20/g;
    /*
    * ajax 模块
    * copy api
    * */
    Foto.extend({
        get: function( url, data, callback, type ) {
            if ( Foto.isFunction( data ) ) {
                type = type || callback;
                callback = data;
                data = null;
            }
            return Foto.ajax({
                type: "GET",
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        },
        getScript: function( url, callback ) {
            return Foto.get(url, null, callback, "script");
        },
        getJSON: function( url, data, callback ) {
            return Foto.get(url, data, callback, "json");
        },
        post: function( url, data, callback, type ) {
            if ( Foto.isFunction( data ) ) {
                type = type || callback;
                callback = data;
                data = {};
            }
            return Foto.ajax({
                openType: "POST",
                url: url,
                data: data && Foto.param(data),
                fn: callback,
                type: type
            });
        },
        ajaxSettings: {
            url: location.href,
            global: true,
            type: "GET",
            contentType: "application/x-www-form-urlencoded",
            processData: true,
            async: true,
            // Create the request object; Microsoft failed to properly
            // implement the XMLHttpRequest in IE7 (can't request local files),
            // so we use the ActiveXObject when it is available
            // This function can be overridden by calling Foto.ajaxSetup
            xhr: window.XMLHttpRequest && (window.location.protocol !== "file:" || !window.ActiveXObject) ?
                function() {
                    return new window.XMLHttpRequest();
                } :
                function() {
                    try {
                        return new window.ActiveXObject("Microsoft.XMLHTTP");
                    } catch(e) {}
                },
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                script: "text/javascript, application/javascript",
                json: "application/json, text/javascript",
                text: "text/plain",
                _default: "*/*"
            }
        },
        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},
        handleError: function( s, xhr, status, e ) {
        },
        // Counter for holding the number of active queries
        active: 0,
        // Determines if an XMLHttpRequest was successful or not
        httpSuccess: function( xhr ) {
        },
        // Determines if an XMLHttpRequest returns NotModified
        httpNotModified: function( xhr, url ) {
        },
        httpData: function( xhr, type, s ) {
        },
        // Serialize an array of form elements or a set of
        // key/values into a query string
        param: function( a, traditional ) {
            function buildParams( prefix, obj ) {
                if ( Foto.isArray(obj) ) {
                    // Serialize array item.
                    Foto.each( obj, function( i, v ) {
                        if ( traditional || /\[\]$/.test( prefix ) ) {
                            // Treat each array item as a scalar.
                            add( prefix, v );
                        } else {
                            // If array item is non-scalar (array or object), encode its
                            // numeric index to resolve deserialization ambiguity issues.
                            // Note that rack (as of 1.0.0) can't currently deserialize
                            // nested arrays properly, and attempting to do so may cause
                            // a server error. Possible fixes are to modify rack's
                            // deserialization algorithm or to provide an option or flag
                            // to force array serialization to be shallow.
                            buildParams( prefix + "[" + ( typeof v === "object" || Foto.isArray(v) ? i : "" ) + "]", v );
                        }
                    });
                } else if ( !traditional && obj != null && typeof obj === "object" ) {
                    // Serialize object item.
                    Foto.each( obj, function( k, v ) {
                        buildParams( prefix + "[" + k + "]", v );
                    });
                } else {
                    // Serialize scalar item.
                    add( prefix, obj );
                }
            }
            function add( key, value ) {
                // If value is a function, invoke it and return its value
                value = Foto.isFunction(value) ? value() : value;
                s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
            }
            var s = [];
            // Set traditional to true for Foto <= 1.3.2 behavior.
            if ( traditional === undefined ) {
                traditional = Foto.ajaxSettings.traditional;
            }
            // If an array was passed in, assume that it is an array of form elements.
            if ( Foto.isArray(a) || a.foto ) {
                // Serialize the form elements
                Foto.each( a, function() {
                    add( this.name, this.value );
                });
            } else {
                // If traditional, encode the "old" way (the way 1.3.2 or older
                // did it), otherwise encode params recursively.
                for ( var prefix in a ) {
                    buildParams( prefix, a[prefix] );
                }
            }
            // Return the resulting serialization
            return s.join("&").replace(r20, "+");
        }

    });
    function modifyUrl(url){
        if(!url){
            return;
        }
        var domain = "www.ly.com";
        var ipMap = ["61.155.159.91"];
        var location = window.location.href;
        var isPreview = (function(){
            return /(dj|predj)(?=\.ly\.com)/.test(location) || location.indexOf("tcpmspreview=true") > -1;
        })();
        if(!isPreview) {
            url = url.replace(/(dj|predj)(?=\.ly\.com)/,"www");
            for(var i= 0,len = ipMap.length;i<len;i++){
                url = url.replace(ipMap[i],domain);
            }
        }
        return url;
    }
    Foto.extend(Foto,{
        ajax: function(config){
            var url = modifyUrl(config.url);
            var fishParam = Foto.extend({},Foto.ajaxSettings,{
                "type": config.dataType,
                "openType": config.type,
                "url": url,
                "data": config.data && Foto.param(config.data),
                "sync": !config.async,
                "fn": config.success,
                "err": config.error,
                "timeout": config.timeout,
                "onTimeout": config.onTimeout,
                "cache": config.cache,
                "headers": config.headers
            });
            return fish.ajax(fishParam);
        }
    });
    /*
    * deffered 模块
    * 直接copy
    * 功能暂未实现
    * */
    /*Foto.extend({
        Deferred: function( func ) {
            var tuples = [
                    // action, add listener, listener list, final state
                    [ "resolve", "done", Foto.Callbacks("once memory"), "resolved" ],
                    [ "reject", "fail", Foto.Callbacks("once memory"), "rejected" ],
                    [ "notify", "progress", Foto.Callbacks("memory") ]
                ],
                state = "pending",
                promise = {
                    state: function() {
                        return state;
                    },
                    always: function() {
                        deferred.done( arguments ).fail( arguments );
                        return this;
                    },
                    then: function( *//* fnDone, fnFail, fnProgress *//* ) {
                        var fns = arguments;
                        return Foto.Deferred(function( newDefer ) {
                            Foto.each( tuples, function( i, tuple ) {
                                var action = tuple[ 0 ],
                                    fn = fns[ i ];
                                // deferred[ done | fail | progress ] for forwarding actions to newDefer
                                deferred[ tuple[1] ]( Foto.isFunction( fn ) ?
                                        function() {
                                            var returned = fn.apply( this, arguments );
                                            if ( returned && Foto.isFunction( returned.promise ) ) {
                                                returned.promise()
                                                    .done( newDefer.resolve )
                                                    .fail( newDefer.reject )
                                                    .progress( newDefer.notify );
                                            } else {
                                                newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, [ returned ] );
                                            }
                                        } :
                                        newDefer[ action ]
                                );
                            });
                            fns = null;
                        }).promise();
                    },
                    // Get a promise for this deferred
                    // If obj is provided, the promise aspect is added to the object
                    promise: function( obj ) {
                        return obj != null ? Foto.extend( obj, promise ) : promise;
                    }
                },
                deferred = {};
            // Keep pipe for back-compat
            promise.pipe = promise.then;
            // Add list-specific methods
            Foto.each( tuples, function( i, tuple ) {
                var list = tuple[ 2 ],
                    stateString = tuple[ 3 ];
                // promise[ done | fail | progress ] = list.add
                promise[ tuple[1] ] = list.add;
                // Handle state
                if ( stateString ) {
                    list.add(function() {
                        // state = [ resolved | rejected ]
                        state = stateString;
                        // [ reject_list | resolve_list ].disable; progress_list.lock
                    }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
                }
                // deferred[ resolve | reject | notify ]
                deferred[ tuple[0] ] = function() {
                    deferred[ tuple[0] + "With" ]( promise, arguments );
                    return this;
                };
                deferred[ tuple[0] + "With" ] = list.fireWith;
            });
            // Make the deferred a promise
            promise.promise( deferred );
            // Call given func if any
            if ( func ) {
                func.call( deferred, deferred );
            }
            // All done!
            return deferred;
        },
        // Deferred helper
        when: function( subordinate *//* , ..., subordinateN *//* ) {
            var i = 0,
                resolveValues = slice.call( arguments ),
                length = resolveValues.length,
            // the count of uncompleted subordinates
                remaining = length !== 1 || ( subordinate && Foto.isFunction( subordinate.promise ) ) ? length : 0,
            // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
                deferred = remaining === 1 ? subordinate : Foto.Deferred(),
            // Update function for both resolve and progress values
                updateFunc = function( i, contexts, values ) {
                    return function( value ) {
                        contexts[ i ] = this;
                        values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
                        if( values === progressValues ) {
                            deferred.notifyWith( contexts, values );
                        } else if ( !( --remaining ) ) {
                            deferred.resolveWith( contexts, values );
                        }
                    };
                },
                progressValues, progressContexts, resolveContexts;
            // add listeners to Deferred subordinates; treat others as resolved
            if ( length > 1 ) {
                progressValues = new Array( length );
                progressContexts = new Array( length );
                resolveContexts = new Array( length );
                for ( ; i < length; i++ ) {
                    if ( resolveValues[ i ] && Foto.isFunction( resolveValues[ i ].promise ) ) {
                        resolveValues[ i ].promise()
                            .done( updateFunc( i, resolveContexts, resolveValues ) )
                            .fail( deferred.reject )
                            .progress( updateFunc( i, progressContexts, progressValues ) );
                    } else {
                        --remaining;
                    }
                }
            }
            // if we're not waiting on anything, resolve the master
            if ( !remaining ) {
                deferred.resolveWith( resolveContexts, resolveValues );
            }
            return deferred.promise();
        }
    });*/
    var elemdisplay = {};
    Foto.extend(Foto.fn,{
        attr: function(property,value){
            if (arguments.length === 1 && typeof property === "object"){
                for(var i in property){
                    fish.attr.call(this,i,property[i]);
                }
                return this;
            }else{
                return fish.attr.apply(this,arguments);
            }
            /*fish部分用法没做兼容处理
            * $("div").attr("class")      // <ie9 null
            * <input checked = "true" />  $("input").attr("checked")  // ie true chrome undefined
            * 在使用的时候要避免上述用法
            * */
        },
        css: function(property,value){
            return Foto.css(this,property,value);
        },
        text: function(text) {
            if ( Foto.isFunction(text) ) {
                return this.each(function(i) {
                    var self = Foto(this);
                    self.text( text.call(this, i, self.text()) );
                });
            }
            if ( typeof text !== "object" && text !== undefined ) {
                return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
            }
            return Foto.text( this );
        },
        empty: function(){
            for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
                // Remove element nodes and prevent memory leaks
                //if ( elem.nodeType === 1 ) {
                //    Foto.cleanData( elem.getElementsByTagName("*") );
                //}
                // Remove any remaining nodes
                while ( elem.firstChild ) {
                    elem.removeChild( elem.firstChild );
                }
            }
            return this;
        },
        hasClass: function(className){
            for(var i = 0,len = this.length;i < len;i++){
                var classes = this[i].className;
                if(typeof classes === "object"){
                    for(var j in classes){
                        if(j === className){
                            return true;
                        }
                    }
                }else{
                    if(fish.hasClass.call(this,className)){
                        return true;
                    }
                }
            }
            return false;
        },
        index: function( elem ) {
            if ( !elem || typeof elem === "string" ) {
                return Foto.inArray( this[0],
                    // If it receives a string, the selector is used
                    // If it receives nothing, the siblings are used
                    elem ? Foto( elem ) : this.parent().children() );
            }
            // Locate the position of the desired element
            return Foto.inArray(
                // If it receives a Foto object, the first element is used
                elem.foto ? elem[0] : elem, this );
        },
        siblings: function(elem){
            return Foto.makeArray(this.sibling(elem ? elem : true),Foto());
        },
        children: function(elem){
            var ret = [],t = [];
            this.each(function(){
                var nodes = this.childNodes;
                for(var i=0;i<nodes.length;i++){
                    nodes[i].nodeType === 1 && t.push(nodes[i]);
                }
                if(elem != null){
                    $(elem).each(function(){
                        Foto.inArray(this,ret) && t.push(this);
                    });
                }else{
                    ret = t;
                }
            });
            return Foto.makeArray(ret,Foto());
        },
        parent: function(elem){
            var ret = [],
                filter = typeof elem === "string";
            this.each(function(){
                var parent = this.parentNode && this.parentNode.nodeType !== 11 ? this.parentNode : null;
                if(filter && Foto.inArray(parent,Foto(elem))<0){
                    return
                }
                ret.push(parent);
            });
            return Foto.makeArray(ret,Foto());
        },
        parents: function(elem){
            return fish.parent.call(this,elem);
        },
        hide: function(){
            for ( var i = 0, l = this.length; i < l; i++ ) {
                var old = Foto.data(this[i], "olddisplay");
                if ( !old && old !== "none" ) {
                    Foto.data(this[i], "olddisplay", Foto.css(this[i], "display"));
                }
            }
            // Set the display of the elements in a second loop
            // to avoid the constant reflow
            for ( var j = 0, k = this.length; j < k; j++ ) {
                this[j].style.display = "none";
            }
            return this;
        },
        show: function(){
            for ( var i = 0, l = this.length; i < l; i++ ) {
                var old = Foto.data(this[i], "olddisplay");
                this[i].style.display = old || "";
                if ( Foto.css(this[i], "display") === "none" ) {
                    var nodeName = this[i].nodeName, display;
                    if ( elemdisplay[ nodeName ] ) {
                        display = elemdisplay[ nodeName ];
                    } else {
                        var elem = Foto("<" + nodeName + " />").appendTo("body");
                        display = elem.css("display");
                        if ( display === "none" ) {
                            display = "block";
                        }
                        elem.remove();
                        elemdisplay[ nodeName ] = display;
                    }
                    Foto.data(this[i], "olddisplay", display);
                }
            }
            // Set the display of the elements in a second loop
            // to avoid the constant reflow
            // 注:js取属性值会造成reflow，所以把数据保存在data中避免不必要的relow
            for ( var j = 0, k = this.length; j < k; j++ ) {
                this[j].style.display = Foto.data(this[j], "olddisplay") || "";
            }
            return this;
        },
        find: function(elem){
            return Foto.makeArray(fish.children.call(this,elem),Foto());
        },
        not: function(elem){
            if(this.length){
                var elems = Foto(elem);
                for(var i= 0,l= elems.length;i<l;i++){
                    var index = this.indexOf(elems[i]);
                    if(index > -1){
                        this.splice(index,1);
                    }
                }
            }
            return this;
        }
    });
    Foto.extend({
        sibling: function( n, elem ) {
            var r = [];
            for ( ; n; n = n.nextSibling ) {
                if ( n.nodeType === 1 && n !== elem ) {
                    r.push( n );
                }
            }
            return r;
        }
    });
    Foto.extend({
        cache: {},
        guid: fish.guid(),
        uid: 1//对象计数器
    });
    Foto.extend(Foto.fn,{
        animate: function(prop, speed, easing, callback){
            return fish.anim.call(this,hash2Str(prop),speed,easing,callback);
        },
        /**
         * @desc 扩展on方法
         * @usage $().on("click",fn) $().on("click",".class",fn) $().on("click",fn,1) $().on("click",".class",fn,1) $().on("event1",function(){}) $().on("event1",function(){},1)
         * @param type
         * @param selector
         * @param callback
         * @param one
         * @param flag 内部使用
         * @returns {*}
         */
        on: function(type,selector,callback,one,flag){
            if(Foto.isFunction(selector)){
                one = callback;
                callback = selector;
                selector = undefined;
            }
            if(!callback){
                return;
            }
            Foto.each(this,function(){
                var
                    guid = Foto.guid,
                    uid = this[guid],
                    cache = Foto.cache;
                var originCallback = callback;
                callback = function(event){
                    var target = event.target = event.srcElement || event.target || event.delegateTarget;
                    if ( !event.relatedTarget && event.fromElement ) {
                        event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
                    }
                    var related = event.relatedTarget;
                    if (flag) {
                        var fix;
                        if(type === "mouseover"){
                            fix = "mouseenter";
                        }
                        if(type === "mouseout"){
                            fix = "mouseleave";
                        }
                        event.type = fix;
                        if ( !related || (related !== target && !Foto.contains( target, related )) ) {
                            originCallback.call(this,event);
                        }
                    } else {
                        originCallback.call(this, event);
                    }
                    if(one === 1){
                        this.off(type,callback,selector);
                    }
                };
                if(!uid){
                    uid = this[guid] = Foto.uid++;
                }
                if(!cache[uid]){
                    cache[uid] = {};
                }
                if(!cache[uid][type]){
                    cache[uid][type] = [];
                }
                cache[uid][type].push({
                    type: type,
                    handler: callback
                });
                callback.uid = Foto.uid++;
                fish.on.call(fish.one(this),type,callback,selector);
            });
        },
        trigger: function(type,data){
            var cache = Foto.cache,
                guid = Foto.guid;
            Foto.each(this,function(){
                var uid = this[guid],
                    events;
                if(uid){
                    events = cache[uid][type] || [];
                    for(var i =0;i<events.length;i++){
                        events[i].handler.call(this,{target: this,type: type},data);
                    }
                }
            });
        },
        off: function(type,callback,selector){
            var cache = Foto.cache,
                guid = Foto.guid;
            Foto.each(this,function(){
                var uid = this[guid];
                if(cache[uid]){
                    delete cache[uid][type];
                }
                fish.off.call(Foto(this),type,callback,selector);
            });
        }
    });
    //部分事件不兼容
    var event = "blur focus focusin focusout load resize scroll unload click dblclick " +
          "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
          "change select submit keydown keypress keyup error contextmenu";
    Foto.each(event.split(" "),function(i, name){
        Foto.fn[name] = function(callback,one){
            return this.on(name,undefined,callback,one);
        };
    });
    Foto.each({
        "mouseenter": "mouseover",
        "mouseleave": "mouseout"
    },function(ori,name){
        Foto.fn[ori] = function(callback,one){
            return this.on(name,undefined,callback,one,true);
        };
    });
})(window,fish);
