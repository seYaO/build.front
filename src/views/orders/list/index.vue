<template>
<div class="order">
    <div class="navbar">
        <ul>
            <li v-for="(item, index) in navs" :key="index" :class="{ curr: item.curr }" @click="changeTab(index, item['code'])">{{item['name']}}</li>
        </ul>
    </div>
    <load-more :tabIndex="tabIndex" :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText">
        <div class="list">
            <div class="item" v-for="(item, index) in list" :key="index" @click="goDetail(item['orderCode'])">
                <div class="intro">
                    <div class="label" v-if="item['waterMark']" :class="{ effect: item['waterMark'] === '保障中', overdue: item['waterMark'] === '已失效', undue: item['waterMark'] === '未生效' }"></div>
                    <div class="intro-info">
                        <div class="title">{{item['title']}}</div>
                        <div class="people" v-if="item['names'] && item['names'][0]">被保人： {{item['names'][0]}}{{ item['names'].length > 1 ? '（' + item['names'].length + '）' : ''}}</div>
                        <div class="time">保障期限：{{item['safeguardPeriod']}}</div>
                    </div>
                    <div class="intro-data">
                        <div class="p">&yen;{{item['price']}}</div>
                        <div class="status">{{item['orderStatus']}}</div>
                    </div>
                </div>
                <div class="btns">
                    <!-- <div class="btn blue" v-if="item['hasDownload']">保单下载</div> -->
                    <div class="btn" v-if="item['hasCancel']" @click.stop="goCancel(item['orderCode'])">取消</div>
                    <div class="btn" v-if="item['hasReturn']" @click.stop="goReturn(item['orderCode'])">退保</div>
                    <div class="btn" v-if="item['hasRedeliver']" @click.stop="goRedelive(item['productCode'], item['orderCode'])">重投</div>
                    <div class="btn red" v-if="item['hasPay']" @click.stop="goPay(item['orderCode'])">立即支付</div>
                </div>
            </div>
        </div>
    </load-more>
    <tab-bar :current="1"></tab-bar>
    <!-- alert -->
    <alert :open="alertShow" @on-confirm="alertShow = false">{{alertText}}</alert>
    <!-- confirm -->
    <confirm :open="confirmShow" @on-close="confirmShow = false" @on-confirm="confirmHandler">{{confirmText}}</confirm>
</div>
</template>

<style lang="less">
@import './style.less';
</style>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import * as order from '@/services/order'
import { LoadMore, TabBar, Confirm, Alert } from '@/components'
import { wxsharecnt } from '@/utils/sharecnt';

let current = 1; // 分页页码
let pageCount = 1; // 总页数
let navType = '';

export default {
    components: {
        LoadMore,
        TabBar,
        Confirm,
        Alert
    },
    data() {
        return {
            alertShow: false,
            alertText: '',
            confirmShow: false,
            confirmOrderCode: '',
            confirmType: '',
            confirmText: '',
            tabIndex: "0",
            loadingText: '加载中...',
            list: []
        }
    },
    beforeMount() {
        current = 1;
        document.title = '订单列表'
    },
    computed: {
        ...mapState({
            navs: state => state.order.navs
        }),
        ...mapGetters([ 'doneOrderCurr' ])
    },
    mounted() {
        wxsharecnt({
            shareImg:'',
            shareTitle:'',
            shareUrl : '',
            shareDesc : ''
        });
        this.getData();
    },
    methods: {
        // 获取数据
        async getData(done, refresh) {
            const res = await order.list({ type: navType, page: current });
            const { code, totalPage, data } = res;
            if(code === '0000') {
                pageCount = totalPage;
                this.list = refresh ? [...data] : this.list.concat([...data]);
                if(current < pageCount){
                    this.loadingText = '上拉加载更多'
                }else{
                    this.loadingText = '没有更多了~'
                }
            }
            if(done) done();
        },

        // nav切换
        changeTab(index, code) {
            navType = code;
            current = 1;
            this.list = [];
            this.doneOrderCurr(index);
            this.getData(null, true);
            this.loadingText = '加载中...';
        },

        // 去详情页
        goDetail(code) {
            location.href = `/order/detail/${code}`
            // this.$router.push({ path: `/order/detail/${code}` });
        },

        // 退保
        async goReturn(orderCode) {
            const res = await order.refundPopup({ orderCode });
            const { code, data, message } = res;
            if(code === '0000') {
                const { totalReturnNum = 0, totalReturnFee = 0 } = data;
                this.confirmType = 'return';
                this.confirmShow = true;
                this.confirmText = `可退保单${totalReturnNum}份，退款金额${totalReturnFee}元，确认退保吗?`;
                this.confirmOrderCode = orderCode;
            }else{
                this.alertShow = true;
                this.alertText = message;
            }
        },

        // 重投
        goRedelive(productCode, orderCode) {
            this.$router.push({ path: `/product/detail/${productCode}`, query: { orderCode } });
        },

        // 取消
        goCancel(orderCode) {
            this.confirmType = 'cancel';
            this.confirmShow = true;
            this.confirmText = '确认取消订单吗?';
            this.confirmOrderCode = orderCode;
        },

        // 立即支付
        goPay(orderCode) {
            location.href = `/pay/${orderCode}`
            // this.$router.push({ path: `/pay/${orderCode}` });
        },

        async confirmHandler() {
            const confirmType = this.confirmType;
            this.confirmShow = false;
            if(confirmType == 'cancel'){
                const res = await order.cancel({ orderCode: this.confirmOrderCode });
                const { code, data, message } = res;
                if(code === '0000') {
                    current = 1;
                    this.getData(null, true);
                }else{
                    this.alertShow = true;
                    this.alertText = message;
                }
            }else if(confirmType == 'return'){
                const res = await order.refund({ orderCode: this.confirmOrderCode });
                const { code, data, message } = res;
                if(code === '0000') {
                    current = 1;
                    this.getData(null, true);
                }else{
                    this.alertShow = true;
                    this.alertText = message;
                }
            }
        },

        // 下拉刷新
        onRefresh(done) {
            current = 1;
            this.getData(done, true);
        },

        // 上拉加载数据
        onInfinite(done) {
            if(this.list[0]) {
                current++;
                if(current <= pageCount){
                    this.loadingText = '上拉加载更多'
                    this.getData(done);
                }else{
                    this.loadingText = '没有更多了~'
                }
            }
        }
    }
}
</script>
