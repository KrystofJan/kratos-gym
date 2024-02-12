<script setup>
import StickyText from './Item/StickyText.vue';
import { ref, onMounted } from 'vue';

const TextData = ref([]);
const isLoading = ref(true);

const fetchData = async () => {
    try{
        const response = await fetch("../../siteContent/_hp-sticky-text-content.json");
        const data = await response.json();
        TextData.value = data;
    }
    catch (error){
        console.error("Error fetching data", error);
    }
    finally{
        isLoading.value = false;
    }
} 

onMounted(fetchData);
</script>

<template>
    
<section v-if="!isLoading" class="StyledText-wrapper MarginedComponent frame">
    <StickyText :data="TextData[0]"/>
    <StickyText :data="TextData[1]"/>
    <StickyText :data="TextData[2]"/>
</section>
</template>

<style scoped lang="scss">
.StickyText-wrapper{
    .StickyText{

        &:nth-of-type(2n){
            flex-direction: row-reverse;
        }
    }
}
</style>
