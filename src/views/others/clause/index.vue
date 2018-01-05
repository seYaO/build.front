<template>
<div class="explain">
    <cell v-for="(item, index) in list" :key="index" :title="item" @click="clickHandler">
        <div class="explainItem" slot="title">{{item['clauseName']}}</div>
    </cell>
</div>
</template>

<style lang="less">
.explain{
    height:100%;
    font-size: 30px;
    color: #333;
    background-color: #fff;
    .v-cell{
        margin-left: 0;
        padding: 20px 30px;
    }
    .v-cell-access .v-cell-ft:after{
        width: 20px;
        height: 20px;
        border-top: 1PX solid #999;
        border-right: 1PX solid #999;
    }
    .explainItem{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;

    }
}

</style>

<script>
import { Cell } from '@/components'
import { getSessionStore } from '@/utils'

export default {
    components: {
        Cell
    },
    data() {
        return {
            list: null
        }
    },
    beforeMount() {
        document.title = '保险条款';
    },
    mounted() {
        const explainData = getSessionStore('explainData');
        const { insuranceClause } = explainData;
        this.list = insuranceClause;
    },
    methods: {
        clickHandler(e, title, type) {
            const { clauseFileAddress = '' } = title;
            location.href = clauseFileAddress;
        }
    }
}
</script>


