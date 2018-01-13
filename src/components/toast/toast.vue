<template>
    <transition :name="cssPrefix + 'toast-pop'">
        <div v-show="visible" :class="customClass" :style="{ 'padding': type === '' ? '10px' : '20px' }">
            <icon v-if="iconCode[type]" v-html="iconCode[type]"></icon>
            <span :class="cssPrefix + 'toast-text'">{{ message }}</span>
        </div>
    </transition>
</template>

<style lang="scss">
@import './style.scss';
</style>

<script>
import { cssPrefix } from '@/utils/variable'
import Icon from '../icon'

const iconCode = {
    success: '&#xe654;',
    warn: '&#xe653;',
    fail: '&#xe605;'
}

export default {
    components: {
        Icon
    },
    props: {
        message: String,
        className: {
            type: String,
            default: ''
        },
        position: {
            type: String,
            default: 'middle'
        },
        type: {
            type: String
        },
    },

    data() {
        return {
            cssPrefix,
            iconCode,
            visible: false
        };
    },

    computed: {
        customClass() {
            var classes = [];
            classes.push(`${this.cssPrefix}toast`);
            switch (this.position) {
                case 'top':
                    classes.push('is-placetop');
                    break;
                case 'bottom':
                    classes.push('is-placebottom');
                    break;
                default:
                    classes.push('is-placemiddle');
            }
            classes.push(this.className);

            return classes.join(' ');
        }
    }
};
</script>
