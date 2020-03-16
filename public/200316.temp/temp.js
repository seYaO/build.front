var now_MemberId;
var isTime = true, isOver = true;
var overScore;//游戏结束的总成绩


//click事件,领奖进程显示，领红包礼包，抽奖。
var playFn = {
    yzFn: function (num) {//验证可否领红包,红包按钮是否可点的显示
        var _list = $(".pro_list li");
        var _pro = $(".pro_con li");
        if (num >= 10000) {
            _list.addClass("on");
            _pro.addClass("on");
        } else if (num >= 5000 && num < 10000) {
            _list.eq(0).addClass("on");
            _list.eq(1).addClass("on");
            _pro.eq(0).addClass("on");
            _pro.eq(1).addClass("on");

        } else if (num >= 2000 && num < 5000) {
            _list.eq(0).addClass("on");
            _pro.eq(0).addClass("on");
        } else {

        }
    },
    lingFn: function (lingType, cid, num, pri) {
        $.ajax({
            url: "/scenery/AjaxHelper/ZhuanTiHelp/ZTAjaxCall.aspx?action=" + lingType + "&Name = " + weixinInfo.nickname + "&ChannelID=" + cid + "&nr=" + pri + "&openid=" + weixinInfo.openid + "&MemberId=" + now_MemberId,
            dataType: "json",
            success: function (data) {
                if (data.State == 5 || data.State == 6) {//领取成功
                    $.dialog({
                        dialogType: "result_box",
                        beforeFn: function () {
                            $(".result").html("");
                            $(".result").append('<p>' + data.Magess + '</p> <div class="result_btn"> <div class="btns"> <a href="http://www.ly.com/scenery/zhuanti/jqshuqit/" class="use_btn">去暑促主会场逛逛</a> </div> </div>');
                        },
                        fn: function () {//关闭回调
                            $(".pro_con ul li").eq(num).removeClass("on").find(".go").text("已领取").addClass("grey");

                            $(".grey").on("click", function () {
                                $.dialog({
                                    dialogType: "hb_result",
                                    beforeFn: function () {

                                        if (overScore < 5000) {
                                            $(".hbResult").html('<p>快去玩漂流<br>再前进' + Number(5000 - overScore) + '米就可以领取哦</p>');
                                        } else {
                                            $(".hbResult").html('<p>快去玩漂流<br>再前进' + Number(10000 - overScore) + '米就可以抽取哦</p>');
                                        }

                                    },
                                    fn: function () {//关闭回调

                                    }
                                });
                            });
                        }
                    });
                } else {
                    $.dialog({
                        dialogType: "result_box",
                        beforeFn: function () {
                            $(".result p").html("");
                            $(".result").append('<p>' + data.Magess + '</p>');
                        },
                        fn: function () {//关闭回调
                        }
                    });
                }
            }
        });
    },
    drawInfor: function () {
        $.ajax({
            url: "/zhuanti/api/CMSLotteryService/WxGetStayNum",
            type: "POST",
            data: '{"EventId":470, "MemberId":' + now_MemberId + ', "Wxlname" :"null", "Wxmname" :"null", "Wxip" :"null", "Phonenumber" :"null"}',
            contentType: "application/json",
            success: function (e) {
                if (e.ActivityStatus == -1) {
                    $.dialog({
                        dialogType: "result_box",
                        beforeFn: function () {
                            $(".result").html("");
                            $(".result").append('<p>活动未开始<br>敬请期待~~~</p>');
                        },
                        fn: function () {//关闭回调
                        }
                    });
                } else if (e.ActivityStatus == 0) {
                    $.dialog({
                        dialogType: "result_box",
                        beforeFn: function () {
                            $(".result").html("");
                            $(".result").append('<p>活动已经结束喽<br>下次早点来奥</p>');
                        },
                        fn: function () {//关闭回调
                        }
                    });
                } else if (e.UserallSurplus < 1) {
                    $.dialog({
                        dialogType: "result_box",
                        beforeFn: function () {
                            $(".result").html("");
                            $(".result").append('<p>您已经抽过奖了奥~~~</p><div class="result_btn"> <div class="btns"> <a href="http://www.ly.com/scenery/zhuanti/jqshuqit/" class="use_btn">去暑促主会场逛逛</a> </div> </div>');
                        },
                        fn: function () {//关闭回调
                        }
                    });
                } else {//可以参与抽奖
                    playFn.drawModel()
                }
            }
        });
    },
    drawModel: function () {
        $.ajax({
            url: "/scenery/AjaxHelper/ZhuanTiHelp/ZTAjaxCall.aspx?action=GETCHOUJIANG&EventId=470&MemberId=" + now_MemberId + "&Wxlname=null&Wxmname=null&Phonenumber=null&openid=" + weixinInfo.openid,
            dataType: "json",
            success: function (data) {
                var _message = data.Magess;
                var _State = data.State;

                if (_State == 1194) {
                    playFn.lingFn("GETSPMLIBAO", 10522, 2, _message);
                } else if (_State == 1195) {
                    playFn.lingFn("GETSPMLIBAO", 10522, 2, _message);
                } else {
                    playFn.lingFn("GETSPMLIBAO", 10522, 2);
                }

            }
        }
        );
    },
    shareTxt: function () {
        $.dialog({
            dialogType: "share_bg",
            beforeFn: function () {
                var num = Number(10000 - timeFn.num - Number($(".show_mile span").text())) <= 0 ? 0 : Number(10000 - timeFn.num - Number($(".show_mile span").text()));
                shareImg = "http://img1.40017.cn/cn/s/2016/touch/zt/45596/share.jpg";
                shareTitle = "" + weixinInfo.nickname + "玩大漂流离终极大奖还有" + num + "米，神队友快来助我一臂之力！";
                shareUrl = "http://www.ly.com/scenery/zhuanti/jqpiaoliu?friId={" + weixinInfo.openid + "," + weixinInfo.nickname + "," + encodeURI(weixinInfo.headimgurl) + "}";
                shareDesc = "玩大漂流游戏抢ipad mini，288现金券，海量红包，同程景区2016暑期大促炫酷开场";
                setShareFun.Pageview = "/Touch站专题/漂流达人";
                //微信中
                setShareFun.shareCode = "10003-2003-0";
                setShareFun.changeShareInfo();
            },
            fn: function () {//关闭回调

            }
        });
    },
    clickFn: function () {
        var _left = $(".left");
        var _right = $(".right");
        _left.on("touchstart", function () {
            Game.shipLeft();
        });
        _right.on("touchstart", function () {
            Game.shipRight();
        });

        $(".win_on_btn,.share_click").on("click", function () {
            playFn.shareTxt();
        });

        $(".share_bg").on("click", function () {
            location.reload();
        });

        $(".win_over_btn span").on("click", function () {//先判断登录在抽奖
            if ($.cookie("us")) {
                var uMemberIDRight = $.cookie("us").split("=")[1];
                var uId = uMemberIDRight.split("&")[0];
                now_MemberId = uId ? uId : "";
            }
            if (now_MemberId == "" || now_MemberId == undefined) {               //未登录
                var nowHref = window.location.href;
                window.location.href = "https://passport.ly.com/m/login.html?returnUrl=" + encodeURIComponent(nowHref);
            } else {
                playFn.drawInfor();
                //playFn.lingFn("GETSPMLIBAO", 10522, 2);
            }
        });

    },
    init: function () {
        this.clickFn();
    }
};

