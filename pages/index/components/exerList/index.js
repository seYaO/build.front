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
        setConfig(title) {
            this.exerMask = this.selectComponent("#exerMask")
            this.exerMask.setConfig({
                top: '10',
                title: title,
            });
            this.setData({ exerList: [] })
        },
        // 外部展开筛选
        setShowPop() {
            this.exerMask.showPopMasker()
        },
        setText(text) {
            let list = []
            const reg1 = /(【.*?】)/igm, reg2 = /(（.*?）)/igm, reg3 = /【(.*?)】/igm, reg4 = /（(.*?)）/igm
            let arr = text.replace(reg1, '|$1').replace(reg1, '$1|').replace(reg2, '|$1').replace(reg2, '$1|').split('|')
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
            const { exerList, name } = data
            this.setConfig(name)

            if (exerList && exerList.length) {
                exerList.map(exer => {
                    exer.showAnalyze = false

                    const titleArr = this.setText(exer.title)
                    exer.titleArr = titleArr

                    if (typeof exer.analyze == 'object') {
                        if (exer.analyze && exer.analyze.length) {
                            exer.analyzeList = []
                            exer.analyze.map(analyze => {
                                let list = analyze.split('｜'), listArr = []
                                list.map(list => {
                                    const arr = this.setText(list)
                                    listArr.push(arr)
                                })
                                exer.analyzeList.push(listArr)
                            })
                        }
                    }
                })
            }
            this.setData({ exerList })
        },
        clickShow(e) {
            const { item, idx } = e.currentTarget.dataset
            item.showAnalyze = !item.showAnalyze
            if (this.data.exerList && this.data.exerList.length) {
                let exerList = this.data.exerList
                exerList[idx] = item
                this.setData({ exerList })
            }
        },
    }
})