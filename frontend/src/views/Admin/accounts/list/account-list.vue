<script setup lang="ts">
import { AccountService } from '@/support'
import { onMounted } from 'vue'
import { columns, values, deleteSelected } from './account-columns'
import { DataGrid } from '@/components'

async function getData() {
  // Fetch data from your API here.
  try {
    const data = await new AccountService().fetchAccounts()
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
      id-name="AccountId"
      bane-name="FirstName"
      :delete-selected="deleteSelected"
    />
  </div>
</template>
