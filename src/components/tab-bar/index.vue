<template>
<div class="tab-bar">
    <div :class="{ curr: current === 0 }" @click="goLink(0)"><i class="products"></i><span>我要投保</span></div>
    <div :class="{ curr: current === 1 }" @click="goLink(1)"><i class="orders"></i><span>我的订单</span></div>
</div>
</template>

<script>
export default {
    props: {
        current: Number
    },
    methods: {
        goLink(num) {
            switch(num){
                case 0:
                    location.href = '/';
                    // this.$router.push({ path: `/` });
                    break;
                case 1:
                    location.href = '/order/list'
                    // this.$router.push({ path: `/order/list` });
                    break;
            }            
        }
    }
}
</script>

<style lang="less">
@import './style.less';
</style>