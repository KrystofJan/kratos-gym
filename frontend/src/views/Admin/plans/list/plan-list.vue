<script setup lang="ts">
import { PlanService } from '@/support'
import { onMounted } from 'vue'
import { columns, values, deleteSelected } from './plan-columns'
import { DataGrid } from '@/components'

async function getData() {
  try {
    const data = await new PlanService().FetchAll({ limit: 100 })
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
      :delete-selected="deleteSelected"
    />
  </div>
</template>
