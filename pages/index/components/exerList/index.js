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
        setText(text) {
            let list = []
            const reg1 = /(【.*?】)/igm, reg2 = /(（.*?）)/igm, reg3 = /【(.*?)】/igm, reg4 = /（(.*?)）/igm
            let arr = text.replace(reg1, '｜$1').replace(reg1, '$1｜').replace(reg2, '｜$1').replace(reg2, '$1｜').split('｜')
            arr.map(item => {
                let txt = '', tag = ''
                if (reg3.test(item)) {
                    txt = item.replace(reg3, '$1')
                    tag = 'red'
                } else if (reg4.test(item)) {
                    txt = item.replace(reg4, '（$1）')
                    tag = 'orange'
                } else {
                    txt = item
                }
                list.push({ txt, tag })
            })
            return list
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
                        const titleArr = this.setText(exer.title)
                        exer.titleArr = titleArr
                        exer.showAnalyze = false
                        if (exer.analyze && exer.analyze.length) {
                            exer.analyzeList = []
                            exer.analyze.map(analyze => {
                                const arr = this.setText(analyze)
                                exer.analyzeList.push(arr)
                            })
                        }
                    })
                }
            }
            console.log('keynoteList', keynoteList)
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