const prefix = '/demo/';

export default [
    {
        path: `${prefix}popup`,
        name: 'popup',
        component(r) {
            require.ensure([], () => {
                r(require('@/views/components/popup/index.vue'))
            }, 'popup')
        }
    }
]