<template>
<div style="background-color: #fff;">
    <cell @click="$toast({ message: '操作成功', type: 'success' })"><div slot="title">点击toast</div></cell>
    <cell @click="$indicator.open('识别中...')"><div slot="title">点击indicator</div></cell>
    <cell :arrow="false">
        <div slot="title">开关（{{checked}}）</div>
        <x-switch slot="value" :value="checked" @on-change="changeHandler" />
    </cell>
    <div>
        <spinner color="#26a2ff" type="snake"></spinner>
        <spinner color="#26a2ff" type="double-bounce"></spinner>
        <spinner color="#26a2ff" type="triple-bounce"></spinner>
        <spinner color="#26a2ff" type="fading-circle"></spinner>
    </div>
</div>
</template>

<script>
import { Cell, XButton, XInput, Spinner, XSwitch } from '@/components'
export default {
    components: {
        Cell,
        XButton,
        XInput,
        Spinner,
        XSwitch
    },
    data() {
        return {
            checked: false
        }
    },
    mounted() {
        // this.$indicator.open('识别中...');
        // this.$toast('一次最多识别5张照片');
        // this.$toast({ message: '操作成功', type: 'success' });
        // this.$indicator.open({ text: '加载中...', spinnerType: 'fading-circle' })
        // this.$indicator.open({ text: '加载中...', spinnerType: 'double-bounce' })
        // this.$indicator.open({ text: '加载中...', spinnerType: 'triple-bounce' })
    },
    methods: {
        changeHandler(value) {
            this.checked = value
        }
    }
}
</script>

