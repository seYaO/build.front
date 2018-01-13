<template>
<div :class="classes">
    <flexbox :class="[cssPrefix + 'layout-flexbox']" direction="column">
        <slot name="header"></slot>
        <slot name="body"></slot>
        <slot name="footer"></slot>
    </flexbox>
    <slot></slot>
</div>
</template>

<style lang="scss">
@import './style.scss';
</style>

<script>
import { cssPrefix } from '@/utils/variable'
import { Flexbox } from '../flexbox'

export default {
    components: {
        Flexbox
    },
    data() {
        return {
            cssPrefix
        }
    },
    computed: {
        classes() {
            return [cssPrefix + 'layout']
        }
    }
}
</script>
