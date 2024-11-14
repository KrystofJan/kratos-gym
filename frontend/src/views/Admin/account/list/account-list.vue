<script setup lang="ts">
import type { Machine } from '@/support'
import { onMounted, ref } from 'vue'
import { columns, values } from './account-columns'
import { AccountService } from '@/support/services/account.service'
import { DataGrid } from '@/components/DataGrid'

async function getData() {
    // Fetch data from your API here.
    try {
        const data = await new AccountService().fetchAccounts()
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
