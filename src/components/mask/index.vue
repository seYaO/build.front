<template>
<div :class="classes" :style="styles">
    <slot></slot>
</div>
</template>

<style lang="scss">
@import './style.scss';
</style>

<script>
import { cssPrefix, addClass, removeClass, getScrollview, isIOS } from '@/utils/assist'

export default {
    data() {
        return {
            cssPrefix,
            show: this.value
        }
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        bgcolor: {
            type: String,
            default: '#000'
        },
        zindex: {
            default: 1500
        },
        opacity: {
            default: .4
        },
        animated: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        value(val) {
            this.show = val;
            if(isIOS) {
                if(val) {
                    addClass(this.scrollView, 'g-fix-ios-overflow-scrolling-bug');
                } else {
                    setTimeout(() => {
                        removeClass(this.scrollView, 'g-fix-ios-overflow-scrolling-bug');
                    }, 200);
                }
            }
        }
    },
    computed: {
        classes() {
            return [cssPrefix + 'mask']
        },
        styles() {
            const style = {'z-index': this.zindex, 'background-color': this.bgcolor};
            if(this.show) {
                style['opacity'] = this.opacity;
                style['pointer-events'] = 'auto';
            }
            return style;
        }
    },
    mounted() {
        this.scrollView = getScrollview(this.$el);
    },
    destroyed() {
        isIOS && removeClass(this.scrollView, 'g-fix-ios-overflow-scrolling-bug');
    }
}
</script>
