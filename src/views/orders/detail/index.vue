<template>
<div class="order" :class="{ bottom: data.orderStatus === '待支付' }" v-if="data">
    <load-more :on-refresh="onRefresh" :enableInfinite="false">
        <dl>
            <dt class="tit">
                <div>订单信息</div>
                <div>{{data['orderStatus']}}</div>
            </dt>
            <dd>
                <div class="list">
                    <div class="link" @click="gotoProduct">{{data['title']}}</div>
                </div>
                <div class="list">
                    <div class="name">订单号</div>
                    <div>{{data['orderCode']}}</div>
                </div>
                <div class="list" v-if="data['safeguardPeriod']">
                    <div class="name">保障期限</div>
                    <div>{{data['safeguardPeriod']}}</div>
                </div>
                <div class="list" v-if="data['createTime']">
                    <div class="name">预定日期</div>
                    <div>{{data['createTime']}}</div>
                </div>
                <div class="list" v-if="data['flightCode']">
                    <div class="name">航班号</div>
                    <div>{{data['flightCode']}}</div>
                </div>
                <div class="list" v-if="data['startAirportName']">
                    <div class="name">出发机场</div>
                    <div>{{data['startAirportName']}}</div>
                </div>
                <div class="list" v-if="data['arriveAirportName']">
                    <div class="name">到达机场</div>
                    <div>{{data['arriveAirportName']}}</div>
                </div>
                <div class="list" v-if="data['destinationView']">
                    <div class="name">出行目的地</div>
                    <div>{{data['destinationView']}}</div>
                </div>
                <div class="list" v-if="data['tourGroupCode']">
                    <div class="name">旅行团号</div>
                    <div>{{data['tourGroupCode']}}</div>
                </div>
                <div class="list">
                    <div class="name">被保人数</div>
                    <div>{{data['insurantNumber']}}</div>
                </div>
                <div class="list">
                    <div class="name">总投保份数</div>
                    <div>{{data['totalQty']}}份</div>
                </div>
                <div class="list">
                    <div class="name">保费</div>
                    <div>&yen;{{data['totalFee']}}</div>
                </div>
                <div class="list" v-if="data['discountPrice']">
                    <div class="name">优惠金额</div>
                    <div>-&yen;{{data['discountPrice']}}</div>
                </div>
                <div class="list" v-if="data['redPackagePrice']">
                    <div class="name">红包优惠</div>
                    <div>&yen;{{data['redPackagePrice']}}</div>
                </div>
                <div class="list" v-if="data['orderStatus'] !== '待支付' && data['orderStatus'] !== '已关闭' && data['orderStatus'] !== '已取消'">
                    <div class="name">实付金额</div>
                    <div>&yen;{{data['price']}}</div>
                </div>
            </dd>
        </dl>
        <dl>
            <dt class="yellow">
                <div class="title">投保人</div>
                <div class="content">
                    <div class="n">{{data['holderName']}}</div>
                    <div class="link" v-if="data['isSendEmail']" @click="getEmail">{{showVoucher() ? '发送保单和凭证至邮箱' : '发送保单至邮箱'}}</div>
                </div>
            </dt>
        </dl>
        <!-- 团单 -->
        <template v-if="data['isGroup']">
            <dl>
                <dt class="tit yellow">
                    <div class="title">保单信息</div>
                    <div>{{data['insurants'][0]['policyStatus']}}</div>
                </dt>
                <dd v-if="data['orderStatus'] === '已支付' && data['insurants'] && data['insurants'][0]['isDownload']">
                    <div class="list">
                        <div class="name">电子保单号</div>
                        <div class="content">
                            <div class="o">{{data['insurants'][0]['policyCode']}}</div>
                            <div class="d">
                                <span class="link" v-if="data['insurants'][0]['policyUrl']" @click="downloadPDF(data['insurants'][0]['policyCode'], data['companyName'], '电子保单', data['insurants'][0]['policyUrl'])">下载电子保单</span>
                                <span class="link" v-if="data['insurants'][0]['certificateUrl']" @click="downloadPDF(data['insurants'][0]['policyCode'], data['companyName'], '保险凭证', data['insurants'][0]['certificateUrl'])">下载保险凭证</span>
                            </div>
                        </div>
                    </div>
                </dd>
            </dl>
        </template>
        <!-- 个单 -->
        <template v-if="!data['isGroup']">
            <dl v-if="data['insurants']" v-for="(item, index) in data['insurants']" :key="index">
                <dt>
                    <div class="title">被保人{{data['insurants'].length > 1 ? index+1 : ''}}</div>
                    <div class="content">
                        <div class="n">{{item['insurantName']}}</div>
                        <div>{{item['policyStatus']}}</div>
                    </div>
                </dt>
                <dd v-if="data['orderStatus'] === '已支付' && item['isDownload']">
                    <div class="list">
                        <div class="name">电子保单号</div>
                        <div class="content">
                            <div class="o">{{item['policyCode']}}</div>
                            <div class="d">
                                <span class="link" v-if="item['policyUrl']" @click="downloadPDF(item['insurantName'], item['policyCode'], '电子保单', item['policyUrl'])">下载电子保单</span>
                                <span class="link" v-if="item['certificateUrl']" @click="downloadPDF(item['insurantName'], item['policyCode'], '保险凭证', item['certificateUrl'])">下载保险凭证</span>
                            </div>
                        </div>
                    </div>
                </dd>
            </dl>
        </template>
    </load-more>
    <order-bottom :content="'立即支付'" :showOrderBottom="data.hasPay" :totalFee="data.totalFee" :actualPayFee="data.price" @on-insure="insureBtnClick"></order-bottom>
    <!-- alert -->
    <alert :open="alertShow" @on-confirm="alertShow = false">{{alertText}}</alert>
    <!-- prompt -->
    <prompt v-model="promptValue" :open="promptShow" :disabled="promptDisable" title="请输入获取保单邮件的邮箱地址" :input="{placeholder:''}" @focusin="promptErrMsg = ''" :errMsgShow="true" :errMsg="promptErrMsg" @on-close="promptShow = false" @on-confirm="confirmPromptHandler"></prompt>
