<template>
<div class="content" v-if="data">
    <div class="top">
        <div class="tit">{{init.title}}</div>
        <div class="txt">{{init.dec}}</div>
    </div>
    <dl v-if="data.base">
        <dt class="tit">
            <div>基本信息</div>
        </dt>
        <dd>
            <div class="list">
                <div class="name">保障期限：</div>
                <div>{{data.base.startTimeStr}}</div>
            </div>
            <div class="list" v-if="data.base.tourGroup">
                <div class="name">旅行团号：</div>
                <div>{{data.base.tourGroup}}</div>
            </div>
            <div class="list" v-if="data.base.flight">
                <div class="name">航班号：</div>
                <div>{{data.base.flight}}</div>
            </div>
            <div class="list" v-if="data.base.startAirport">
                <div class="name">出发机场：</div>
                <div>{{data.base.startAirportName}}</div>
            </div>
            <div class="list" v-if="data.base.arriveAirport">
                <div class="name">到达机场：</div>
                <div>{{data.base.arriveAirportName}}</div>
            </div>
            <div class="list" v-if="data.base.destinationView">
                <div class="name">出行目的地：</div>
                <div>{{data.base.destinationView}}</div>
            </div>
            <div class="list">
                <div class="name">投保份数：</div>
                <div>{{data.base.qty}}</div>
            </div>
            <div class="list">
                <div class="name">总保费：</div>
                <div>&yen;{{data.base.totalFee}}</div>
            </div>
            <div class="list" v-if="data.base.discountPrice">
                <div class="name">优惠金额：</div>
                <div>-&yen;{{data.base.discountPrice}}</div>
            </div>
        </dd>
    </dl>
    <template v-if="data.holder">
        <dl v-if="data.holder.type === 'enterprise'">
            <dt class="tit yellow">
                <div>企业投保人信息</div>
            </dt>
            <dd v-if="data.holder.enterprise">
                <div class="list">
                    <div class="name">企业投保人姓名：</div>
                    <div>{{data.holder.enterprise.name}}</div>
                </div>
                <div class="list">
                    <div class="name">企业证件类型：</div>
                    <div>{{data.holder.enterprise.cardTypeDec}}</div>
                </div>
                <div class="list">
                    <div class="name">企业证件号：</div>
                    <div>{{data.holder.enterprise.cardNo}}</div>
                </div>
                <div class="list">
                    <div class="name">企业手机号码：</div>
                    <div>{{data.holder.enterprise.phone}}</div>
                </div>
                <div class="list">
                    <div class="name">企业电子邮箱：</div>
                    <div>{{data.holder.enterprise.email}}</div>
                </div>
            </dd>
        </dl>
        <dl v-else>
            <dt class="tit yellow">
                <div>投保人信息</div>
            </dt>
            <dd v-if="data.holder.person">
                <div class="list">
                    <div class="name">投保人姓名：</div>
                    <div>{{data.holder.person.name}}</div>
                </div>
                <div class="list" v-if="data.holder.person.cardTypeDec">
                    <div class="name">证件类型：</div>
                    <div>{{data.holder.person.cardTypeDec}}</div>
                </div>
                <div class="list">
                    <div class="name">证件号：</div>
                    <div>{{data.holder.person.cardNo}}</div>
                </div>
                <template v-if="data.holder.person.cardTypeDec !== '身份证'">
                    <div class="list">
                        <div class="name">出生日期：</div>
                        <div>{{data.holder.person.birthday}}</div>
                    </div>
                    <div class="list" v-if="data.holder.person.genderDec">
                        <div class="name">性别：</div>
                        <div>{{data.holder.person.genderDec}}</div>
                    </div>
                </template>
                <div class="list">
                    <div class="name">手机号码：</div>
                    <div>{{data.holder.person.phone}}</div>
                </div>
                <div class="list" v-if="data.holder.person.email">
                    <div class="name">电子邮箱：</div>
                    <div>{{data.holder.person.email}}</div>
                </div>
            </dd>
        </dl>
    </template>
    <dl v-if="data.insurants" v-for="(item, index) in data.insurants" :key="index">
        <dt class="tit">
            <div>被保人信息{{data.insurants.length > 1 ? index + 1 : ''}}</div>
        </dt>
        <dd>
            <div class="list" v-if="item['relationDec']">
                <div class="name">您是被保人的谁：</div>
                <div>{{item['relationDec']}}</div>
            </div>
            <div class="list">
                <div class="name">被保人姓名：</div>
                <div>{{item['name']}}</div>
            </div>
            <div class="list" v-if="item['cardTypeDec']">
                <div class="name">证件类型：</div>
                <div>{{item['cardTypeDec']}}</div>
            </div>
            <div class="list">
                <div class="name">证件号：</div>
                <div>{{item['cardNo']}}</div>
            </div>
            <template v-if="item['cardTypeDec'] !== '身份证'">
                <div class="list">
                    <div class="name">出生日期：</div>
                    <div>{{item['birthday']}}</div>
                </div>
                <div class="list" v-if="item['genderDec']">
                    <div class="name">性别：</div>
                    <div>{{item['genderDec']}}</div>
                </div>
            </template>
            <div class="list">
                <div class="name">保费：</div>
                <div>&yen;{{item['price']}}</div>
            </div>
        </dd>
    </dl>
    <dl>
        <dt class="tit yellow">
            <div>受益人信息</div>
        </dt>
        <dd>
            <div class="list">
                <div class="name">受益人类型</div>
                <div>法定受益人</div>
            </div>
        </dd>
    </dl>
    <!-- 客户告知书 -->
    <order-agreement :isAgreement="true"></order-agreement>
</div>
</template>

<script>
import OrderAgreement from './order-agreement'

export default {
    components: {
        OrderAgreement
    },
    props: {
        init: {
            type: Object,
            default: null
        },
        data: {
            type: Object,
            default: null
        }
    }
}
</script>


