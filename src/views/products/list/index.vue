<template>
<div class="product">
    <div class="navbar">
        <ul>
            <li v-for="(item, index) in navs" :key="index" :class="{ curr: item.curr }" @click="changeTab(index, item.code)">{{item.name}}</li>
        </ul>
    </div>
    <load-more :tabIndex="tabIndex" :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText">
        <div class="list">
            <div class="item" v-for="(item, index) in list" :key="index" @click="goDetail(item['code'])">
                <div class="intro clearfix">
                    <div class="intro-img">
                        <img :src="item['picture']" alt="">
                        <div class="txt">{{item['name']}}</div>
                    </div>
                    <div class="intro-info">
                        <div class="title">{{item['title']}}</div>
                        <div class="tags"><span v-for="(_item, _index) in item['tags']" :key="_index">{{_item}}</span></div>
                        <div class="data">
                            <div class="total">销量：{{item['sales']}}份</div>
                            <div class="price">
                                <span>&yen;<em>{{item['minPrice']}}</em></span>起
                            </div>
                        </div>
                    </div>
                </div>
                <div class="labels" v-if="item['redPacket'] || item['discount']">
                    <span class="label" v-if="item['redPacket']">{{item['redPacket']}}</span>
                    <span class="disc" v-if="item['discount']"><i>惠</i><em>{{item['discount']}}</em></span>
                </div>
            </div>
        </div>
    </load-more>
    <tab-bar :current="0"></tab-bar>
</div>
</template>

<style lang="less">
@import './style.less';
</style>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import * as product from '@/services/product'
import { LoadMore, TabBar } from '@/components'
import { setLocalStore, getLocalStore, getOpenId } from '@/utils'
import { isWeChart } from '@/utils/validate'
import { wxsharecnt } from '@/utils/sharecnt';

let current = 1; // 分页页码
let pageCount = 1; // 总页数
let navType = 'albAll';

export default {
    components: {
        LoadMore,
        TabBar
    },
    data() {
        return {
            tabIndex: "0",
            loadingText: '加载中...',
            list: []
        }
    },
    beforeMount() {
        current = 1;
        document.title = '爱购保'
    },
    computed: {
        ...mapState({
            navs: state => state.product.classifys
        }),
        ...mapGetters([ 'doneProductCurr' ])
    },
    mounted() {
        wxsharecnt({
            shareImg:'',
            shareTitle:'',
            shareUrl : '',
            shareDesc : ''
        });
        this.getClassify();
        this.getData();

        const openId = getLocalStore('openId');
        const { code = '' } = this.$route.query;
        !openId && setLocalStore('openId', code);

        if(!openId && isWeChart() && !code){
            location.href = getOpenId();
        }
    },
    methods: {
        ...mapActions([ 'getClassify' ]),

        // 获取数据
        async getData(done, refresh) {
            const res = await product.list({ type: navType, page: current });
            const { code, totalPage, data } = res;
            if(code === '0000') {
                pageCount = totalPage;
                this.list = refresh ? [...data] : this.list.concat([...data]);
                if(current < pageCount){
                    this.loadingText = '上拉加载更多'
                }else{
                    this.loadingText = '没有更多了~'
                }
            }else if(code === '1001'){
                location.href = '/login';
            }
            if(done) done();
        },

        // nav切换
        changeTab(index, code) {
            navType = code;
            current = 1;
            this.list = [];
            this.tabIndex = index.toString();
            this.doneProductCurr(index)
            // this.getData(null, true);
            this.loadingText = '加载中...';
        },

        goDetail(code){
            this.$router.push({ path: `/product/detail/${code}` });
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