//弹框领红包操作
// 换验证码操作
var codeImg = {
    changeImg: function () {
        $("#codeImg").click(function () {
            codeImg.imgChange();
        });
    },
    imgChange: function () {
        var version = Math.random();
        $("#codeImg").attr("src", "/scenery/AjaxHelper/ValidPic.aspx?methed=GETIMAGECODE&mode=3&v=" + version);
    },
    init: function () {
        this.imgChange();
        this.changeImg();
    }
};
var hbFn = {
    mobileReg: /^0?(13|14|15|18|17)[0-9]{9}$/,
    clickType: true,
    focusFn: function () {
        $(".tel,.checkCode").focus(function () {
            $(this).val("").removeClass("err");
        })
    },
    checkFn: function () {
        var mobile = $(".tel").val(),
            codeInput = $(".checkCode").val();
        if (mobile == "") {
            $(".tel").addClass("err").val("!手机号不能为空");
            return false;
        }
        else if (codeInput == "") {
            $(".checkCode").addClass("err").val("!请输入验证码");
            return false;
        } else if (!hbFn.mobileReg.test(mobile)) {
            $(".tel").addClass("err").val("!手机号格式错误");
            return false;
        } else {
            return true;
        }
    },
    lingFn: function (hbid) {
        var phoneNumber = $(".tel").val();
        var codeNum = $(".checkCode").val();
        $.ajax({
            url: "/scenery/AjaxHelper/ZhuanTiHelp/ZTAjaxCall.aspx?action=GETSPMHONGBAO&ChannelID=" + hbid + "&Mobile=" + phoneNumber + "&code=" + codeNum,
            dataType: "json",
            success: function (data) {
                var nowState = data.State;
                if (nowState == 5) {
                    $.dialog({
                        dialogType: "hb_result",
                        beforeFn: function () {
                            $(".hbResult").html('<p>5元景点红包到手<br>领了不用岂不浪费</p><a href="http://www.ly.com/scenery/zhuanti/jqshuqit/">去主会场逛逛</a>');
                        },
                        fn: function () {//关闭回调

                        }
                    });
                } else if (nowState == 6) {
                    $.dialog({
                        dialogType: "hb_result",
                        beforeFn: function () {
                            $(".hbResult").html('<p>5元景点红包已经领过喽<br>领了不用岂不浪费</p><a href="http://www.ly.com/scenery/zhuanti/jqshuqit/">去主会场逛逛</a>');
                        },
                        fn: function () {//关闭回调

                        }
                    });
                } else if (data.State == "7") {
                    $(".checkCode").addClass("err").val("!验证码错误");
                    codeImg.imgChange();
                } else {
                    $.dialog({
                        dialogType: "hb_result",
                        beforeFn: function () {
                            $(".hbResult").html('<p>' + data.Magess + '</p><a href="http://www.ly.com/scenery/zhuanti/jqshuqit/">去主会场逛逛</a>');
                        },
                        fn: function () {//关闭回调

                        }
                    });
                }
            }
        });

        hbFn.clickType = true;
    },
    init: function () {
        $.dialog({
            dialogType: "hb_box",
            beforeFn: function () {

                codeImg.init();
                hbFn.focusFn();
                var hbId = $(".submit").attr("data-cid");
                $(".submit").on("click", function () {
                    if (!hbFn.clickType) {
                        return;
                    }
                    if (hbFn.checkFn()) {
                        hbFn.clickType = false;
                        hbFn.lingFn(hbId);
                    }
                })
            },
            fn: function () {//关闭回调
            }
        });

    }
};
//倒计时

