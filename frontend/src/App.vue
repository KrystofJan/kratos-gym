<script setup>
import AppHeader from './components/Header/Header.vue';
import Footer from './components/Footer/Footer.vue';

const stickyScroll = () => {
  const navbar = document.querySelector('.NavMenu');

  if (window.scrollY > navbar.offsetTop){
      navbar.classList.add('sticky');
  }
  else{
    navbar.classList.remove('sticky');
  }
}

window.addEventListener('scroll', stickyScroll);
</script>
<template>
    <AppHeader />
    <router-view v-slot="{Component}">
      <component :is="Component"/>
    </router-view>
    <Footer />
</template>

<style scoped>

</style>
