<template>
<div class="yo-scroll" :class="{ 'down': state === 0, 'up': state === 1, 'refresh': state === 2, 'touch': touching }" @touchstart="touchStart($event)" @touchmove="touchMove($event)" @touchend="touchEnd($event)" @scroll="(onInfinite || infiniteLoading) ? onScroll($event) : undefined">
    <section class="inner" :style="{ transform: 'translate3d(0, ' + top + 'px, 0)' }">
        <header class="pull-refresh">
            <slot name="pull-refresh">
                <span class="down-tip">下拉更新</span>
                <span class="up-tip">松开更新</span>
                <span class="refresh-tip"><i></i><em>更新中…</em></span>
            </slot>
        </header>
        <slot></slot>
        <footer class="load-more" v-if="enableInfinite">
            <slot name="load-more"><span>{{loadingText}}</span></slot>
        </footer>
    </section>
</div>
</template>

<script>
export default {
    props: {
        offset: {
            type: Number,
            default: 40
        },
        loadingText: {
            type: String,
            default: '加载中...'
        },
        enableInfinite: {
            type: Boolean,
            default: true
        },
        enableRefresh: {
            type: Boolean,
            default: true
        },
        onRefresh: {
            type: Function,
            default: undefined,
            required: false
        },
        onInfinite: {
            type: Function,
            default: undefined,
            required: false
        },
        tabIndex: String
    },
    data() {
        return {
            top: 0,
            state: 0,
            startY: 0,
            touching: false,
            infiniteLoading: false
        }
    },
    methods: {
        touchStart(e) {
            this.startY = e.targetTouches[0].pageY
            this.startScroll = this.$el.scrollTop || 0
            this.touching = true
        },
        touchMove(e) {
            if (!this.enableRefresh || this.$el.scrollTop > 0 || !this.touching) {
                return
            }
            let diff = e.targetTouches[0].pageY - this.startY - this.startScroll
            if (diff > 0) e.preventDefault()
            this.top = Math.pow(diff, 0.8) + (this.state === 2 ? this.offset : 0)

            if (this.state === 2) { // in refreshing
                return
            }
            if (this.top >= this.offset) {
                this.state = 1
            } else {
                this.state = 0
            }
        },
        touchEnd(e) {
            if (!this.enableRefresh) return
            this.touching = false
            if (this.state === 2) { // in refreshing
                this.state = 2
                this.top = this.offset
                return
            }
            if (this.top >= this.offset) { // do refresh
                this.refresh()
            } else { // cancel refresh
                this.state = 0
                this.top = 0
            }
        },
        refresh() {
            this.state = 2
            this.top = this.offset
            this.onRefresh(this.refreshDone)
        },
        refreshDone() {
            this.state = 0
            this.top = 0
            this.infiniteLoading = false
        },
        infinite() {
            this.infiniteLoading = true
            this.onInfinite(this.infiniteDone)
        },
        infiniteDone() {
            this.infiniteLoading = false
        },
        onScroll(e) {
            if(!this.enableInfinite || this.infiniteLoading){
                return
            }

            let outerHeight = this.$el.clientHeight
            let innerHeight = this.$el.querySelector('.inner').clientHeight
            let scrollTop = this.$el.scrollTop
            let ptrHeight = this.onRefresh ? this.$el.querySelector('.pull-refresh').clientHeight : 0
            let infiniteHeight = this.$el.querySelector('.load-more').clientHeight
            let bottom = innerHeight - outerHeight - scrollTop - ptrHeight
            if (bottom < infiniteHeight) this.infinite()
        }
    },
    watch: {
        tabIndex() {
            this.onRefresh(this.refreshDone)
        }
    }
}
</script>

<style lang="less">
@import './style.less';
</style>