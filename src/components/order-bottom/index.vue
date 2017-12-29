<template>
<div class="order-bottom" v-if="showOrderBottom">
    <div class="price"><span class="red">&yen;<em>{{actualPayFee}}</em></span><span class="under">&yen;{{totalFee}}</span></div>
    <div class="btn" @click="insureBtnClick"><span>{{content}}</span></div>
</div>
</template>

<script>
export default {
    props: {
        showOrderBottom: {
            type: Boolean,
            default: true
        },
        totalFee: {
            type: Number,
            default: 0
        },
        actualPayFee: {
            type: Number,
            default: 0
        },
        content:""
    },
    methods: {
        insureBtnClick() {
            this.$emit('on-insure');
        }
    }
}
</script>

<style lang="less">
@import './style.less';
</style>
