Component({
    data: {
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
        init(data) {
            this.setConfig()

            data.map(exer => {
                exer.showAnalyze = false
            })
            this.setData({ exerList: data })
        },
        clickShow(e) {
            const { item, idx } = e.currentTarget.dataset
            item.showAnalyze = !item.showAnalyze
            let exerList = this.data.exerList
            exerList[idx] = item
            console.log(item)
            this.setData({ exerList })
        },
    }
})