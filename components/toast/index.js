module.exports = {
    showVToast(title, timeout) {
        var vToast = this.data.vToast || {};
        clearTimeout(vToast.timer);

        // 弹层设置~
        vToast = {
            show: true,
            title
        };
        this.setData({
            vToast
        });

        var timer = setTimeout(() => {
            this.clearVToast();
        }, timeout || 3000);

        this.setData({
            'vToast.timer': timer
        });
    },

    clearVToast() {
        var vToast = this.data.vToast || {};
        clearTimeout(vToast.timer);

        this.setData({
            'vToast.show': false
        });
    }
};
  