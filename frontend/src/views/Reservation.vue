<script setup>
import { ref, onMounted } from 'vue';
const apiData = ref([]);

const fetchData = async () => {
    try {
    const response = await fetch('http://localhost:8080/api/reservations/2');
    const data = await response.json();
    apiData.value = data;
    } catch (error) {
    console.error('Error fetching data:', error);
    }
};

onMounted(() => {
    fetchData();
});

</script>

<template>
<h1>res</h1>
{{ apiData }}
</template>

<style scoped>

</style>