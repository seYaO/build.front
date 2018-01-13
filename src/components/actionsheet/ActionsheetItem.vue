<template>
<div :class="classes" @click="clickHandler">
    <div :class="classes + 'action-sheet-item-text'" :disabled="disabled">
        <slot></slot>
    </div>
</div>
</template>

<style lang="scss">
@import '~styles/variable.scss';
@import '~styles/mixins.scss';
.#{$css-prefix}{
    &action-sheet-item{
        padding: $item-padding;
        position: relative;
        border-left: 0.1rem solid transparent;
        border-right: 0.1rem solid transparent;
        user-select: none;
        white-space: nowrap;
        overflow: hidden;
        @include active;
        &-text{
            @include disabled;
        }
        &:after{
            @include divider;
        }
        &:last-child:after{
            display: none;
        }
        &-active{
            color: $primary-color;
        }
    }
}
</style>

<script>
import { cssPrefix } from '@/utils/variable'

export default {
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        value: {
            type: [String, Number],
            required: true
        }
    },
    data() {
        return {
            cssPrefix,
            checked: false
        }
    },
    computed: {
        classes () {
            return [cssPrefix + 'action-sheet-item', this.checked ? cssPrefix + 'action-sheet-item-active' : '']
        }
    },
    methods: {
        clickHandler () {
            !this.disabled && this.$emit('click', this.value)
        }
    }
}
</script>
