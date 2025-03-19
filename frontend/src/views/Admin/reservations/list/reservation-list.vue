<script setup lang="ts">
import { onMounted } from 'vue'
import { columns, values, deleteSelected } from './reservation-columns'
import { DataGrid } from '@/components'
import { ReservationService } from '@/support'

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
      id-name="ReservationId"
      bane-name="Plan"
      :data="values"
      :delete-selected="deleteSelected"
    />
  </div>
</template>
