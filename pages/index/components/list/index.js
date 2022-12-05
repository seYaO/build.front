Component({
    data: {
        show: true,
        list: []
    },
    created() {

    },
    methods: {
        setShow(flag) {
            this.setData({ show: flag })
        },
        init(data) {
            this.setData({ list: data })
        },
        click(e) {
            const { item, type } = e.currentTarget.dataset
            const { chapterList, examList, keynote = null } = item
            this.triggerEvent('button', { chapterList, examList, keynote, type });
        }
    }
})