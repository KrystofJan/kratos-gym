<script setup lang="ts">
import { onMounted, watch } from 'vue'

import { useUser } from 'vue-clerk'
import { currentAccount, fetchAccount } from './store/accountStore'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { Toaster, Footer, Header } from '@/components'

const route = useRoute()

const { user, isLoaded: isUserLoaded } = useUser()

const loadAccount = async () => {
  if (!currentAccount.value && user.value) {
    try {
      await fetchAccount(user.value.id)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
}

onMounted(async () => {
  if (isUserLoaded.value) {
    await loadAccount()
  }
})

watch(isUserLoaded, async (newValue) => {
  if (newValue) {
    await loadAccount()
  }
})

watch(currentAccount, async (newValue) => {
  if (newValue) {
    await loadAccount()
  }
})

const showHeaderAndFooter = computed(() => {
  return !route.path.includes('/admin')
})
</script>
<template>
  <Header v-if="showHeaderAndFooter" />
  <div class="py-8">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
  <Footer v-if="showHeaderAndFooter" />
  <Toaster />
</template>

<style scoped lang="scss"></style>
