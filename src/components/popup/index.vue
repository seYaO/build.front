<template>
<div :class="cssPrefix + 'popup'">
    <v-mask v-model="show" @click.native="close"></v-mask>
    <div :class="classes" :style="styles" ref="box">
        <div v-if="!!$slots.top && position != 'center'" ref="top">
            <slot name="top"></slot>
        </div>
        <div :class="cssPrefix + 'popup__container'">
            <div ref="content"><slot></slot></div>
        </div>
        <div v-if="!!$slots.bottom && position != 'center'" ref="bottom">
            <slot name="bottom"></slot>
        </div>
    </div>
</div>
</template>

<style lang="scss">
@import './style.scss';
</style>

<script>
import { cssPrefix, preventScroll } from '@/utils/assist'
import { historyPush } from '@/utils/mixins'
import Mask from '../mask'

export default {
    components: {
        'v-mask': Mask
    },
    mixins: [historyPush],
    props: {
        position: {
            validator(value) {
                return ['bottom', 'center', 'left', 'right'].indexOf(value) > -1;
            },
            default: 'bottom'
        },
        height: {
            type: String,
            default: 'auto'
        },
        width: {
            type: String,
            default: 'auto'
        },
        value: {
            type: Boolean
        },
        closeOnMasker: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            cssPrefix,
            show: this.value
        }
    },
    watch: {
        value(val) {
            if(val){
                // this.pushState();
                preventScroll.lock();
            }else{
                // this.goBack();
                preventScroll.unlock();
            }
            this.show = val;
        }
    },
    computed: {
        classes() {
            const c = [];
            if(this.position === 'center') {
                c.push(`${cssPrefix}popup--center`);
            }else{
                c.push(`${cssPrefix}popup__inner`);
                c.push(`${cssPrefix}popup--${this.position}`);
            }
            if(this.show) {
                c.push(`${cssPrefix}popup--show`);
            }
            return c;
        },
        styles() {
            if (this.position === 'left' || this.position === 'right') {
                return {width: this.width};
            } else if (this.position === 'bottom') {
                return {width: '100%', height: this.height};
            } else {
                return {width: this.width, height: this.height};
            }
        }
    },
    methods: {
        close() {
            if (this.closeOnMasker) {
                this.show = false;
                this.$emit('input', false);
            }
        }
    },
    destroyed() {
        preventScroll.unlock();
    }
}
</script>
