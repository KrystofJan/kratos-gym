<script setup lang="ts">
import { MachineService } from '@/support'
import { onMounted } from 'vue'
import { columns, values, deleteSelected } from './machine-columns'
import { DataGrid } from '@/components'

async function getData() {
  // Fetch data from your API here.
  try {
    const data = await new MachineService().FetchMachines({ limit: 100 })
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
      id-name="MachineId"
      name-name="MachineName"
      :delete-selected="deleteSelected"
    />
  </div>
</template>
