<script setup lang="ts">
import { onMounted } from 'vue'
import { columns, values, deleteSelected } from './type-columns'
import { DataGrid } from '@/components'
import { ExerciseTypeService } from '@/support'

async function getData() {
  // Fetch data from your API here.
  try {
    const data = await new ExerciseTypeService().FetchAll({ limit: 1000 })
    values.value = data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(async () => {
  await getData()
})
</script>

<template>
  <div class="container py-10 mx-auto">
    <DataGrid
      :columns="columns"
      :data="values"
      id-name="ExerciseTypeId"
      bane-name="TypeName"
      :delete-selected="deleteSelected"
    />
  </div>
</template>
