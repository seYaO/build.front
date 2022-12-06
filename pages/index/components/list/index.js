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
            const { value, type } = e.currentTarget.dataset
            this.triggerEvent('button', { value, type });
        }
    }
})