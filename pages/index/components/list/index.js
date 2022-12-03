Component({
    behaviors: [],
    data: {
        list: []
    },
    created() {

    },
    methods: {
        init(data) {
            console.log('listpage', data)
            this.setData({ list: data })
        },
    }
})