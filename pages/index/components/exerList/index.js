Component({
    data: {
        type: 1,
        exerList: [],
        idx: 0,
        keynoteList: null,
    },
    created() {

    },
    methods: {
        setConfig() {
            this.exerMask = this.selectComponent("#exerMask")
            this.exerMask.setConfig({
                top: '10',
                title: '练习',
            });
            this.setData({ exerList: [], keynoteList: null })
        },
        // 外部展开筛选
        setShowPop() {
            this.exerMask.showPopMasker()
        },
        init(data) {
            this.setConfig()
            const { exerList, type, idx, keynoteList } = data
            if (exerList && exerList.length) {
                exerList.map(exer => {
                    exer.showAnalyze = false
                })
            }
            if (keynoteList && keynoteList.length) {
                if (idx != 0) {
                    keynoteList.map(exer => {
                        exer.showAnalyze = false
                    })
                }
            }
            // console.log('keynoteList', keynoteList)
            this.setData({ exerList, keynoteList, idx, type })
        },
        clickShow(e) {
            const { item, idx } = e.currentTarget.dataset
            item.showAnalyze = !item.showAnalyze
            if (this.data.exerList && this.data.exerList.length) {
                let exerList = this.data.exerList
                exerList[idx] = item
                this.setData({ exerList })
            }
            if (this.data.keynoteList && this.data.keynoteList.length) {
                let keynoteList = this.data.keynoteList
                keynoteList[idx] = item
                this.setData({ keynoteList })
            }
        },
    }
})