<template>
<i :class="classes">
    <slot></slot>
</i>
</template>

<style lang="less">
@import './style.less';
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
