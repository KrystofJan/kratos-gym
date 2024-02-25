<script setup>
import { ref, onMounted } from 'vue';
import content from '@/siteContent/_hp-hero-banner-content.json';
const banners = ref([]);


const fetchData = () => {
  banners.value = content;
} 

onMounted(fetchData);
</script>

<template>
  
  <section class="HeroBanners frame">
    <article class="HeroBanners-banner" v-for="banner in banners">
      <h3 class="HeroBanners-banner-heading">{{ banner.heading }}</h3>
      <div class="HeroBanners-banner-content">
        <p class="HeroBanners-banner-content-text">{{ banner.text }}</p>
      </div>
      <div class="HeroBanners-banner-image">
        <img :src="banner.img_path" alt="image">
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
.HeroBanners{
  display: flex;
  flex-direction: row;
  min-height: 35rem;

  &-banner{
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    overflow-y: hidden;
    position: relative;
    transition: all 0.3s ease-in-out;
    width: 100%;
    // position: relative;
    
    &-image{
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
      overflow: hidden;

      img{
        object-fit: cover;
        object-position: right;
        height: 100%;
      }
    }


    &-heading{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 1;
      color: white;
      transition: all 0.3s ease-in-out;
      background: rgba(23,23,23,0.8);
      border-radius: .5rem;
      padding: 1rem;
      z-index: 2;
    }

    &-content{
      text-align: center;
      display: flex;
      align-items: center;
      color: white;
      opacity: 0;
      transform: translateY(100%);
      filter: blur(0.5) invert(0.75);
      background-color: rgba(23,23,23,0.8);
      transition: all 0.3s ease-in-out; 
      height: 100%;
      z-index: 3;
      
        &-text{
            padding: 1rem;
            font-size: 1.5rem;
        }

    }

    &:hover{
      //background: red;
      width: 150%;
        .HeroBanners-banner-heading{
            opacity: 0;
        }
      .HeroBanners-banner-content{
        transform: translateY(0);
        opacity:1;
      }
    }
  }

}

</style>
