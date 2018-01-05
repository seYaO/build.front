<template>
<div class="explain">
    <ul v-if="list" >
        <li v-for="(item, index) in list" :key="index">{{item}}</li>
    </ul>
</div>
</template>

<style lang="less" scoped>
html,
body {
    height: 100%;
}
.explain{
    background: #fff;
    height: 100%;
    padding: 30px;
    font-size: 28px;
    color: #666;
    li{
        margin-bottom: 26px;
        display: block;
        word-wrap: break-word;
    }
}
</style>

<script>
import { getSessionStore } from '@/utils'

export default {
    data() {
        return {
            list: null
        }
    },
    beforeMount() {
        document.title = '保险须知';
    },
    mounted() {
        const explainData = getSessionStore('explainData');
        const { reserveNotice } = explainData;
        this.list = reserveNotice;
    }
}
</script>
