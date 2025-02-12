<script setup lang="ts">
type LogoType = 'vertical' | 'horizontal'

defineProps<{
  type: LogoType
}>()
const horpath = '/src/assets/logo/logo-hor.svg'
const vertpath = '/src/assets/logo/logo-vert.svg'

// const icon = defineAsyncComponent(() =>
//     import(`${props.type === 'vertical' ? vertpath : horpath}`)
// );
</script>

<template>
  <router-link to="/">
    <img
      :src="type === 'vertical' ? vertpath : horpath"
      alt="logo"
      width="150"
      height="100"
    />
  </router-link>
</template>
