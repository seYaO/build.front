<template>
<flexbox-item :class="classes">
    <slot></slot>
</flexbox-item>
</template>

<style lang="scss">
@import './style.scss';
</style>

<script>
import { cssPrefix } from '@/utils/variable'
import { FlexboxItem } from '../flexbox'

export default {
    components: {
        FlexboxItem
    },
    props: {
        scroll: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            cssPrefix
        }
    },
    computed: {
        classes () {
            return [cssPrefix + 'body', this.scroll ? 'scrollbox' : '']
        }
    }
}
</script>
