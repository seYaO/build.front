<template>
<div class="pay-success" v-if="companyName">
    <div class="title-block">
        <div class="block-left">
        <div class="left-title"><i></i>订单支付成功</div>
        <div class="left-content">您已成功购买由{{companyName}}提供的保险，稍后您的手机将会收到投保确认短信，请注意查收。</div>
        </div>
        <div class="block-right"></div>
    </div>
    <div class="bottom-block">
        <div class="finalFee">实付金额：<span>&yen;&nbsp;{{finalFeeHandle}}</span></div>
        <div class="btns">
            <div class="btn seeDetail" @click="goDetail">查看订单</div>
            <div class="btn seeList" @click="goToProductList">返回产品列表</div>
        </div>
    </div>
</div>
</template>

<style lang="less">
@import "./style.less";
</style>

<script>
import * as pay from "@/services/pay";
import { getPrice } from "@/utils";
export default {
    components: {},
    data() {
        return {
            companyName: "",
            orderPayInfo: "",
            orderCode:""
        };
    },
    beforeMount() {
        document.title = '收银台'
    },
    mounted() {
        this.initData();
    },
    computed: {
        finalFeeHandle() {
            const { totalFee, reduceAmount,couponAmount } = this.orderPayInfo;
            let tempPrice = 0;      
            if (!!this.orderPayInfo) {
                if (reduceAmount > 0) {
                tempPrice = Number(totalFee) - Number(reduceAmount);
                } else {
                tempPrice = Number(totalFee);
                }
                if(couponAmount > 0){
                tempPrice = tempPrice - Number(couponAmount);
                if(tempPrice < 0){
                    tempPrice  = 0;
                }
                }
            }
            return getPrice(tempPrice);
        }
    },
    methods: {
        async initData() {
            const { id } = this.$route.params;
            const res = await pay.success({ orderCode: id, payType: 'pay' });
            const { code, data } = res;
            if (code === "0000") {
                this.companyName = data.companyName;
                this.orderPayInfo = data.orderPayInfo;
                this.orderCode = data.orderCode;
            }
        },
        goToProductList() {
            this.$router.push({ path: `/` });
        },
        // 去详情页
        goDetail() {
            this.$router.push({ path: `/order/detail/${this.orderCode}` });
        }
    }
};
</script>
