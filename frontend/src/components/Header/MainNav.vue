<script setup lang="ts">
import { ref } from 'vue'

import { cn } from '@/lib/utils'

interface NavItem {
  link: string
  text: string
  isActive: boolean
}

const navItems = ref<Array<NavItem>>([
  {
    link: '/',
    text: 'Home',
    isActive: true,
  },
  {
    link: '/reservations',
    text: 'Reservations',
    isActive: false,
  },
  {
    link: '/about-us',
    text: 'About us',
    isActive: false,
  },
  {
    link: '/contacts',
    text: 'Contacts',
    isActive: false,
  },
])
</script>

<template>
  <nav :class="cn('flex items-center space-x-4 lg:space-x-6')">
    <router-link
      v-for="(value, index) in navItems"
      :to="value.link"
      :id="`navlink-${index}`"
      class="text-sm font-medium transition-colors hover:text-primary"
      :class="{ 'text-muted-foreground': $route.path !== value.link }"
    >
      {{ value.text }}
    </router-link>
  </nav>
</template>

<style scoped></style>
