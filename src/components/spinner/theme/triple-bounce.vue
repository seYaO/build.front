<template>
<div :class="cssPrefix + 'spinner-triple-bounce'">
    <div :class="cssPrefix + 'spinner-triple-bounce-bounce1'" :style="bounceStyle"></div>
    <div :class="cssPrefix + 'spinner-triple-bounce-bounce2'" :style="bounceStyle"></div>
    <div :class="cssPrefix + 'spinner-triple-bounce-bounce3'" :style="bounceStyle"></div>
</div>
</template>

<script>
import { cssPrefix } from '@/utils/variable'
import common from './common'

export default {
    mixins: [common],
    data() {
        return {
            cssPrefix
        }
    },
    computed: {
        spinnerSize() {
            return ((this.size || this.$parent.size || 28) / 3) + 'px';
        },

        bounceStyle() {
            return {
                width: this.spinnerSize,
                height: this.spinnerSize,
                backgroundColor: this.spinnerColor
            };
        }
    }
}
</script>

<style lang="scss">
@import '~styles/variable.scss';
@import '~styles/mixins.scss';
.#{$css-prefix}spinner {
    &-triple-bounce {
        &-bounce1, &-bounce2, &-bounce3 {
            border-radius: 100%;
            display: inline-block;
            animation: #{$css-prefix}spinner-triple-bounce 1.4s infinite ease-in-out both;
        }
        &-bounce1 {
            animation-delay: -0.32s;
        }
        &-bounce2 {
            animation-delay: -0.16s;
        }
    }
}
@keyframes #{$css-prefix}spinner-triple-bounce {
    0%, 80%, 100% {
        transform: scale(0);
    }
    40% {
        transform: scale(1.0);
    }
}
</style>

