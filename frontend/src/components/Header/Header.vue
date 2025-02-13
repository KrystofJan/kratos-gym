<script setup lang="ts">
import { MainNav, UserMenu } from '.'
</script>

<template>
  <header
    class="flex h-32 items-center justify-between px-8 sticky top-0 z-50 bg-background px-32"
  >
    <Logo type="horizontal" />
    <MainNav class="mx-6" />
    <UserMenu />
  </header>
</template>

<style scoped lang="scss"></style>
