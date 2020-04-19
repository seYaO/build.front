define("lottery/0.1.0/index", [], function () {
    /*
     * 抽奖
     * @index  //默认0 起始位置 当前转动到哪个位置，起点位置
     * @count  //  总共有多少个位置
     * @speed  //默认20 初始转动速度
     * @cycle  //默认50 转动基本次数：即至少需要转动多少次再进入抽奖环节
     * @prize  //中奖位置，<0时将无限转下去
     * @modal  //中奖模式 randow：随机模式,custom：自定义
     * @onStay  function(index) 转到某处时触发
     * @onLottery function(index) 中奖后触发
     */
    var lottery = function (option) {
        option = option || {};

        var _isrunning = false;
        var _index = 0;  //当前转动到哪个位置，起点位置
        var _count = option.count || 8;  //总共有多少个位置
        var _timer = 0;  //setTimeout的ID，用clearTimeout清除
        var _speed = option.speed || 20;  //初始转动速度
        var _times = 0;  //转动次数
        var _cycle = option.cycle || 50; //转动基本次数：即至少需要转动多少次再进入抽奖环节
        var _prize = option.prize || -1; //中奖位置
        var _modal = option.modal || 'random';//中奖模式 randow：随机模式,custom：自定义       
        //转到某处时触发
        var _onStay = option.onStay || function (index) {

        };
        //开奖时触发
        var _onLottery = option.onLottery || function (index) {

        };
        //停止
        var _onStop = option.onStop || function (index) {

        };

        var self = this;

        this.init = function () {
            _timer = 0;
            _times = 0;
            _count = option.count || 8;
            _speed = option.speed || 20;
            _prize = option.prize || -1;

            //if ($("#" + id).find(".lottery-unit").length > 0) {
            //    $lottery = $("#" + id);
            //    $units = $lottery.find(".lottery-unit");
            //    this.obj = $lottery;
            //    this.count = $units.length;
            //    $lottery.find(".lottery-unit-" + this.index).addClass("active");
            //};
        }

        this.start = function () {
            if (_isrunning) {
                return false;
            }
            _isrunning=true;
            self.init();
            self.runroll();
            return true;
        }
        this.roll = function () {
            _index += 1;
            if (_index > _count - 1) {
                _index = 0;
            };
            _onStay(_index);
            return false;
        }
        this.stop = function (index) {           
            _prize = index;
            if (_prize < 0) {
                clearTimeout(_timer);
                _isrunning = false;
            }
            _onStop(index);
            return true;
        }

        this.runroll = function () {
            _times += 1;
            self.roll();
            if (_times > _cycle + 10 && _prize == _index) {
                //中奖
                clearTimeout(_timer);
                _isrunning = false;
                _onLottery(_prize);
                //$(".rewards_end").show();
            } else {
                if (_times < _cycle) {
                    //进入抽奖环节后，速度逐渐放慢
                    _speed -= 10;
                } else if (_times == _cycle) {
                    //自定义奖项（自动模式）
                    if (_modal == 'random') {
                        _prize = Math.random() * (_count) | 0;
                    }

                } else {
                    //抽奖前加速
                    if (_times > _cycle + 10 && ((_prize == 0 && _index == 7) || _prize == _index + 1)) {
                        _speed += 110;
                    } else {
                        _speed += 20;
                    }
                }
                //最低速度
                if (_speed < 40) {
                    _speed = 40;
                };
                //console.log(_times+'^^^^^^'+_speed+'^^^^^^^'+_prize);
                _timer = setTimeout(self.runroll, _speed);
            }
            return false;
        }
    };

    return lottery;
});

