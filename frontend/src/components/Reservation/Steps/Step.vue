<script setup lang="ts">
import { BuilderText } from '@/support'
interface Props {
  builderText: BuilderText
  builderItemClasses?: string
}

defineProps<Props>()
</script>

<template>
  <div
    class="w-full flex justify-center items-center px-32 py-16 flex-col gap-8"
  >
    <div v-if="builderText">
      <h2>{{ builderText.heading }}</h2>
      <div class="BaseText" v-html="builderText.text" />
    </div>
    <div
      class="w-full flex justify-center items-center"
      :class="builderItemClasses"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss"></style>
