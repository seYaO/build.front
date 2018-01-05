<template>
<div>
    <div @click="$refs.startTime.open()">点击</div>
    <div @click="checked = true">点击2</div>
    <div @click="checked2 = true">点击3</div>
    <input type="file" accept="image/*" multiple="multiple">
    <mt-datetime-picker
        ref="startTime"
        v-model="pickerVisible"
        type="date"
        :start-date="new Date('2016-05-08')"
        :end-date="new Date('2017-10-09')"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日">
    </mt-datetime-picker>
    <datetime-picker
        format="yyyy-MM-dd"
        :open="checked"
        :value="defaults"
        :min="start"
        :max="end"
        :pickerIndex="-1"
        :pickerType="'birthday'"
        @on-close="checked = false;"
    />
    <datetime-picker
        format="yyyy-MM-dd"
        :open="checked2"
        :value="defaults2"
        :min="start2"
        :max="end2"
        :pickerIndex="-1"
        :pickerType="'birthday'"
        @on-close="checked2 = false;"
    />
</div>
</template>

<style lang="less">

</style>

<script>
import { Popup, PopupPicker, Alert, Confirm, Prompt, DatetimePicker } from '@/components'

export default {
    components: {
        Popup,
        PopupPicker,
        Alert,
        Confirm,
        Prompt,
        DatetimePicker
    },
    data() {
        return {
            pickerVisible: '',
            checked: false,
            
            disabled: false,
            value: '',
            defaults: '2017-12-30',
            start: '2017-12-30',
            end: '2018-12-29',
            checked2: false,
            value2: '',
            defaults2: '2015-12-30',
            start2: '2014-12-30',
            end2: '2018-12-29',
        }
    },
    mounted() {},
    methods: {
        changePickerHandler(value){
            console.log(value)
        },
        changePickerOpenHandler(value){
            this.pickerChecked = !this.pickerChecked
        },
        confirmHandler(value){
            console.log(value)
            this.pickerChecked = false
        },
        changeHandler() {
            this.checked = !this.checked
        }
    }
}
</script>
