<template>
<div style="background-color: #fff;">
    <cell @click="checked = true"><div slot="title">点击datetime-picker</div></cell>
    <cell><div slot="title"><input type="file" accept="image/*" multiple="multiple"></div></cell>
    <cell @click="alertChecked = true"><div slot="title">点击alert</div></cell>
    <cell @click="confirmChecked = true"><div slot="title">点击confirm</div></cell>
    <cell @click="promptChecked = true"><div slot="title">点击prompt</div></cell>

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
    <alert :open="alertChecked" @on-confirm="alertChecked = false">斯蒂芬规划</alert>
    <confirm :open="confirmChecked" @on-close="confirmChecked = false" @on-confirm="confirmChecked = false">斯蒂芬规划</confirm>
    <prompt v-model="promptValue" :open="promptChecked" :disabled="true" title="请输入交易密码" :input="{placeholder:'请输入交易密码'}" @input="inputHandler" @on-close="promptChecked = false"></prompt>
</div>
</template>

<script>
import { Popup, PopupPicker, Alert, Confirm, Prompt, DatetimePicker, Cell } from '@/components'
export default {
    components: {
        Popup,
        PopupPicker,
        Alert,
        Confirm,
        Prompt,
        DatetimePicker,
        Cell
    },
    data() {
        return {
            checked: false,
            defaults: '2017-12-30',
            start: '2017-12-30',
            end: '2018-12-29',
            alertChecked: false,
            confirmChecked: false,
            promptChecked: false,
            promptValue: ''
        }
    },
    mounted() {},
    methods: {
        inputHandler(value) {
            console.log(value)
        }
    }
}
</script>

