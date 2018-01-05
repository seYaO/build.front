<template>
<div :class="classes">
    <slot></slot>
</div>
</template>

<script>
import { cssPrefix } from '@/utils/variable'

export default {
    computed: {
        classes() {
            return [cssPrefix + 'divider']
        }
    }
}
</script>

<style lang="less">
@import './style.less';
</style>
