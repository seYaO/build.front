<template>
<span><i :class="cssPrefix + 'back-icon'" :style="{color: color}"></i><slot></slot></span>
</template>

<script>
import { cssPrefix, isColor } from '@/utils/assist'

export default {
    props: {
        color: {
            validator(value) {
                if(!value) return true;
                return isColor(value);
            },
            default: '#5C5C5C'
        }
    },
    data() {
        return {
            cssPrefix
        }
    }
}
</script>

