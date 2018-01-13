<template>
<div :class="classes">
    <ul :class="cssPrefix + 'indexlist-content'" ref="content" :style="{ 'height': currentHeight + 'px', 'margin-right': '0px'}">
        <slot></slot>
    </ul>
    <div :class="cssPrefix + 'indexlist-nav'" @touchstart="handleTouchStart" ref="nav" :style="{ 'height': currentHeight - buttonHeight + 'px'}">
        <ul :class="cssPrefix + 'indexlist-navlist'">
            <li :class="cssPrefix + 'indexlist-navitem'" v-for="(item, index) in sections" :key="index">{{item.index}}</li>
        </ul>
    </div>
    <div :class="cssPrefix + 'indexlist-indicator'" v-if="showIndicator" v-show="moving">{{currentIndicator}}</div>
</div>
</template>

<style lang="less">
// @import './style.less';
</style>

<style lang="scss">
@import './style.scss';
</style>


<script>
import { cssPrefix } from '@/utils/variable'

export default {
    components: {},
    props: {
        height: {
            type: Number,
            default: 0
        },
        showIndicator: {
            type: Boolean,
            default: true
        },
        buttonHeight: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            cssPrefix,
            sections: [],
            navWidth: 0,
            indicatorTime: null,
            moving: false,
            firstSection: null,
            currentIndicator: '',
            currentHeight: this.height,
            navOffsetX: 0
        }
    },
    computed: {
        classes() {
            return [cssPrefix + 'indexlist-wrapper']
        }
    },
    mounted() {
        if (!this.currentHeight) {
            this.currentHeight = document.documentElement.clientHeight - this.$refs.content.getBoundingClientRect().top;
        }
        this.init();
    },
    methods: {
        init() {
            this.$nextTick(() => {
                this.navWidth = this.$refs.nav.clientWidth;
            });
            let listItems = this.$refs.content.getElementsByTagName('li');
            if (listItems.length > 0) {
                this.firstSection = listItems[0];
            }
        },
        handleTouchStart(e) {
            if (e.target.tagName !== 'LI') {
                return;
            }
            this.navOffsetX = e.changedTouches[0].clientX;
            this.scrollList(e.changedTouches[0].clientY);
            if (this.indicatorTime) {
                clearTimeout(this.indicatorTime);
            }
            this.moving = true;
            window.addEventListener('touchmove', this.handleTouchMove);
            window.addEventListener('touchend', this.handleTouchEnd);
        },
        handleTouchMove(e) {
            e.preventDefault();
            this.scrollList(e.changedTouches[0].clientY);
        },
        handleTouchEnd() {
            this.indicatorTime = setTimeout(() => {
                this.moving = false;
                this.currentIndicator = '';
            }, 500);
            window.removeEventListener('touchmove', this.handleTouchMove);
            window.removeEventListener('touchend', this.handleTouchEnd);
        },
        scrollList(y) {
            let currentItem = document.elementFromPoint(this.navOffsetX, y);
            if (!currentItem || !currentItem.classList.contains(`${cssPrefix}indexlist-navitem`)) {
                return;
            }
            this.currentIndicator = currentItem.innerText;
            let targets = this.sections.filter(section => section.index === currentItem.innerText);
            let targetDOM;
            if (targets.length > 0) {
                targetDOM = targets[0].$el;
                this.$refs.content.scrollTop = targetDOM.getBoundingClientRect().top - this.firstSection.getBoundingClientRect().top;
            }
        }
    },
    watch: {
        sections() {
            this.init();
        },
        height(val) {
            if (val) {
                this.currentHeight = val;
            }
        }
    }
}
</script>
