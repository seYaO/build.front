<template>
<button :disabled="disabled" :class="classes" :style="{backgroundColor: bgcolor, color: color}" :type="actionType">
    <slot></slot>
</button>
</template>

<style lang="scss">
@import './style.scss';
</style>

<script>
import { cssPrefix } from '@/utils/assist'

export default {
    props: {
        disabled: Boolean,
        actionType: {
            validator(value) {
                return ['button', 'submit', 'reset'].indexOf(value) > -1;
            },
            default: 'button'
        },
        type: {
            validator(value) {
                return ['primary', 'danger', 'warning', 'hollow', 'disabled'].indexOf(value) > -1;
            },
            default: 'primary'
        },
        size: {
            validator(value) {
                return ['small', 'large'].indexOf(value) > -1;
            }
        },
        bgcolor: {
            validator(value) {
                if (!value) return true;
                return isColor(value);
            }
        },
        color: {
            validator(value) {
                if (!value) return true;
                return isColor(value);
            }
        },
        shape: {
            validator(value) {
                return ['square', 'circle'].indexOf(value) > -1;
            },
            default: 'square'
        }
    },
    data() {
        return {
            cssPrefix,
        }
    },
    computed: {
        classes() {
            let s = this.size === 'large' ? `${cssPrefix}btn-block` : `${cssPrefix}btn`;
            let b = `${cssPrefix}btn-${this.type}`;
            if (this.disabled) {
                b = `${cssPrefix}btn-disabled`;
            }

            if (this.bgcolor) {
                b = '';
            }
            return [s, b, this.shape === 'circle' ? `${cssPrefix}btn-circle` : ''];
        }
    }
}
</script>
