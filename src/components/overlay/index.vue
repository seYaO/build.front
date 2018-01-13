<template>
<div :class="classes" :style="styles" @click="clickHandler">
    <slot></slot>
</div>
</template>

<script>
import { cssPrefix } from '@/utils/variable'
export default {
    props: {
        opacity: {
            type: Number,
            default: 0.35
        }
    },
    data() {
        return {
            cssPrefix
        }
    },
    computed: {
        classes() {
            return [cssPrefix + 'overlay']
        },
        styles() {
            return 'opacity:' + this.opacity
        }
    },
    methods: {
        clickHandler(e) {
            this.$emit('click', e)
        }
    }
}
</script>

<style lang="less">
// @import './style.less';
</style>

<style lang="scss">
@import './style.scss';
</style>