var timeFn = {
    isclick: true,
    gameTime: 40,
    num: 0,//之前的总成绩
    startNum: 0,
    nowNum: $(".show_mile span").text() || 0,//当前一局的成绩
    timer1: null,
    hbClick: function () {
        $(".check span").on("click", function () {
            playFn.yzFn(Number(timeFn.num + Number($(".show_mile span").text())));
            $.dialog({
                dialogType: "pri_process",
                before: function () {

                },
                fn: function () {//关闭回调

                }
            });
        });
        $(".pro_con ul li .go").on("click", function () {
            var _index = $(this).parent("li").index();
            if ($(this).parent("li").hasClass("on")) {
                playFn.clickType = false;

                if ($(this).parent("li").hasClass("on")) {
                    if ($.cookie("us")) {
                        var uMemberIDRight = $.cookie("us").split("=")[1];
                        var uId = uMemberIDRight.split("&")[0];
                        now_MemberId = uId ? uId : "";
                    }
                    if (now_MemberId == "" || now_MemberId == undefined) {               //未登录
                        var nowHref = window.location.href;
                        window.location.href = "https://passport.ly.com/m/login.html?returnUrl=" + encodeURIComponent(nowHref);
                    } else {
                        switch (_index) {
                            case 0:
                                playFn.lingFn("GETSPMHONGBAO", 10520, 0);
                                break;
                            case 1:
                                playFn.lingFn("GETSPMLIBAO", 10521, 1);
                                break;
                            case 2:
                                playFn.drawInfor();
                                //playFn.lingFn("GETSPMLIBAO", 10522, 2);
                                break;
                        }
                    }
                }
            } else {
                var pHtml;
                if (_index == 2) {
                    pHtml = "快去玩漂流<br>再前进" + showFn.allNum + "米就可以抽奖奥！";
                } else if (_index == 0) {
                    var leftNum = (showFn.allNum - 8000) <= 0 ? 0 : showFn.allNum - 8000;
                    pHtml = "快去玩漂流<br>再前进" + leftNum + "米就可以领奖奥！";
                } else {
                    var leftNum2 = (showFn.allNum - 5000) <= 0 ? 0 : showFn.allNum - 5000;
                    pHtml = "快去玩漂流<br>再前进" + leftNum2 + "米就可以领奖奥！";
                }

                $.dialog({
                    dialogType: "result_box",
                    beforeFn: function () {
                        $(".result").html("");
                        $(".result").append('<p>' + pHtml + '</p> <div class="result_btn"> <div class="btns"> <a href="http://www.ly.com/scenery/zhuanti/jqpiaoliu2">我要玩</a></div>');
                    },
                    fn: function () {//关闭回调

                    }
                });
            }

        })

    },
    playAgain: function (txt, num) {
        $.dialog({
            dialogType: "win_fri",
            beforeFn: function () {
                $(".win_fri a").hide();
                if (num == 2) {
                    $(".win_fri .wantPlay").show();
                } else if (num == 3) {
                    $(".win_fri .wantHelp").show();
                    $(".win_fri").on("click", ".wantHelp", function () {
                        playFn.shareTxt();
                    });
                }
                $(".win_fri p").html(txt);
                isTime = false;
                isCreat = false;
            },
            fn: function () {//关闭回调
                location.reload();
                isTime = false;
                isCreat = false;
                timeFn.isclick = true;
            }
        });
    },
    gameOverAjax: function () {
        if (share.style == "myPage" || share.style == "firstPage") {
            var dialogType;


            dataurl = "/scenery/AjaxHelper/ZhuanTiHelp/ZTAjaxCall.aspx?action=GETMOBILEPHONERESERVATION&ObjectType=" + weixinInfo.openid + "&ActivitiesName=pl2016628&PicId=" + Number($(".show_mile span").text()) + "&WXImage=" + weixinInfo.headimgurl + "&MemberName=" + weixinInfo.nickname;
            $.ajax({
                url: dataurl,
                dataType: "json",
                success: function (data) {
                    //300 已参加
                    //400 执行成功
                    if (data.State == 400) {
                        $.dialog({
                            dialogType: "win_on",
                            beforeFn: function () {
                                $(".win_on p").html("漂流达人<br>恭喜完成" + Number($(".show_mile span").text()) + "米<br>继续加油！");
                                if (Number(timeFn.num) == 0) {
                                    $(".result_btn").html('<div class="five"><span>领取奖品</span></div><div class="share_click"><span>求助神队友</span></div>');

                                    $(".win_on").on("click", ".share_click span", function () {
                                        playFn.shareTxt();
                                    });
                                    $(".five span").on("click", function () {
                                        hbFn.init();
                                    });

                                } else if (overScore >= 2000 && overScore < 10000) {
                                    $(".result_btn").html('<div class="check"><span>去领奖</span></div><div class="share_click"><span>求助神队友</span></div>');
                                    $(".win_on").on("click", ".share_click span", function () {
                                        playFn.shareTxt();
                                    });
                                    timeFn.hbClick(overScore);


                                } else if (overScore >= 10000) {
                                    $(".win_on p").html("漂流达人<br>恭喜完成10000米<br>到达终点！");
                                    $(".result_btn").html('<div class="check"><span>去领奖</span></div></div>');
                                    $(".win_on").on("click", ".share_click span", function () {
                                        playFn.shareTxt();
                                    });
                                    timeFn.hbClick(overScore);
                                } else {
                                    $(".result_btn").html('<div class="share_click"><span>求助神队友</span></div>');
                                    $(".win_on").on("click", ".share_click span", function () {
                                        playFn.shareTxt();
                                    });
                                }
                                isTime = false;
                                isCreat = false;
                            },
                            fn: function () {//关闭回调
                                location.reload();
                                timeFn.isclick = true;
                            }
                        });
                    } else {
                        timeFn.playAgain("已经参加过了奥！<br>明天再来", 3);
                    }
                }
            });

        } else {
            dataurl = "/scenery/AjaxHelper/ZhuanTiHelp/ZTAjaxCall.aspx?action=GETMOBILEPHONERESERVATION&ObjectType=" + share.openid + "&Sceneryname=" + weixinInfo.openid + "&ActivitiesName=pl2016628&PicId=" + Number($(".show_mile span").text()) + "&WXImage=" + weixinInfo.headimgurl + "&MemberName=" + weixinInfo.nickname;
            $.ajax({
                url: dataurl,
                dataType: "json",
                success: function (data) {
                    //300 已参加
                    //400 执行成功
                    if (data.State == 400) {
                        $.dialog({
                            dialogType: "win_fri",
                            beforeFn: function () {
                                var overplus = 10000 - overScore, phtml;
                                if (overplus <= 0) {
                                    phtml = "TA已经到达终点";
                                } else {
                                    phtml = "TA离终点还有" + overplus + "米";
                                }
                                $(".win_fri p").html("你为TA成功助力了" + ($(".show_mile span").text()) + "米<br>" + phtml + "");
                                $(".win_fri a").hide();
                                $(".win_fri .wantPlay").show();
                                isTime = false;
                                isCreat = false;
                            },
                            fn: function () {//关闭回调
                                location.reload();
                                isTime = false;
                                isCreat = false;
                                timeFn.isclick = true;
                            }
                        });
                    } else {
                        timeFn.playAgain("已经助力过了", 2);
                    }
                }
            });

        }
    },
    gameOverFn: function () {
        isOver = false;
        var number = Number(timeFn.num) + Number(timeFn.startNum);
        overScore = number;
        isTime = false;
        isCreat = false;

        $.dialog({
            dialogType: "isAgain",
            beforeFn: function () {
                $(".isAgain p span").text(Number(timeFn.startNum));
            },
            nowFn: function () {
                $(".subScore").on("click", function () {
                    timeFn.gameOverAjax();
                });

                $(".again").on("click", function () {
                    sessionStorage.setItem("isPlay", 1);
                    location.reload();
                })
            },
            fn: function () {//关闭回调

            }
        });
    },
    timeFly: function () {
        timeFn.timer1 = setInterval(function () {
            if (!isTime) {
                return;
            }
            timeFn.gameTime--;
            timeFn.startNum += 10;
            $(".show_mile span").text(timeFn.startNum);
            $(".time").text(timeFn.gameTime + "s");
            if (timeFn.gameTime == 0 && isOver == true) {
                Game.stopFun();
                clearInterval(timeFn.timer1);
            }
        }, 1000);
    },
    getNum: function () {//获取之前累积的数据
        var dataUrl;
        if (share.style == "friPage") {
            dataUrl = "/scenery/AjaxHelper/ZhuanTiHelp/ZTAjaxCall.aspx?action=GETSPECIALWISHNR&ActivitiesName=pl2016628&top=20&ObjectType=" + share.openid;
        } else {
            dataUrl = "/scenery/AjaxHelper/ZhuanTiHelp/ZTAjaxCall.aspx?action=GETSPECIALWISHNR&ActivitiesName=pl2016628&top=20&ObjectType=" + weixinInfo.openid;
        }
        $.ajax({
            url: dataUrl,
            dataType: "json",
            success: function (data) {
                timeFn.num = data.totalSize;
                var lastNum = Number(10000 - data.totalSize) <= 0 ? 0 : Number(10000 - data.totalSize);
                $(".mileHide").val(lastNum);
            }
        });
    },
    init: function () {
        this.getNum();
        this.timeFly();
    }
};

