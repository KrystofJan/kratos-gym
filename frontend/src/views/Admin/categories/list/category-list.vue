<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { columns, values, deleteSelected } from './category-columns'
import { ExerciseCategoryService, Machine} from '@/support'
import { DataGrid } from '@/components'

async function getData() {
    // Fetch data from your API here.
    try {
        const data = await new ExerciseCategoryService().FetchExerciseCategory({ limit: 100 })
        values.value = data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

onMounted(async () => {
    await getData()
})
</script>

<template>
    <div class="container py-10 mx-auto">
        <DataGrid :columns="columns" :data="values" :delete-selected="deleteSelected" />
    </div>
</template>
