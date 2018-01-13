<template>
<label :class="classes" @focusin="focusHandler" @focusout="blurHandler">
    <slot name="icon"></slot>
    <slot v-if="$slots.default"></slot>
    <input
        v-else
        :type="htmlType"
        :placeholder="placeholder"
        :readonly="readonly"
        :value="value"
        :disabled="disabled" 
        :autocomplete="autocomplete"
        :autofocus="autofocus"
        :maxlength="maxlength"
        :name="name" 
        :required="required"
        :pattern="pattern"
        @keyup="keyupHandler"
        @keydown="keydownHandler" 
        @change="changeHandler"
        @input="inputHandler"
        @invalid="invalidHandler"
    />
    <transition name="input-clear-fade">
        <button type="button" v-show="clear&&isFocus" :class="cssPrefix + 'input-clear-button'" @click="clearHandler">
            <icon>&#xe641;</icon>
        </button>
    </transition>
</label>
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
import Icon from '../icon'

export default {
    components: {
        Icon
    },
    mixins: [input],
    data() {
        return {
            cssPrefix,
            isFocus: false
        }
    },
    computed: {
        classes () {
            let classes = {}
            classes[cssPrefix + 'input-focus'] = this.isFocus
            classes[cssPrefix + 'input-clear'] = !!this.value && this.clear
            return [
                cssPrefix + 'input-wrapper',
                classes
            ]
        }
    },
    methods: {
        clearHandler(e) {
            this.clear && this.$el.classList.remove(this.cssPrefix + 'input-clear')
            this.$emit('on-change', '').$emit('input', '')
        },
        inputHandler(e) {
            if (e.target.value) {
                this.clear && this.$el.classList.add(this.cssPrefix + 'input-clear')
            } else {
                this.clear && this.$el.classList.remove(this.cssPrefix + 'input-clear')
            }
            this.$emit('input', e.target.value)
        }
    }
}
</script>
