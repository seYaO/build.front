<template>
<div :class="classes">
    <transition name="confirm-fade">
        <overlay v-if="open"></overlay>
    </transition>
    <div :class="[cssPrefix + 'confirm-wrapper']">
        <transition name="confirm-scale">
            <div :class="[cssPrefix + 'confirm-inner']" v-if="open">
                <div :class="[cssPrefix + 'confirm-body']">
                    <slot></slot>
                </div>
                <divider></divider>
                <div :class="[cssPrefix + 'confirm-footer','flexbox']" onselectstart="return false;">
                    <button class="flexbox-item" v-if="cancel" type="button" @click="cancelHandler">{{cancelText}}</button>
                    <button class="flexbox-item" type="button" @click="confirmHandler">{{confirmText}}</button>
                </div>
            </div>
        </transition>
    </div>
</div>
</template>

<style lang="less">
@import './style.less';
</style>

<script>
import { cssPrefix } from '@/utils/variable'
import { historyPush } from '@/utils/mixins'
import Overlay from '../overlay'
import Divider from '../divider'
export default {
    mixins: [historyPush],
    components: {
        Overlay,
        Divider
    },
    props: {
        open: {
            type: Boolean,
            default: false
        },
        cancel: {
            type: Boolean,
            default: true
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        confirmText: {
            type: String,
            default: '确定'
        }
    },
    data() {
        return {
            cssPrefix
        }
    },
    computed: {
        classes () {
            return [cssPrefix + 'confirm']
        }
    },
    mounted() {
        if (this.open) {
            requestAnimationFrame(() => {
                this.pushState()
                this.$el.style.display = 'table'
            })
        }
    },
    methods: {
        cancelHandler () {
            this.$emit('on-close')
        },
        confirmHandler () {
            this.open && this.$emit('on-confirm')
        }
    },
    watch: {
        open (value) {
            if (value) {
                requestAnimationFrame(() => {
                    this.pushState()
                    this.$el.style.display = 'table'
                    this.$emit('on-open')
                })
            } else {
                setTimeout(() => {
                    requestAnimationFrame(() => {
                        this.goBack()
                        this.$el.style.display = 'none'
                    })
                }, 300)
            }
        }
    }
}
</script>
