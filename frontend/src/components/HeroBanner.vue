<script>
export default{
    data(){
        // change the structure to for and change the format of the return object
        return{
            banners: {}
        }
      },
      created() {
          fetch("../../siteContent/_hp-hero-banner-content.json") 
              .then((res) => res.json())
              .then((data) => this.banners = data);
      } 
}
</script>

<template>
  
  <section class="HeroBanners">
    <article class="HeroBanners-banner">
        <h3 class="HeroBanners-banner-heading">{{ this.banners[0].heading }}</h3>
      <div class="HeroBanners-banner-content">
        <p class="HeroBanners-banner-content-text">{{ this.banners[0].text }}</p>
      </div>
    </article>    

    <article class="HeroBanners-banner">
        <h3 class="HeroBanners-banner-heading">{{ this.banners[1].heading }}</h3>
      <div class="HeroBanners-banner-content">
        <p class="HeroBanners-banner-content-text">{{ this.banners[1].text }}</p>
      </div>
    </article>

    <article class="HeroBanners-banner">
        <h3 class="HeroBanners-banner-heading">{{ this.banners[2].heading }}</h3>
      <div class="HeroBanners-banner-content">
        <p class="HeroBanners-banner-content-text">{{ this.banners[2].text }}</p>
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
.HeroBanners{
  display: flex;
  flex-direction: row;
  min-height: calc(100dvw/3);

  &-banner{
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    overflow-y: hidden;
    position: relative;
    transition: all 0.2s ease-in-out;
    width: 100%;

    &:nth-of-type(1){
      background: #0000ff;
    }

    &:nth-of-type(2){
      background: #0f0;
    }

    &:nth-of-type(3){
      background: #ff0000;
    }

    &-heading{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 1;
      color: white;
      transition: all 0.2s ease-in-out;
    }

    &-content{
      text-align: center;
      display: flex;
      align-items: center;
      color: white;
      opacity: 0;
      transform: translateY(100%);
      filter: blur(0.5) invert(0.75);
      background-color: rgba(23,23,23,0.3);
      transition: all 0.3s ease-in-out; 
      height: 100%;
      
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
