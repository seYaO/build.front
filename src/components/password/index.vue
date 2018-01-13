<template>
<div :class="classes">
    <x-input
        :htmlType="hType"
        :placeholder="placeholder"
        :readonly="readonly"
        :value="value"
        :disabled="disabled" 
        :autocomplete="autocomplete"
        :autofocus="autofocus"
        :maxlength="maxlength"
        :name="name" 
        :clear="false"
        :required="required"
        @on-focus="focusHandler"
        @on-blur="blurHandler"
        @on-keyup="keyupHandler"
        @on-keydown="keydownHandler" 
        @on-change="changeHandler"
        @input="inputHandler"
        @invalid="invalidHandler"
    />
    <button
        :class="[cssPrefix+'password-switch']"
        type="button"
        @click="switchHandler"
    >
        <icon v-if="this.hType==='password'">&#xe602;</icon>
        <icon v-if="this.hType==='text'">&#xe63b;</icon>
    </button>
</div>
</template>

<style lang="less">
// @import './style.less';
</style>
<style lang="scss">
@import './style.scss';
</style>


<script>
import { cssPrefix } from '@/utils/variable'
import { input } from '@/utils/mixins'
import XInput from '../input'
import Icon from '../icon'

export default {
    mixins: [input],
    components: {
        XInput,
        Icon
    },
    data() {
        return {
            cssPrefix,
            hType: 'password'
        }
    },
    computed: {
        classes () {
            return [cssPrefix + 'password']
        }
    },
    methods: {
        changeHandler (value) {
            this.$emit('on-change', value)
        },
        switchHandler () {
            this.hType = this.hType === 'password' ? 'text' : 'password'
        }
    }
}
</script>
