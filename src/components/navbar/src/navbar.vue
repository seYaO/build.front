<template>
<header :class="classes" :style="{backgroundColor: bgcolor, height: height}">
    <div :class="cssPrefix + 'navbar-item'">
        <slot name="left"></slot>
    </div>
    <div :class="cssPrefix + 'navbar-center-box'" :style="{height: height}">
        <div :class="cssPrefix + 'navbar-center'">
            <slot name="center"><span :class="cssPrefix + 'navbar-center-title'" :style="{color: color, fontSize: fontsize}">{{title}}</span></slot>
        </div>
    </div>
    <div :class="cssPrefix + 'navbar-item'">
        <slot name="right"></slot>
    </div>
</header>
</template>

<style lang="scss">
@import './style.scss';
</style>

<script>
import { cssPrefix, isColor } from '@/utils/assist'

export default {
    props: {
        title: String,
        fixed: Boolean,
        bgcolor: {
            validator(value) {
                if(!value) return true;
                return isColor(value);
            },
            default: '#FFF'
        },
        color: {
            validator(value) {
                if(!value) return true;
                return isColor(value);
            },
            default: '#5C5C5C'
        },
        fontsize: {
            validator(value) {
                return /^(\.|\d+\.)?\d+(px|rem)$/.test(value);
            },
            default: '.4rem'
        },
        height: {
            validator(value) {
                return /^(\.|\d+\.)?\d+(px|rem)$/.test(value);
            },
            default: '1rem'
        }
    },
    data() {
        return {
            cssPrefix,
        }
    },
    computed: {
        classes() {
            return [`${cssPrefix}navbar`, 'navbar-bottom-line-color', this.fixed ? `${cssPrefix}navbar-fixed` : '']
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
    }
}
</script>
