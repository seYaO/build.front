<template>
<div class="product" v-if="data">
    <div class="top">
        <div class="tit">{{data['productName']}}</div>
        <div class="img"><img :src="data['insuranceCompanyLogo']" alt=""></div>
    </div>
    <div class="planNav-out" v-if="plans">
        <div :class="['planNav-inner', 'plan-nav-'+plans.length]">
            <div v-for="(item, index) in plans" :key="index" :class="{ curr: item['curr'] }" @click="changeNav(index)">
                <div v-if="item['curr']" class="line"></div>
                <div v-if="item['curr']">
                    <div class="rmbStr">&yen;<span>{{item['actualPrice']}}</span>起</div>
                    <div class="name">{{item['des']}}</div>
                </div>
                <div class="rmbStr" v-if="!item['curr']">&yen;<span>{{item['actualPrice']}}</span>起</div>
                <div class="name" v-if="!item['curr']">{{item['des']}}</div>
            </div>
        </div>
    </div>
    <p class="rowLine"></p>
    <div class="rights-part" v-if="showRights"  v-for="(item, index) in showRights" :key="index" @click="showMoreDuty(index)">
        <div v-if="index < 5 && !isShowMoreRights">
            <div class="right-row">
                <div class="right-row-warp">
                <div class="right-name">{{item['safeguardDuty']}}</div>
                <div class="right-val">{{item['safeguardMoney']}}</div>
                </div>
                <div v-if="item['safeguardDutyExplain']" class="arrow arrow-hide" :class="{ 'arrow-hide': !item['isShowMore'], 'arrow-show': item['isShowMore'] }"></div>
            </div>
            <div v-if="item['isShowMore']">
                <div class="duty-explain">{{item['safeguardDutyExplain']}}</div>
                <div v-if="(showRights.length > 5 && index === 4) || (showRights.length <= 5 && index === showRights.length - 1)" class="duty-explain-padding"></div>
            </div>
            <div v-else><div v-if="index !== 4" class="rowLine-dash"></div></div>
        </div>
        <div v-if="isShowMoreRights">
            <div class="right-row">
                <div class="right-row-warp">
                <div class="right-name">{{item['safeguardDuty']}}</div>
                <div class="right-val">{{item['safeguardMoney']}}</div>
                </div>
                <div v-if="item['safeguardDutyExplain']" class="arrow arrow-hide" :class="{ 'arrow-hide': !item['isShowMore'], 'arrow-show': item['isShowMore'] }"></div>
            </div>
            <div v-if="item['isShowMore']">
                <div class="duty-explain">{{item['safeguardDutyExplain']}}</div>
                <div v-if="index === showRights.length - 1" class="duty-explain-padding"></div>
            </div>
            <div v-else><div v-if="index !== showRights.length - 1" class="rowLine-dash"></div></div>
        </div>
    </div>
    <div class="rowLine" v-if="showRights"></div>
    <!-- 查看更多按钮是否显示 start-->
    <div v-if="showRights && showRights.length > 5">
        <div class="show-more-rights" @click="showMoreRights" v-if="isShowMoreRights">收起<span class="arrow arrow-show"></span></div>
        <div class="show-more-rights" @click="showMoreRights" v-else>查看更多<span class="arrow arrow-hide"></span></div>
        <div class="rowLine"></div>
    </div>
    <!-- 查看更多按钮是否显示 end-->

    <!-- 计价因子 start -->
    <div class="factors">
        <div class="rowLine"></div>
        <div class="picker-line">
            <div class="picker-row">请仔细阅读 <span class="link" @click="linkHandler('clause')">保险条款</span>、<span class="link" @click="linkHandler('instruction')">保险须知</span>、<span class="link" @click="linkHandler('claims')">理赔流程</span>。</div>
            <div class="rowLine"></div>
        </div>
        <div v-if="factorList" class="picker-line" v-for="(item, index) in factorList" :key="index">
            <div class="picker-row" @click="item['isShowPicker'] = true" v-if="item['isShowArrow']">
                <div class="picker-name">{{item['factorName']}}</div>
                <div class="picker-val">{{item['factorDesc']}}</div>
                <div class="arrow arrow-hide"></div>
            </div>
            <div class="picker-row" v-else>
                <div class="picker-name">{{item['factorName']}}</div>
                <div class="picker-val">{{item['factorDesc']}}</div>
            </div>
            <div class="rowLine"></div>
            <popup-picker
                :open="item['isShowPicker']"
                :pickers="item['pickers']"
                :pickerIndex="index"
                @on-close="item['isShowPicker'] = false"
                @on-change="confirmHandler"
            />
        </div>
    </div>
    <!-- 计价因子 end -->

    <div class="product-price">
        <div>保费：</div>
        <div class="price">&yen;<em>{{totalFee}}</em></div>
    </div>
