module.exports = {
    showVTopTips(content = '', options = {}) {
        let vTopTips = this.data.vTopTips || {};
        // 如果已经有一个计时器在了，就清理掉先
        if (vTopTips.timer) {
            clearTimeout(vTopTips.timer);
            vTopTips.timer = undefined;
        }

        if (typeof options === 'number') {
            options = {
                duration: options
            };
        }

        // options参数默认参数扩展
        options = Object.assign({
            duration: 3000
        }, options);

        // 设置定时器，定时关闭topTips
        let timer = setTimeout(() => {
            this.setData({
                'vTopTips.show': false,
                'vTopTips.timer': undefined
            });
        }, options.duration);

        // 展示出topTips
        this.setData({
            vTopTips: {
                show: true,
                content,
                options,
                timer
            }
        });
    }
};
  