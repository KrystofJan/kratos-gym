<script setup lang="ts">
import StickyText from './Item/StickyText.vue';
import { ref, onMounted } from 'vue';
import content from '@/siteContent/_hp-sticky-text-content.json';

const TextData = ref([]);
const isLoaded = ref(false);
const fetchData = async () => {
    TextData.value = content;
}

onMounted(async () => {
    await fetchData();
    isLoaded.value = true;
});
</script>

<template>

    <section v-if="isLoaded" class="StyledText-wrapper MarginedComponent frame">
        <StickyText :data="TextData[0]" />
        <StickyText :data="TextData[1]" />
        <StickyText :data="TextData[2]" />
    </section>
</template>

<style scoped lang="scss">
.StickyText-wrapper {
    .StickyText {

        &:nth-of-type(2n) {
            flex-direction: row-reverse;
        }
    }
}
</style>
