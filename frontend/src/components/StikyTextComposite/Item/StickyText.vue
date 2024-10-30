<script setup lang="ts">

import {
    StickyTextData
} from '@/support'
interface Props {
    data: StickyTextData
}
const props = defineProps<Props>()
</script>

<template>
    <article class="StickyText flex z-1 relative flex-row even:flex-row-reverse">
        <div class="flex sticky top-0 min-w-96 bg-background h-screen p-12 justify-items-center items-center">
            <div class="h-fit">
                <h2>{{ data.heading }}</h2>
                <div class="" v-html="data.content"></div>
            </div>
        </div>
        <div class="min-h-[150vh]">
            <img :src="data.img_path" alt="banner" class="w-full h-full object-cover">
        </div>
    </article>
</template>

<style scoped lang="scss"></style>