</div>
</template>

<style lang="less">
@import './style.less';
</style>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { OrderBottom, LoadMore, Prompt, Alert } from '@/components'
import { emailValidate } from '@/utils/validate'
import * as order from '@/services/order'
import * as other from '@/services/other'
import { wxsharecnt } from '@/utils/sharecnt';

export default {
    components: {
        LoadMore,
        OrderBottom,
        Prompt,
        Alert
    },
    data() {
        return {
            data: null,
            alertShow: false,
            alertText: '',
            promptShow: false,
            promptValue: '',
            promptDisable: false,
            promptErrMsg: ''
        }
    },
    beforeMount() {
        document.title = '订单详情'
    },
    computed: {},
    mounted() {
        wxsharecnt({
            shareImg:'',
            shareTitle:'',
            shareUrl : '',
            shareDesc : ''
        });

        this.getData()
    },
    methods: {
        // 获取数据
        async getData(done) {
            const { id = '' } = this.$route.params;
            const res = await order.detail({ orderCode: id });
            const { code, data } = res;
            if(code === '0000'){
                this.data = data;
            }
            if(done) done();
        },
        showVoucher() {
            const { orderStatus, insurants } = this.data;
            let isVoucher = false;
            for(let i = 0; i < insurants.length; i++){
                if(insurants[i].certificateUrl){
                    isVoucher = true;
                    break;
                }
            }
            return isVoucher;
        },
        // 跳转产品详情页面
        gotoProduct(){
          const { productCode , isProductValid} = this.data;
          if(isProductValid != 0){
            this.alertShow = true;
            this.alertText = '该产品已下架，请选择其他产品~';
            return;
          }
          this.$router.push({ path: `/product/detail/${productCode}` });
        },
        // 显示邮箱弹框
        getEmail() {
            this.promptShow = true;
        },

        // 下载pdf
        downloadPDF(code1,code2,code3,url){
            let href = `/api/download?name=${code1}${code2}${code3}&uri=${encodeURIComponent(url)}`;
            location.href = href;
        },

        // 确定邮箱
        async confirmPromptHandler(value) {
            if(!emailValidate(value)){
                this.promptErrMsg = '请输入正确的邮箱格式';
                return;
            }
            this.promptShow = false;
            const { id = '' } = this.$route.params;
            const res = await other.email({ orderCode: id, email: value });
            const { code, data } = res;
            this.alertShow = true;
            if(code === '0000'){
                this.alertText = '邮箱发送成功，请注意查收~';
            }else if(code === '1001'){
                location.href = '/login';
            }else{
                this.alertText = '邮箱发送失败，请重新发送~';
            }
        },
        insureBtnClick() {
            const { id = '' } = this.$route.params;
            location.href = `/orderPay/${id}`
            // this.$router.push({ path: `/pay/${id}` });
        },

        // 下拉刷新
        onRefresh(done) {
            this.getData(done);
        }
    }
}
</script>