var ajaxSome = {
    clickFn: function () {
        $(".music").on("click", function () {
            if ($(this).hasClass('on')) {
                var a = $(this).css('transform');
                $(this).css({
                    transform: a
                });
                $(this).removeClass('on');
                document.getElementById('mymusic').pause()
            }
            else {
                $(this).css({
                    transform: ''
                });
                $(this).addClass('on');
                document.getElementById('mymusic').play()
            }
        });
    },
    init: function () {
        this.clickFn();
    }
};
ajaxSome.init();

var Game = null;
$(function () {
    var winWidth = $(window).width(),
        winHeight = $(window).height(),
        myCanvas = $("#myCanvas")[0],
        canCont = myCanvas.getContext("2d"),
        gressBack = new Image(),
        waterBack = new Image(),
        shipBack1 = new Image(),
        shipBack2 = new Image(),
        shiTou = new Image(),
        treeBack = new Image(),
        lz1 = new Image(),
        lz2 = new Image(),
        lz3 = new Image(),
        mainBJ = new Image();
    shipBack1.src = "http://img1.40017.cn/cn/s/2016/touch/zt/45596/ship1.png";
    shipBack2.src = "http://img1.40017.cn/cn/s/2016/touch/zt/45596/ship2.png";
    treeBack.src = "http://img1.40017.cn/cn/s/2016/touch/zt/45596/tree.png";
    lz1.src = "http://img1.40017.cn/cn/s/2016/touch/zt/45596/stone.png";
    lz2.src = "http://img1.40017.cn/cn/s/2016/touch/zt/45596/tree.png";
    lz3.src = "http://img1.40017.cn/cn/s/2016/touch/zt/43800/lz_2.png";
    mainBJ.src = "http://img1.40017.cn/cn/s/2016/touch/zt/45596/grass_btn .png";
    waterBack.src = "http://img1.40017.cn/cn/s/2016/touch/zt/45596/water.png";
    myCanvas.width = winWidth;
    myCanvas.height = winHeight;

    var _mainWid = 640 * winWidth / 640;
    var _mainHei = 3578 * winWidth / 640;

    var _waterWid = 481 * winWidth / 640;
    var _waterHei = 1136 * winWidth / 640;

    var plType = [lz1, lz2, lz3];
    plType.sort(function () {
        return 0.5 - Math.random()
    });
    var plPos = [(winWidth - 75) / 6 + 10, (winWidth - 42 * 80 / myCanvas.height - 10) / 2, (3 * winWidth - 50) / 4];
    //plPos.sort(function () {
    //    return 0.5 - Math.random()
    //});

    grassOffset = 0;
    GRASS_VELOCITY = 80;
    //岸边图片重复的次数
    Num = 5;
    waterOffset = 0;
    WATER_VELOCITY = 80;
    Game = {
        init: function () {
            this.fps = 60;
            this.shipSpeed = 0;
            this.shipOffSet = 0;
            this.shipType = 0;
            this.shipX = (winWidth - (110 * winWidth / 640 + 20)) / 2;
            this.lzType = true;
            this.lzNum = 0;
            this.lzYspeed = 0;
            this.lzY = 0;
            this.mainFun();
        },
        shipLeft: function () {
            this.shipType = this.shipType < 0 ? -1 : this.shipType - 1;
        },
        shipRight: function () {
            this.shipType = this.shipType > 0 ? 1 : this.shipType + 1;
        },
        justDraw: function () {
            canCont.clearRect(0, 0, winWidth, winHeight);
            canCont.fillStyle = "#5ec4ff";
            canCont.fillRect(0, 0, myCanvas.width, myCanvas.height);
            canCont.drawImage(waterBack, winWidth / 2 - _waterWid / 2, -_waterHei + winHeight, _waterWid, _waterHei);
            canCont.drawImage(mainBJ, 0, -_mainHei + winHeight, _mainWid, _mainHei);
        },
        runFun: function () {


            canCont.clearRect(0, 0, winWidth, winHeight);
            canCont.save();
            grassOffset = (grassOffset <= -3578 * winWidth * (Num - 1) / 640 + winHeight) ? 0 : grassOffset - GRASS_VELOCITY / this.fps * 3.5;

            waterOffset = (waterOffset <= -_waterHei * 2 + winHeight) ? 0 : waterOffset - GRASS_VELOCITY / this.fps * 5.5;
            canCont.save();
            canCont.fillStyle = "#5ec4ff";
            canCont.fillRect(0, 0, myCanvas.width, myCanvas.height);

            canCont.translate(0, -waterOffset);
            canCont.drawImage(waterBack, winWidth / 2 - _waterWid / 2, -_waterHei + winHeight, _waterWid, _waterHei);
            canCont.drawImage(waterBack, winWidth / 2 - _waterWid / 2, -_waterHei * 2 + winHeight, _waterWid, _waterHei);
            canCont.restore();


            canCont.save();
            canCont.translate(0, -grassOffset);
            for (var i = 1; i < Num; i++) {
                canCont.drawImage(mainBJ, 0, -_mainHei * i + winHeight, _mainWid, _mainHei);
            }
            canCont.restore();


            this.shipSpeed = this.shipSpeed > 80 ? 0 : this.shipSpeed += 2;
            canCont.save();
            if (this.shipSpeed < 40) {
                canCont.drawImage(shipBack1, this.shipX, winHeight - 150 + this.shipOffSet, 100, 140);
            } else {
                canCont.drawImage(shipBack2, this.shipX, winHeight - 150 + this.shipOffSet, 100, 140);
            }
            canCont.restore();


            var midNum = (winWidth - 100) / 2;
            switch (this.shipType) {
                case -1:
                    this.shipX -= 8;
                    this.shipX = this.shipX < (winWidth - 75) / 6 + 10 ? (winWidth - 75) / 6 + 10 : this.shipX;
                    break;
                case 0:
                    if (this.shipX > midNum) {
                        this.shipX -= 8;
                        this.shipX = this.shipX < midNum ? midNum : this.shipX;
                    } else {
                        this.shipX += 8;
                        this.shipX = this.shipX > midNum ? midNum : this.shipX;
                    }
                    break;
                case 1:
                    this.shipX += 8;
                    this.shipX = this.shipX > (3 * winWidth - 50) / 4 - 20 ? (3 * winWidth - 50) / 4 - 20 : this.shipX;
            }

            canCont.save();

            if (this.lzType) {
                this.lzY = 0;
                this.lzType = false;
                this.lzNum = Math.ceil(Math.random() * 100) % 3 + 1;
                this.lzYSpeed = Math.random() * 3 + 3;
            } else {
                this.lzY += this.lzYSpeed;
                if (this.lzY + 20 > myCanvas.height - 158) {
                    if (this.lzNum == 2) {
                        if (this.shipType + 2 == this.lzNum || this.shipType + 1 == this.lzNum) {

                            this.stopFun();
                        }
                    } else {
                        if (this.shipType + 2 == this.lzNum) {
                            this.stopFun();

                        }
                    }
                    this.lzType = true;
                }
            }


            var bili = (this.lzY + 80) / myCanvas.height;
            var lzLeft = myCanvas.width / 2;

            this.lzY += 5;
            canCont.save();

            var plWid = 55 * winWidth / 640 + 10;
            var plHei = 40 * winHeight / 640 - 10;
            switch (this.lzNum) {
                case 1:
                    canCont.drawImage(plType[0], plPos[0], this.lzY, plWid, plHei);
                    break;
                case 2:
                    canCont.drawImage(plType[1], plPos[1], this.lzY, plWid, plHei);
                //break;
                case 3:
                    canCont.drawImage(plType[2], plPos[2], this.lzY, plWid, plHei);
                    break;
            }

            canCont.restore();
        },
        mainFun: function () {

            Game.runFun();
            var myTimer = requestAnimationFrame(Game.mainFun);

            if (Game.stopType) {
                cancelAnimationFrame(myTimer);
            }
        },
        stopFun: function () {
            this.stopType = true;
            timeFn.gameOverFn();
        }

    };
    waterBack.onload = function () {
        Game.justDraw();
    };
    mainBJ.onload = function () {
        Game.justDraw();
    };

    //Game.init();
});
//刚进来页面，执行的方法。
var startFn = {
    isPlay: sessionStorage.getItem("isPlay") || 0,
    timeLine: function () {
        $.dialog({
            dialogType: "time_box",
            beforeFn: function () {

            },
            nowFn: function () {
                $(".mask").hide();
                var num = 3;
                var timer = setInterval(function () {
                    num--;
                    if (num == 0) {
                        $(".mask").hide();
                        $(".show_box").hide();
                        clearInterval(timer);
                        timeFn.init();
                        Game.init();

                    } else {
                        $(".time_box p").html(num);
                    }
                }, 1500);
            },
            fn: function () {//关闭回调

            }
        });
    },
    init: function () {
        if (startFn.isPlay == 1) {
            startFn.timeLine();
        } else {
            $.dialog({
                dialogType: "start",
                beforeFn: function () {

                },
                nowFn: function () {
                    var timer2 = setTimeout(function () {
                        $(".mask").hide();
                        $(".show_box").hide();
                        startFn.timeLine();
                    }, 3000);

                },
                fn: function () {//关闭回调

                }
            });
        }
    }
};



var allInit = {
    doRefid: function (dataAndRefid) {
        //私有方法
        newRefid = dataAndRefid[0];
        newSpm = dataAndRefid[1];
        startFn.init();
        playFn.init();

    },
    init: function () {
        //异步获取refid，给同步链接添加refid和spm
        setRefId({
            isAjaxGetRef: true,                         //是否需要异步获取refid【默认false】
            ChannelID: 10793,                       //频道ID【isAjaxGetRef为true时必传】
            allSpmId: "5.152278484.10793.1",               //总的页面spmID【必传】
            oldRefid: "",                               //非异步获取refid时传过来，【isAjaxGetRef为false时必传】
            isChange: false,                              //是否需要给静态链接自动添加refid和spm【可不传，默认false】
            uTagName: "a",                                //需要自动添加refid的类名【可不传，默认所有a】
            tagValue: "href"                             //需要自动添加refid的元素属性【可不传，默认a标签的href】
        });
    }
};
allInit.init();
