<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { columns, values, deleteSelected } from './reservation-columns'
import { DataGrid } from '@/components'
import { ReservationService, Machine } from '@/support'

async function getData() {
  // Fetch data from your API here.
  try {
    const data = await new ReservationService().FetchAll({ limit: 1000 })
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
