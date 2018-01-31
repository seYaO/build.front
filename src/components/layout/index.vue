<template>
<section :class="cssPrefix + 'flexview'">
    <slot name="navbar" v-if="showNavbar">
        <nav-bar :title="title" v-if="!!title">
            <router-link :to="link || '/'" slot="left">
                <nav-bar-back-icon></nav-bar-back-icon>
            </router-link>
        </nav-bar>
    </slot>
    <slot name="top"></slot>
    <section :class="cssPrefix + 'scrollview'" ref="scrollView" id="scrollView">
        <slot></slot>
    </section>
    <slot name="bottom"></slot>
    <slot name="tabbar"></slot>
</section>
</template>

<style lang="scss">
@import './style.scss';
</style>

<script>
import { cssPrefix } from '@/utils/assist'
import { NavBar, NavBarBackIcon, NavBarNextIcon } from '../navbar'

export default {
    components: {
        NavBar,
        NavBarBackIcon,
        NavBarNextIcon
    },
    props: {
        link: String,
        title: String,
        showNavbar: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            cssPrefix,
        }
    },
}
</script>
