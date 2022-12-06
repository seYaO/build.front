Component({
    data: {
        show: true,
        type: 1,
        chapterList: [],
        examList: [],
        keynote: null
    },
    created() {

    },
    methods: {
        setShow(flag) {
            this.setData({ show: flag })
        },
        init(data) {
            const { value, type } = data
            let chapterList = wx.getStorageSync(`chapterList${value.productId}`)
            let examList = wx.getStorageSync(`examList${value.productId}`)
            let keynote = wx.getStorageSync(`keynote${value.productId}`) || null

            chapterList.map(item => {
                item.showMore = false

            })
            examList.map(item => {
                item.showMore = false
            })
            this.setData({ chapterList, examList, keynote, type })
        },
        goBack(e) {
            this.triggerEvent('back');
        },
        clickMore(e) {
            const { item, idx } = e.currentTarget.dataset
            let chapterList = this.data.chapterList
            item.showMore = !item.showMore
            chapterList[idx] = item
            this.setData({ chapterList })
        },
        clickPop(e) {
            const { item = {}, idx } = e.currentTarget.dataset
            this.triggerEvent('pop', { exerList: item.exerList, type: this.data.type, idx, keynoteList: this.data.keynote[`list` + (idx + 1)] });
        }
    }
})