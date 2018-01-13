<template>
<transition :name="cssPrefix + 'indicator'">
    <div :class="cssPrefix + 'indicator'" v-show="visible">
        <div :class="cssPrefix + 'indicator-wrapper'" :style="{ 'padding': text ? '20px' : '15px' }">
            <spinner :class="cssPrefix + 'indicator-spin'" :type="convertedSpinnerType" :size="32"></spinner>
            <span :class="cssPrefix + 'indicator-text'" v-show="text">{{ text }}</span>
        </div>
        <div :class="cssPrefix + 'indicator-mask'" @touchmove.stop.prevent></div>
    </div>
</transition>
</template>

<style lang="scss">
@import './style.scss';
</style>

<script>
import { cssPrefix } from '@/utils/variable'
import Spinner from '../spinner'

export default {
    components: {
        Spinner
    },
    props: {
        text: String,
        spinnerType: {
            type: String,
            default: 'snake'
        }
    },
    data() {
        return {
            cssPrefix,
            visible: false
        }
    },
    computed: {
        convertedSpinnerType() {
            switch (this.spinnerType) {
                case 'double-bounce':
                    return 1;
                case 'triple-bounce':
                    return 2;
                case 'fading-circle':
                    return 3;
                default:
                    return 0;
            }
        }
    }
}
</script>
