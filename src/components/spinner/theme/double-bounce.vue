<template>
<div :class="cssPrefix + 'spinner-double-bounce'" :style="{ width: spinnerSize, height: spinnerSize }">
    <div :class="cssPrefix + 'spinner-double-bounce-bounce1'" :style="{ backgroundColor: spinnerColor }"></div>
    <div :class="cssPrefix + 'spinner-double-bounce-bounce2'" :style="{ backgroundColor: spinnerColor }"></div>
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
    }
}
</script>

<style lang="scss">
@import '~styles/variable.scss';
@import '~styles/mixins.scss';
.#{$css-prefix} {
    &spinner{
        &-double-bounce{
            position: relative;
            &-bounce1,&-bounce2{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                opacity: 0.6;
                position: absolute;
                top: 0;
                left: 0;

                animation: #{$css-prefix}spinner-double-bounce 2.0s infinite ease-in-out;
            }
            &-bounce2{
                animation-delay: -1.0s;
            }
        }
    }
}
@keyframes #{$css-prefix}spinner-double-bounce {
    0%, 100% {
        transform: scale(0.0);
    }

    50% {
        transform: scale(1.0);
    }
}
</style>


