<template>
<layout>
    <x-header slot="header">
        <div slot="title">Test</div>
    </x-header>
    <x-body slot="body">
        <group title="分享">
            <share></share>
        </group>
        <group title="test1">
            <test1></test1>
        </group>
        <group title="test2">
            <test2></test2>
        </group>
    </x-body>
</layout>
</template>

<script>
import { Layout, XHeader, XBody, Group } from '@/components'
import test1 from './test1'
import test2 from './test2'
import share from './share'

export default {
    components: {
        Layout,
        XHeader,
        XBody,
        Group,
        test1,
        test2,
        share
    }
}
</script>
