<template>
<!-- 客户告知书 -->
<div class="agreement">
    <div class="check"><i :class="{ curr: isAgreement }" @click="changeAgreement"></i></div>
    <div class="info">已阅读并了解<span class="link" @click="linkHandler('clause')">保险条款</span>、<span class="link" @click="linkHandler('instruction')">保险须知</span>、<span class="link" @click="linkHandler('inform')">客户告知书</span>。<span class="gra">此产品销售服务方为：天圆地方（北京）保险代理有限公司</span></div>
</div>
</template>

<script>
import { getSessionStore } from '@/utils'

export default {
    props: {
        isAgreement: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        // 是否同意
        changeAgreement() {
            this.$emit('on-agreement')
        },

        // 资料
        linkHandler(type) {
            if(type === 'instruction'){
                location.href = '/product/instruction';
            }else if(type === 'clause'){
                const explainData = getSessionStore('explainData');
                const { insuranceClause } = explainData;
                if(insuranceClause && insuranceClause.length == 1){
                location.href = insuranceClause[0].clauseFileAddress;
                }else{
                location.href = "/product/clause";       
                }
            }else if(type === 'inform'){
                location.href = '/product/inform';
            }
        },
    }
}
</script>

