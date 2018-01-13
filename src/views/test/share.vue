<template>
<div>
    <cell @click="share"><div slot="title">点击分享</div></cell>
</div>
</template>

<script>
import { Cell, XButton, XInput, Spinner, XSwitch, NativeShare } from '@/components'
import { isWeChart } from '@/utils/validate'
import * as other from '@/services/other'

export default {
    components: {
        Cell,
        XButton,
        XInput,
        Spinner,
        XSwitch
    },
    data() {
        return {
            checked: false
        }
    },
    mounted() {
        this.init();
        
    },
    methods: {
        async init() {
            this.nativeShare = new NativeShare();
            // if(isWeChart){
                const res = await other.wechatConfig();
                const { Status, Data } = res;
                if(Status == 'true'){
                    this.nativeShare.setConfig(Data);
                }
            // }
            
            const shareData = {
                title: 'NativeShare',
                desc: 'NativeShare是一个整合了各大移动端浏览器调用原生分享的插件',
                // 如果是微信该link的域名必须要在微信后台配置的安全域名之内的。
                link: 'https://github.com/fa-ge/NativeShare',
                icon: 'https://pic3.zhimg.com/v2-080267af84aa0e97c66d5f12e311c3d6_xl.jpg',
                // 不要过于依赖以下两个回调，很多浏览器是不支持的
                success: function () {
                    alert('success')
                },
                fail: function () {
                    alert('fail')
                }
            }
            this.nativeShare.setShareData(shareData);
        },
        changeHandler(value) {
            this.checked = value
        },
        share() {
            try {
                this.nativeShare.call();
            } catch (err) {
                console.log('不支持')
            }
        }
    }
}
</script>

