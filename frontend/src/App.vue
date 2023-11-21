<script>
import AppHeader from './components/AppHeader.vue';
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

      const logoHeader = document.querySelector('#header');
      if (window.scrollY > logoHeader.offsetHeight){
          navbar.classList.add('sticky');
          console.log("eee");

      }
      else{
          navbar.classList.remove('sticky');
          console.log("aaa");
      }
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
