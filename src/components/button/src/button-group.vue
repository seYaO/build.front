<template>
<div :class="cssPrefix + 'button'">
    <slot></slot>
</div>
</template>

<script>
import { cssPrefix } from '@/utils/assist'

export default {
    data() {
        return {
            cssPrefix,
        }
    },
}
</script>
