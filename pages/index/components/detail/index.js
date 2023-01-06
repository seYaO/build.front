Component({
    data: {
        show: false,
        type: 1,
        chapterList: [],
        examList: [],
        keynoteList: []
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
            let keynoteList = wx.getStorageSync(`keynoteList${value.productId}`) || []

            chapterList.map(item => {
                item.showMore = false

            })

            this.setData({ chapterList, examList, keynoteList, type })
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
            this.triggerEvent('pop', { name: item.name || item.examName, exerList: item.exerList });
        }
    }
})