<script>
import AppHeader from './components/AppHeader.vue';
import Footer from './components/Footer.vue'
export default{
  components: {
    AppHeader,
    Footer
  }
}
</script>
<!-- TODO change header to AppHeader -->
<template>
    <AppHeader />
    <router-view v-slot="{Component}">
      <component :is="Component"/>
    </router-view>
    <Footer />
</template>

<style scoped>

</style>
