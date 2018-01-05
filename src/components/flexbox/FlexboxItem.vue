<template>
    <div :class="classes" @click="clickHandler">
        <slot></slot>
    </div>
</template>

<style lang="less">

</style>


<script>
import { cssPrefix } from '@/utils/variable'

export default {
    props: {
        span: {
            type: Number,
            default: 1
        }
    },
    computed: {
        classes () {
            return [this.span > 1 ? 'flexbox-item flexbox-item' + this.span : 'flexbox-item']
        }
    },
    methods: {
        clickHandler (e) {
            this.$emit('click', e)
        }
    },
    data () {
        return {
            cssPrefix: cssPrefix
        }
    }
}
</script>
