<template>
<div :class="classes">
    <input 
        :disabled="disabled" 
        :name="name" 
        :checked="value"
        type="checkbox"
        @change="changeHandler"
    />
    <button type="button"></button>
</div>
</template>

<style lang="scss">
@import './style.scss';
</style>

<script>
import { cssPrefix } from '@/utils/variable'
import { input } from '@/utils/mixins'
export default {
    mixins: [input],
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            cssPrefix
        }
    },
    computed: {
        classes() {
            return [cssPrefix + 'switch-wrapper']
        }
    },
    methods: {
        changeHandler (e) {
            let value = e.target.checked
            this.$emit('on-change', value).$emit('input', value)
        }
    }
}
</script>