</div>
</template>

<style lang="less">
@import './style.less';
</style>

<script>
import { PopupPicker, Actionsheet, ActionsheetItem } from "@/components";
import { clone, getPrice, setSessionStore, getSessionStore } from "@/utils";
import { wxsharecnt } from '@/utils/sharecnt';
import * as product from "@/services/product";

export default {
    components: {
        PopupPicker,
        Actionsheet,
        ActionsheetItem
    },
    data() {
        return {
            data: null,
            isShowPopup: false,
            redPopupData:null,
            planSelectIndex: 0,
            plans: null,
            factorList: null,
            priceModes: null,
            priceModeList: null,
            cacheFactor: null,
            factorExact: null,
            birthdayList: null,
            showRights: null,
            isShowMoreRights: false, // 是否展示更多保障权益
            totalFee: 0, // 总价
            actualPayFee: 0, // 折后价
        }
    },
    beforeMount() {
        document.title = '产品详情'
    },
    mounted() {
        this.getData();
    },
    methods: {
        // 获取数据
        async getData() {
            const { id = "" } = this.$route.params;
            const res = await product.cdetail({ productCode: id });
            const { code, data } = res;
            if (code === "0000") {
                const {
                    insuranceClause = null,
                    insuranceGuide = null,
                    reserveNotice = null,
                    productPic,
                    productName,
                    salePoints
                } = data;
                // alert(`https:${productPic}  ${productName}  ${salePoints}`)
                wxsharecnt({
                    shareImg: `https:${productPic}`,
                    shareTitle:`【爱购保】${productName}`,
                    shareUrl : '',
                    shareDesc : salePoints
                });
                this.data = data;
                setSessionStore("explainData", {
                    insuranceClause,
                    insuranceGuide,
                    reserveNotice
                });
                this.getFactorsData(data, '');
            }
        },

        // 初始化选择
        initSelect(isInit) {
            const factorList = this.factorList || [];
            const cacheFactor = this.cacheFactor || [];
            if (isInit) {
                let _cacheFactor = [];
                for (let i = 0; i < factorList.length; i++) {
                _cacheFactor.push("");
                }
                this.cacheFactor = _cacheFactor;
                this.updateChoose(0, 0);
            } else {
                // 更换保障计划的时候
                let initIndex = 0;
                if (!!cacheFactor[0]) {
                // 假如缓存数组里的第一个有值
                factorList[0].showArr.map((item, index) => {
                    if (item.enumCode === cacheFactor[0]) {
                    initIndex = index;
                    }
                });
                }
                this.updateChoose(0, initIndex);
            }
        },

        // 价格模型进行处理操作
        initPriceMode(priceModes) {
            let priceModeList = [];

            for (let item in priceModes) {
                priceModeList.push({
                name: item,
                cost: priceModes[item]
                });
            }

            return priceModeList;
        },

        // 计价因子数组
        initFactorList(list) {
            const _this = this;
            let factorList = [];

            list.map(item => {
                let activeIndex = 0;
                let currentFactorIndex = factorList.length; // 第几个计价因子
                let factorArr = item["enums"];
                let factorName = item["factorName"].trim(); // item有可能带有空格，所以必须放到取值的后面，取到了arr后将空格去掉
                let isShowArrow = true;
                let isShowPicker = false;
                let factorDesc = factorArr[activeIndex].enumName;

                if (factorArr.length === 1) {
                isShowArrow = false;
                }

                factorArr.map((item, index) => {
                    item["value"] = index.toString();
                    item["label"] = item["enumName"];
                    return item;
                });
                let pickers = [{ value: "0", options: factorArr }];

                let factorItem = {
                    factorName, // 计价因子的名字
                    factorIndex: currentFactorIndex, // 第几个计价因子
                    factorType: item["factorCode"],
                    factorArr, // 计价因子的所有数组
                    showArr: factorArr, // 计价因子展示的数组
                    pickers,
                    activeIndex, // 选中的index
                    factorDesc, // 在页面展示的计价因子选中的说明
                    isShowArrow, // 是否显示箭头
                    isShowPicker // 是否显示弹框
                };

                factorList.push(factorItem);
            });

            return factorList;
        },

        // 计价因子
        getFactorsData(DATA, planCode) {
            const { fixedBeginTimeLimit, beginInsuranceTime, endInsuranceTime, plans, maType, rebateRatio, travelAllowanceRatio } = DATA;

            let planData = [], showRights = [], activeIndex = 0;
            plans.map((item, index) => {
                if(planCode && item['safeguardPlanCode'] == planCode){
                    activeIndex = index;
                }
                let price = item["defaultMinPrice"];
                price = Number(price);
                planData.push({
                    des: item["safeguardPlanName"],
                    price,
                    actualPrice: price,
                    limitAge: item["limitAge"],
                    curr: index === 0 ? true : false,
                    rights: item["rights"]
                });
            });
            this.plans = planData;

            this.changeNav(activeIndex, false);
            // this.getRightData(planData[0]['rights']);
        },

        // 改变计划nav
        changeNav(index, isInit = true) {
            this.plans.map((item, i) => {
                item["curr"] = i === index ? true : false;
                return item;
            });
            this.planSelectIndex = index;
            const { plans } = this.data;
            const { factors, rights } = plans[index];
            // 改变保障计划
            this.getRightData(rights);

            // 初始化价格模型
            let priceModeList = this.initPriceMode(plans[index].priceModes);
            this.priceModeList = priceModeList;
            this.priceModes = plans[index].priceModes;

            // 初始化计价因子数组
            let factorList = this.initFactorList(factors);
            this.factorList = factorList;

            this.initSelect(isInit);
        },

        // 计划详情的数据
        getRightData(rights) {
            let showRights = [];
            rights = rights || [];
            rights.map((item, index) => {
                const { safeguardRightDetailVos: children } = item;
                children.map((_item, _index) => {
                let { safeguardMoney } = _item;
                let isShowMore = false;
                let isShowYen = false;
                if (this.isShowStr(safeguardMoney)) {
                    isShowYen = true;
                }
                Object.assign(_item, { isShowMore, isShowYen });
                showRights.push(_item);
                });
            });
            this.showRights = [].concat([...showRights]);
        },
        isShowStr(val) {
            if (!val) return;
            if (val.toString().indexOf(",") != -1) {
                val = val.replace(/,/g, "");
            }
            if (!isNaN(val)) {
                return true;
            } else {
                return false;
            }
        },

        // 展示保障权益隐藏的文案
        showMoreDuty(index) {
            let rights = this.showRights || [];
            if (!rights[index]["safeguardDutyExplain"]) return;
            this.showRights = [];
            rights.map((item, i) => {
                item["isShowMore"] = i === index ? !item["isShowMore"] : false;
                return item;
            });
            this.showRights = rights;
        },

        // 展示更多保障权益
        showMoreRights() {
            this.isShowMoreRights = !this.isShowMoreRights;
        },

        // 资料
        linkHandler(type) {
            if (type === "instruction") {
                location.href = "/product/instruction";
            } else if (type === "clause") {
                const explainData = getSessionStore('explainData');
                const { insuranceClause } = explainData;
                if(insuranceClause && insuranceClause.length == 1){
                    location.href = insuranceClause[0].clauseFileAddress;
                }else{
                    location.href = "/product/clause";       
                }
        
            } else if (type === "claims") {
                location.href = "/product/claims";
            }
        },

        // picker 确定
        confirmHandler(values, index, type) {
            const { value = "0" } = values && values[0];
            let factorList = this.factorList;
            const { pickers, factorArr } = factorList[index];
            pickers[0]["value"] = value;
            factorList[index].factorDesc = factorArr[value].enumName;
            factorList[index].isShowPicker = false;
            factorList[index].activeIndex = parseInt(value);
            this.updateChoose(index, parseInt(value));
        },

        // 更新选择
        updateChoose(factorIndex, itemIndex) {
            const _this = this;
            let factorList = this.factorList || [];
            let priceModeList = this.priceModeList || [];
            let cacheFactor = this.cacheFactor || [];
            let factorExact = this.factorExact || [];

            // factorList[factorIndex].activeIndex = itemIndex;

            if (factorIndex === 0) {
                // 选择的是第一个计价因子
                if (factorList.length === 1) {
                    this.updateFinish();
                } else {
                    let value = factorList[factorIndex].showArr[itemIndex].enumCode;

                    //过滤出来的所有可用的计价因子
                    let filterPirces = priceModeList.filter(elem => {
                        return elem.name.indexOf(value) != -1;
                    });
                    let temps = [];
                    filterPirces.map(elem => {
                        temps.push(elem.name.split("|")[factorIndex + 1]);
                    });
                    // factorList[factorIndex + 1].filterShowArr(temps);

                    //下一个计价因子选中的index，默认为0，
                    //如果缓存数组中cacheFactor中有选择的，就选择缓存的code
                    let nextActiveIndex = 0;
                    factorList[factorIndex + 1].showArr.map((elem, index) => {
                        if (elem.enumCode == cacheFactor[factorIndex + 1]) {
                        nextActiveIndex = index;
                        }
                    });

                    this.updateChoose(factorIndex + 1, nextActiveIndex);
                }
            } else if (factorIndex === factorList.length - 1) {
                // 选择的是最后一个计价因子
                this.updateFinish();
            } else {
                //选择的是中间的计价因子

                //先找到该计价因子之前所有的计价因子的code
                let tempPrice = [];
                for (let i = 0; i <= factorIndex; i++) {
                    let beforeFactor = factorList[i];
                    tempPrice.push(
                        beforeFactor.showArr[beforeFactor.activeIndex].enumCode
                    );
                }

                //根据之前找到的code拼接，过滤出来的所有可用的计价因子
                let filterPirces = priceModeList.filter(elem => {
                    return elem.name.indexOf(tempPrice.join("|")) != -1;
                });

                //根据过滤出来的数组找到下一个计价因子所有需要展示的字段
                let tempArrs = [];
                filterPirces.map(elem => {
                    tempArrs.push(elem.name.split("|")[factorIndex + 1]);
                });
                // factorList[factorIndex + 1].filterShowArr(tempArrs);

                //下一个计价因子选中的index，默认为0，
                //如果缓存数组中cacheFactor中有选择的，就选择缓存的code
                let nextActiveIndex = 0;
                factorList[factorIndex + 1].showArr.map((elem, index) => {
                    if (elem.enumCode == cacheFactor[factorIndex + 1]) {
                        nextActiveIndex = index;
                    }
                });

                this.updateChoose(factorIndex + 1, nextActiveIndex);
            }

            this.factorList = factorList;
            this.priceModeList = priceModeList;
            this.cacheFactor = cacheFactor;
        },

        // 计价因子选择完
        updateFinish() {
            const _this = this;
            let factorList = this.factorList || [];
            let priceModeList = this.priceModeList || [];
            let cacheFactor = this.cacheFactor || [];
            let priceModes = this.priceModes || [];
            let factorExact = this.factorExact || {};

            let currentPriceMode = [],
                priceFactors = [],
                safeguardLimit = "",
                paymentTime = "",
                maxPeriod = "",
                maxPeriodUnit = "";

            let minAge = "",
                maxAge = "",
                minUnit = "",
                maxUnit = "";

            factorList.map(item => {
                let currentItem = item.showArr[item.activeIndex];
                currentPriceMode.push(currentItem.enumCode);
                priceFactors.push(currentItem);
                currentItem.factorCode = item.factorType;
                if (!!currentItem.safeguardLimit) {
                    safeguardLimit = currentItem.safeguardLimit;
                }
                if (!!currentItem.paymentTime) {
                    paymentTime = currentItem.paymentTime;
                }

                if (item.factorType == "applyPeriod") {
                    if (currentItem.enumTemplateType == 1) {
                        maxPeriod = currentItem.fixedValue;
                        maxPeriodUnit = currentItem.fixedValueUnit;
                    } else if (currentItem.enumTemplateType == 2) {
                        maxPeriod = currentItem.upperLimitValue;
                        maxPeriodUnit = currentItem.upperLimitValueUnit;
                    }
                }

                if (item.factorType == "insuredBirthday") {
                this.birthdayList = item.showArr;
                const list = item.showArr;
                list.map((_item, _index) => {
                    if (_index === 0) {
                        if (_item.enumTemplateType == 1) {
                            minAge = _item.fixedValue;
                            minUnit = _item.fixedValueUnit;
                        } else {
                            minAge = _item.lowerLimitValue;
                            minUnit = _item.lowerLimitValueUnit;
                        }
                    }
                    if (_index === list.length - 1) {
                        if (_item.enumTemplateType == 1) {
                            maxAge = _item.fixedValue;
                            maxUnit = _item.fixedValueUnit;
                        } else {
                            maxAge = _item.upperLimitValue;
                            maxUnit = _item.upperLimitValueUnit;
                        }
                    }
                });
                }
            });

            let priceEnumIds = currentPriceMode.join("|");
            let currentPrice = priceModes[priceEnumIds];
            factorExact = {
                priceFactors,
                minAge,
                maxAge,
                minAgeUnit: minUnit,
                maxAgeUnit: maxUnit,
                safeguardLimit,
                paymentTime,
                maxPeriod,
                maxPeriodUnit
            };
            this.factorExact = factorExact;

            const { reduceRate } = this.data;
            let discountRate = (100 - parseInt(reduceRate)) / 100;
            this.priceEnumIds = priceEnumIds;
            this.totalFee = getPrice(currentPrice);
            this.actualPayFee = getPrice(currentPrice * discountRate);
        },
    }
}
</script>
