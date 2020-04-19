!function(){
    //用户行为记录
    var recordUserBehaviorObj = {
            init: function() {
                //是否需要记录
                this.needUseRecord = true;
                this.sessionName = "recordUserBehavior";
                this.DATA = this.getAllData();
                this.bindEvent();
            },
            bindEvent: function() {
                if (this.bindEventOnce || !this.needUseRecord) return false;
                this.bindEventOnce = true;
            },
            //读取数据
            readData: function(dataKey) {
                if (!dataKey || !this.DATA[dataKey] || !this.needUseRecord) return false;
                // console.log(this.getAllData())
                return this.DATA[dataKey] || "";
            },
            //修改数据
            changeData: function(dataKey, valueStr) {
                if (!dataKey || !this.needUseRecord) return false;
                var sess = this.mSessionStory,
                    sessName = this.sessionName;
                this.DATA[dataKey] = valueStr;
                sess.setItem(sessName, JSON.stringify(this.DATA));
                // console.log(this.getAllData())
                return this.getAllData();
            },
            //清空数据
            clearData: function() {
                if (!this.DATA || !this.needUseRecord) return false;
                var sess = this.mSessionStory,
                    sessName = this.sessionName;
                this.DATA = {};
                sess.setItem(sessName, JSON.stringify(this.DATA));
                return this.getAllData();
            },
            //获取所有的数据
            getAllData: function() {
                if (!this.needUseRecord) return false;
                var data = {},
                    sess = this.mSessionStory,
                    sessName = this.sessionName;
                if (!sess.getItem(sessName)) {
                    sess.setItem(sessName, JSON.stringify(data));
                } else {
                    data = JSON.parse(sess.getItem(sessName));
                }
                return data;
            },
            //数据
            DATA: {},
            //sessionStory兼容处理 （发现iphone6 出现不支持的现象yong cookie做替代方案）
            //问题描述：sessionStory.setItem不支持 但getItem支持 问题比较奇葩
            mSessionStory: {
                isSupportSessionStorage: (function() {
                    var isSupport = true,
                        roundMKeyTest = "seStTestKeyTest123456" + (new Date().getTime()),
                        roundMValTest = "seStTestVauleTest123456" + (new Date().getTime()),
                        csTestVsL = "";
                    try {
                        sessionStorage.setItem(roundMKeyTest, roundMValTest);
                        csTestVsL = sessionStorage.getItem(roundMKeyTest);
                        sessionStorage.removeItem(roundMKeyTest);
                    } catch (exp) {
                        csTestVsL = "faile";
                    }
                    if (roundMValTest != csTestVsL) {
                        isSupport = false;
                    }
                    return isSupport;
                })(), //是否完全支持 sessionStory
                getItem: function(sKey) {
                    var data = null;
                    if (this.isSupportSessionStorage) {
                        data = sessionStorage.getItem(sKey);
                    } else {
                        data = $.cookie(sKey);
                    }
                    return data && data.length ? decodeURIComponent(data) : null;
                },
                setItem: function(sKey, sValue) {
                    if (!sKey || !sKey.length) return false;
                    sValue = encodeURIComponent(sValue);
                    if (this.isSupportSessionStorage) {
                        sessionStorage.setItem(sKey, sValue);
                    } else {
                        $.cookie(sKey, sValue);
                    }
                    return true;
                },
                removeItem: function(sKey) {
                    if (!sKey || !sKey.length) return false;
                    if (this.isSupportSessionStorage) {
                        sessionStorage.removeItem(sKey);
                    } else {
                        $.cookie(sKey, "", {
                            expires: -1 //过期失效
                        });
                    }
                    return true;
                }
            }
    };
    recordUserBehaviorObj.init();
    module.exports = recordUserBehaviorObj;
}();