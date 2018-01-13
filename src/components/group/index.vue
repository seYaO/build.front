<template>
<div :class="classes">
    <div v-if="title" :class="[cssPrefix + 'group-title']">{{title}}</div>
    <div :class="[cssPrefix + 'group-inner']">
        <slot></slot>
    </div>
</div>
</template>

<style lang="scss">
@import './style.scss';
</style>

<script>
import { cssPrefix } from '@/utils/variable'

export default {
    props: {
        title: {
            type: String
        }
    },
    data () {
        return {
            cssPrefix
        }
    },
    computed: {
        classes () {
            return [cssPrefix + 'group']
        }
    },
}
</script>
