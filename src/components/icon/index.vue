<template>
<i :class="classes">
    <slot></slot>
</i>
</template>

<style lang="less">
// @import './style.less';
</style>

<style lang="scss">
@import './style.scss';
</style>


<script>
import { cssPrefix } from '@/utils/variable'

export default {
    data() {
        return {
            cssPrefix
        }
    },
    computed: {
        classes () {
            return [cssPrefix + 'iconfont']
        }
    },
}
</script>
