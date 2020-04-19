/*****************************************************
 example:
 ------------------------------------------------------
 $('#test').tabwipe({
    callback : function(index){
        $('.list-style').removeClass('cur').eq(index).addClass('cur');
    }
});

 version:1.0
 copyright: http://www.mjix.com，测试页面：http://test.mjix.com
 *******************************************************/

(function($) {
    $.fn.tabwipe = function(settings){
        var config = {
            done_process : 0.15, //超过0.2则跳转
            ani_time : 300, //动画时间
            max_speed:800, //超过速度跳转
            is_circle : true, //循环滚动
            callback : function(){},
            center: true,
            defaultIndex: 0,
            item:{
                number: 1
            }
        };
        if (settings) $.extend(config, settings);
        var that = $(this).eq(0);

        var main_box = that, box_width, tauching = false, tauch_stop = 0,in_screen_num;
        var lis=main_box.children(), li_len = lis.length,index= config.center?Math.ceil(li_len/2)-1: config.defaultIndex;
        var leftIndex =  config.defaultIndex || 0;
        var extra_width,
        //如果长度为奇数,则给nav-list增加一个样式,用来控制底色
            parentCls = li_len%2?"single":"double";

        $(".nav-list").addClass(parentCls);
        var init = function(){
            config.callback.call(this, index);
            if(!config.is_circle) return ;
            main_box.append(lis.eq(0).clone());
        };

        var _move = function(_index,cancle,callerIsOther){
            //index为之前高亮的位置
            //o_index为备份之前高亮的位置
            //leftIndex为tab偏移的位置
            //_index = 目前需要高亮的位置
                var o_index = index, dis,isOver = false;
                index = _index;

            if(_index<0){
                if(config.is_circle){
                    _index = li_len-1;
                    index = li_len-1;
                }else{
                    index = _index = 0;
                    leftIndex = 0;
                }
            }else if(_index>=li_len){
                if(config.is_circle){
                    _index = li_len;
                    index = 0;
                }else{
                    isOver = true;
                    index = _index = li_len-1;
                    leftIndex = li_len - in_screen_num;
                }
            }else if(_index >=leftIndex+in_screen_num){
                leftIndex = _index + 1 - in_screen_num;
                index = _index;
                //index = _index = li_len-in_screen_num;
            }else if(_index < leftIndex){
                leftIndex = _index;
                index = _index;
            }else if(!callerIsOther){
                if(li_len > in_screen_num){
                    leftIndex = _index > li_len - in_screen_num ? li_len -in_screen_num : _index;
                }
            }
            //if(config.center||_index< o_index){
            //    dis = -box_width*_index + extra_width;
            //}
            //if(config.center || in_screen_num === 1 || !callerIsOther){
            //    leftIndex = _index;
            //}else{
            //    if(leftIndex > _index || isOver){
            //        leftIndex = index;
            //    }
            //    //if(_index+ in_screen_num >= li_len){
            //    //    dis = -box_width* (li_len-in_screen_num)+extra_width;
            //    //}else{
            //    //    dis = -box_width*o_index + extra_width;
            //    //}
            //
            //}
            dis = -box_width * leftIndex +extra_width;
            $(main_box).animate({left:dis}, config.ani_time, 'ease-out', function(){
                if(o_index == index%li_len) return ;
                if(!cancle){
                    config.callback.call(this, index%li_len,leftIndex||0);
                }

            });
        };
        function getDiff(wrapper){
            var screen_width = wrapper.parent().width(),
                em_width_str = $("html").css("font-size"),
                em_width = parseInt(em_width_str);
            return screen_width/2 - 1/2*box_width + 2/14 * em_width;
        }
        var add_listen = function(){
            //box_width = main_box.parent().width();
            var screen_width = main_box.parent().width(),
                em_width_str = $("html").css("font-size"),
                em_width = parseInt(em_width_str);
            if(config.item.width){
                box_width = config.item.width * em_width;
                in_screen_num = Math.floor(screen_width/box_width);
            }else{
                box_width = screen_width / config.item.number;
                in_screen_num = config.item.number;
            }
            var max_num = li_len;
            extra_width = (config.getDiff||getDiff)(main_box);
            var diff  = (index)*box_width - extra_width;
            main_box.css({'left': -diff}).show();


            var change_env = function(obj, data){
                if(index == li_len && data.dx>0 && config.is_circle){
                    index = 0;
                }else if(index == 0 && data.dx<0 && config.is_circle){
                    index = max_num;
                }
                if(index < max_num){
                    var dis = -index*box_width-data.dx + extra_width;
                    $(obj).css({'left':dis});
                }
            };

            var clear_env = function(obj, data){
                var dis = 0, adx=Math.abs(data.dx);
                var mspeed = data.speed > config.max_speed;
                //debugger;
                if(mspeed || adx/box_width > config.done_process){
                    var flag = Math.round(data.dx/box_width);
                    var dex = index + flag;
                    _move(leftIndex+flag);
                }else{
                    _move(leftIndex);
                }
                //config.callback.call(this, index);
            };

            main_box.touchwipe({
                listen:'x',
                start : function(){
                    tauching = true;
                },

                stop : function(data){
                    tauching = false;
                    tauch_stop = new Date().getTime();
                    clear_env(this, data);
                    return ;
                },

                move : function(data){
                    //改变当前状态
                    return change_env(this, data);
                },
                extraEl: ".nav-item-hover"
            });
        };

        init.call(that);
        add_listen.call(that);

        $(window).bind('resize', function(){
            add_listen.call(that);
        });

        return {
            getDiff: getDiff,
            move : function(_indx,flag){
                _indx = _indx<0 ? (_indx%li_len)+li_len : _indx;
                _move(_indx,null,flag);
            },

            next : function(){
                if(config.is_circle){
                    index==0 && main_box.css({'left':0});
                }else{
                    index = index+1>=li_len ? -1 : index;
                }

                _move(index+1);
            },

            prev : function(){
                _move(index-1);
            },

            interval : function(time, touch_delay_loop){
                time = time || 3000;
                touch_delay_loop = touch_delay_loop || 2000;
                var that = this;
                setInterval(function(){
                    if(tauching) return ;
                    if(new Date().getTime()-tauch_stop<touch_delay_loop) return ;

                    that.next();
                }, time);
            }
        };
    };

})($);
