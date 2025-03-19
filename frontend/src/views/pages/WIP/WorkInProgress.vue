<script setup lang="ts">
import { Construction } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components'

const route = useRoute()
</script>

<template>
  <div class="flex justify-center">
    <Card
      class="text-center w-1/2 min-h-[32rem] h-full flex justify-center flex-col items-center"
    >
      <CardHeader>
        <CardTitle class="text-yellow-300 text-5xl text-center"
          >Warning!</CardTitle
        >
        <CardDescription class="mx-auto"
          >Page "{{ route.name }}" is unavailable</CardDescription
        >
      </CardHeader>
      <CardContent class="flex flex-col justify-center items-center">
        <Construction :size="128" class="text-yellow-300" />
        <p>This page is under construction</p>
      </CardContent>
    </Card>
  </div>
</template>
