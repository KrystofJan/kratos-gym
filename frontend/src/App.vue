<script>
import AppHeader from './components/AppHeader/AppHeader.vue';
import Footer from './components/Footer.vue'
export default{
  created () {
    window.addEventListener('scroll', this.stickyScroll);
  },
  unmounted () {
    window.removeEventListener('scroll', this.stickyScroll);
  },
  components: {
    AppHeader,
    Footer
  },
  methods :{
    stickyScroll(){
      const navbar = document.querySelector('.NavMenu');

      if (window.scrollY > navbar.offsetTop){
          navbar.classList.add('sticky');
      }
      else{
        navbar.classList.remove('sticky');
      }
    },
    toggleMenu(){
      console.log("esketit");
    }
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
