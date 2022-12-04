Component({
    data: {
        show: true,
        type: 1,
        exerList: []
    },
    created() {

    },
    methods: {
        setConfig() {
            this.exerMask = this.selectComponent("#exerMask")
            this.exerMask.setConfig({
                top: '',
                title: '练习',
            });
        },
        // 外部展开筛选
        setShowPop() {
            this.exerMask.showPopMasker()
        },
        setShow(flag) {
            this.setData({ show: flag })
        },
        init(data) {
            this.setConfig()

            data.map(exer => {
                exer.showAnalyze = false
            })
            this.setData({ exerList: data })
        },
        click(e) {
            const { item, type } = e.currentTarget.dataset
            console.log(item)
            // const { chapterList, examList } = item
            // this.triggerEvent('button', { chapterList, examList, type });
        },
        clickMore(e) {
            const { item, idx } = e.currentTarget.dataset
            let chapterList = this.data.chapterList
            item.showMore = !item.showMore
            chapterList[idx] = item
            this.setData({ chapterList })
        },
        clickHide(e) { }
    }
})