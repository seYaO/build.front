<template>
<div v-if="data" class="explain">
    <ul>
        <li>
            <p>1</p>
            <div>
                <span>报案：</span>拨打保险公司报案及理赔电话<br />{{data.insuranceCompany}}：
                <small><a  :href="'tel:'+data.phone">{{data.phone}}</a></small>
            </div>
        </li>
        <li>
            <p>2</p>
            <div>
                <span>理赔申请：</span>准备好相关的证明和票据
            </div>
        </li>
        <li>
            <p>3</p>
            <div>
                <span>理赔资料准备：</span><a v-if="data.claimForm" :href="data.claimForm">索赔申请表</a> &nbsp; <a v-if="data.claimList" :href="data.claimList">索赔材料清单</a> 
            </div>
        </li>
        <li>
            <p>4</p>
            <div>
                <span>保险公司审核：</span>保险公司受理理赔申请，进行审核及调查
            </div>
        </li>
        <li>
            <p>5</p>
            <div>
                <span>打款结案：</span>理赔成功
            </div>
        </li>
    </ul>
</div>
</template>

<style lang="less" scoped>
@import './style.less';
</style>

<script>
import { getSessionStore } from '@/utils'

export default {
    data() {
        return {
            data: null
        }
    },
    beforeMount() {
        document.title = '理赔流程';
    },
    mounted() {
        const explainData = getSessionStore('explainData');
        const { insuranceGuide } = explainData;
        this.data = insuranceGuide;
    }
}
</script>



