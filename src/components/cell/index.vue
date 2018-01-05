<template>
<flexbox :class="classes" align="center" justify="center" @click="clickHandler">
    <div :class="cssPrefix + 'cell-hd'">
        <slot name="icon"></slot>
    </div>
    <flexbox-item :class="cssPrefix + 'cell-bd'">
        <slot name="title"></slot>
    </flexbox-item>
    <div :class="cssPrefix + 'cell-ft'">
        <slot name="value"></slot>
    </div>
</flexbox>
</template>

<style lang="less">
@import './style.less';
</style>

<script>
import { cssPrefix } from '@/utils/variable'
import { Flexbox, FlexboxItem } from '../flexbox'
export default {
    components: {
        Flexbox,
        FlexboxItem
    },
    props: {
        arrow: {
            type: Boolean,
            default: true
        },
        href: {
            type: String
        },
        title: {
            type: [String, Array, Object]
        },
        cellType: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            cssPrefix
        }
    },
    computed: {
        classes () {
            return [cssPrefix + 'cell', this.arrow ? cssPrefix + 'cell-access' : '']
        }
    },
    methods: {
        clickHandler (e) {
            if (this.href) {
                location.href = this.href
            }
            this.$emit('click', e, this.title, this.cellType)
        }
    }
}
</script>
