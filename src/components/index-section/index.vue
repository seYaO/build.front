<template>
<li :class="classes">
    <p :class="cssPrefix + 'indexsection-index'">{{index}}</p>
    <ul>
        <slot></slot>
    </ul>
</li>
</template>

<style lang="less">
@import './style.less';
</style>

<script>
import { cssPrefix } from '@/utils/variable'

export default {
    props: {
        index: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            cssPrefix
        }
    },
    computed: {
        classes() {
            return [cssPrefix + 'indexsection']
        }
    },
    mounted() {
        this.$parent.sections.push(this);
    },
    beforeDestroy() {
        let index = this.$parent.sections.indexOf(this);
        if (index > -1) {
            this.$parent.sections.splice(index, 1);
        }
    }
}
</script>
