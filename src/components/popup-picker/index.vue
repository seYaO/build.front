<template>
<popup :open="open" :history="history" @on-close="closeHandler">
    <div :class="classes">
        <div :class="['flexbox',cssPrefix + 'popup-picker-header']">
            <button type="button" :class="[cssPrefix + 'popup-picker-cancel']" @click="cancelHandler">{{cancelText}}</button>
            <button type="button" :class="['flexbox-item',cssPrefix + 'popup-picker-placeholder']">{{placeholder}}</button>
            <button type="button" :class="[cssPrefix + 'popup-picker-confirm']" @click="confirmHandler">{{confirmText}}</button>
        </div>
        <divider></divider>
        <div :class="['flexbox',cssPrefix + 'popup-picker']">
            <picker v-if="open && myPickers" v-for="(item,index) in myPickers" :class="['flexbox-item',cssPrefix + 'popup-picker-item']" :index="index" :key="index" :value="item.value" :placeholder="item.placeholder" :options="item.options" @on-change="changeHandler" />
        </div>
    </div>
</popup>
</template>

<style lang="less">
// @import './style.less';
</style>

<style lang="scss">
@import './style.scss';
</style>


<script>
import { cssPrefix } from '@/utils/variable'
import Popup from '../popup'
import Picker from '../picker'
import Divider from '../divider'

export default {
    components: {
        Popup,
        Picker,
        Divider
    },
    props: {
        open: {
            type: Boolean,
            default: false
        },
        history: {
            type: Boolean,
            default: true
        },
        pickers: {
            type: Array
        },
        placeholder: {
            type: String
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        confirmText: {
            type: String,
            default: '完成'
        },
        pickerIndex: {
            type: Number,
            default: 0
        },
        pickerType: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            cssPrefix,
            myPickers: this.pickers
        }
    },
    computed: {
        classes() {
            return [cssPrefix + 'popup-picker-wrapper']
        }
    },
    methods: {
        cancelHandler() {
            this.$emit('on-close', this.pickerIndex, this.pickerType)
        },
        closeHandler() {
            this.$emit('on-close', this.pickerIndex, this.pickerType)
        },
        confirmHandler() {
            let value = []
            for (let item of this.myPickers) {
                value.push({
                    value: item.value
                })
            }
            if (!this.value || value.toString() !== this.value.toString()) {
                this.open && this.$emit('on-change', value, this.pickerIndex, this.pickerType).$emit('input', value)
            } else {
                this.closeHandler()
            }
        },
        changeHandler(value, index) {
            this.myPickers[index].value = value
            this.$emit('on-pickerchange', value, index)
        }
    },
    watch: {
        pickers(value) {
            this.myPickers = value
        }
    }
}
</script>