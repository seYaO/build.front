<template>
    <button :class="classes" :disabled="disabled" :type="htmlType" @click="clickHandler">
        <slot></slot>
    </button>
</template>

<style lang="less">
// @import './style.less';
</style>

<style lang="scss">
@import './style.scss';
</style>


<script>
import { cssPrefix } from '@/utils/variable'
import { button } from '@/utils/mixins'
export default {
    mixins: [button],
    computed: {
        classes () {
            return [cssPrefix + 'btn', this.type ? (cssPrefix + 'btn-' + this.type) : this.clas]
        }
    },
    data () {
        return {
            cssPrefix: cssPrefix
        }
    },
    methods: {
        clickHandler (e) {
            this.$emit('on-click', e)
        }
    }
}
</script>
