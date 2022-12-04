Component({
    data: {
        show: true,
        type: 1,
        chapterList: [],
        examList: []
    },
    created() {

    },
    methods: {
        setShow(flag) {
            this.setData({ show: flag })
        },
        init(data) {
            console.log('data', data)
            const { chapterList, examList, type } = data
            chapterList.map(item => {
                item.showMore = false

            })
            examList.map(item => {
                item.showMore = false
            })
            this.setData({ chapterList, examList, type })
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
            const { item, idx } = e.currentTarget.dataset
            console.log(item.exerList)
            this.triggerEvent('pop', { exerList: item.exerList });
        }
    }
})