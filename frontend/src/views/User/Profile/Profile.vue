<script setup lang="ts">
import { onMounted, ref, watch, watchEffect } from 'vue'
import { SignedIn, SignedOut, useUser } from 'vue-clerk'
import { currentAccount, fetchAccount } from '@/store/accountStore'
import { Terminal } from 'lucide-vue-next'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Progress,
  UserCard,
  SessionsGrid,
} from '@/components'

const isLoading = ref(true)
const error = ref(false)
const progressAmount = ref(0)
const { user, isLoaded: isUserLoaded } = useUser()

const loadAccount = async () => {
  if (!currentAccount.value && user.value) {
    try {
      await fetchAccount(user.value.id)
      progressAmount.value = 100
    } catch (err) {
      error.value = true
      console.error('Error fetching data:', err)
    }
  }
  isLoading.value = false
}

// NOTE: Maybe not this, but it looks a bit better
watchEffect((cleanupFn) => {
  const timer = setInterval(() => {
    if (progressAmount.value < 90) {
      progressAmount.value += 10
    }
  }, 100)
  cleanupFn(() => clearTimeout(timer))
})

onMounted(async () => {
  if (isUserLoaded.value) {
    await loadAccount()
  }
})

watch(isUserLoaded, (newValue) => {
  if (newValue) {
    loadAccount()
  }
})
</script>

<template>
  <SignedOut>
    <Alert>
      <Terminal class="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription> You need to be logged in ! </AlertDescription>
    </Alert>
    <div class="ErrorMessage ErrorMessage--notLogedIn MarginedComponent"></div>
  </SignedOut>
  <SignedIn>
    <div v-if="isLoading" class="Loading MarginedComponent">
      <Progress v-if="!error" v-model="progressAmount" class="w-3/5 m-auto" />
    </div>
    <div
      v-else-if="currentAccount"
      class="grid grid-cols-5 mx-32 md:grid-col-1"
    >
      <UserCard
        :currentAccount="currentAccount"
        class="col-span-2 max-w-96 h-fit"
      />
      <SessionsGrid class="col-span-3" />
    </div>
    <div v-else class="ErrorMessage MarginedComponent">
      Failed to load account data.
    </div>
  </SignedIn>
</template>
<style lang="scss" scoped></style>
