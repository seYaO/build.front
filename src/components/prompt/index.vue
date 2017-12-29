<template>
<confirm
    :class="classes"
    :open="open"
    :cancel="true"
    :cancel-text="cancelText"
    :confirm-text="confirmText"
    @on-close="closeHandler"
    @on-confirm="confirmHandler"
>
    <div v-if="title" :class="cssPrefix + 'prompt-title'">{{title}}</div>
    <slot v-if="$slots.default"></slot>
    <template v-else>
        <password
            v-if="input.type === 'password'"
            v-model="myValue"
            :clear="false"
            :class="cssPrefix + 'prompt-input'"
            :placeholder="input.placeholder"
            @input="inputHandler"
            @focusin="focusHandler"
        />
        <x-input
            v-else
            v-model="myValue"
            :clear="false"
            :class="cssPrefix + 'prompt-input'"
            :htmlType="input.type"
            :placeholder="input.placeholder"
            @input="inputHandler"
            @focusin="focusHandler"
        />
        <div class="errMsg" :class="{ hidden: !errMsg }" v-if="errMsgShow"><i class="warn">!</i><span>{{errMsg}}</span></div>
    </template>
</confirm>
</template>

<style lang="less">
@import './style.less';
</style>

<script>
import { cssPrefix } from '@/utils/variable'
import Confirm from '../confirm'
import XInput from '../input'
import Password from '../password'

export default {
    components: {
        Confirm,
        XInput,
        Password
    },
    props: {
        open: {
            type: Boolean,
            default: false
        },
        cancelText: {
            type: String
        },
        confirmText: {
            type: String
        },
        title: {
            type: String
        },
        input: {
            type: Object,
            default () {
                return {}
            }
        },
        value: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        errMsgShow: {
            type: Boolean,
            default: false
        },
        errMsg: {
            type: String
        }
    },
    data () {
        return {
            cssPrefix,
            myValue: this.value
        }
    },
    computed: {
        classes () {
            return [cssPrefix + 'prompt', this.disabled ? cssPrefix + 'prompt-disabled' : '']
        }
    },
    methods: {
        focusHandler() {
            this.$emit('focusin')
        },
        closeHandler () {
            this.$emit('on-close')
        },
        confirmHandler () {
            this.open && this.$emit('on-confirm', this.myValue).$emit('input', this.myValue)
        },
        inputHandler (value) {
            this.$emit('on-change', value)
        }
    }
}
</script>
