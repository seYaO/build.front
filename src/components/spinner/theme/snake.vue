<template>
<div :class="cssPrefix + 'spinner-snake'" :style="{ 'border-top-color': spinnerColor, 'border-left-color': spinnerColor, 'border-bottom-color': spinnerColor, 'height': spinnerSize, 'width': spinnerSize }"></div>
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
}
</script>

<style lang="scss">
@import '~styles/variable.scss';
@import '~styles/mixins.scss';
.#{$css-prefix}spinner {
    &-snake {
        animation: #{$css-prefix}spinner-rotate 0.8s infinite linear;
        border: 4PX solid transparent;
        border-radius: 50%;
    }
}
@keyframes #{$css-prefix}spinner-rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
