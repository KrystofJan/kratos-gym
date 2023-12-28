<script setup>
import { ref } from 'vue';
const showLog = ref(false);
</script>

<template>
    <header>
      <div id="header">
        <img src="../../assets/logo.svg" alt="KratosGym logo">
      </div>
      <nav class="NavMenu">
        <div v-on:click="toggleMenu()" class="exit">x</div>
        <div class="hamburger">
          <div class="line"></div>
          <div class="line"></div>
          <div class="line"></div>
        </div>
        <ul class="NavMenu-item NavMenu-list NavMenu-menu">
          <li class="NavMenu-list-item">
            <router-link to="/" class="menu-link">Home</router-link>
          </li>
          <li class="NavMenu-list-item">
            <router-link to="/reservations" class="menu-link">Reservations</router-link>
          </li>
          <li class="NavMenu-list-item">
            <router-link to="/about-us" class="menu-link">About us</router-link>
          </li>
          <li class="NavMenu-list-item">
            <router-link to="/contacts" class="menu-link">Contacts</router-link>
          </li>
        </ul>
        <div class="NavMenu-item NavMenu-logo">
          <img src="../../assets/logo.svg" alt="KratosLogo" height="35">
        </div>
        <ul class="NavMenu-item NavMenu-list NavMenu-iconMenu">
          <li class="NavMenu-list-item NavMenu-iconMenu-item">
            <router-link to="/" class="menu-link">icon</router-link>
          </li>
          <li class="NavMenu-list-item NavMenu-iconMenu-item">
            <router-link to="/" class="menu-link">icon</router-link>
          </li>
          <li class="NavMenu-list-item NavMenu-iconMenu-item" @click="showLog=!showLog">
            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>
            <ul v-if="showLog" class="NavMenu-login-dropdown">
              <li>
                <router-link to="/log-in" class="menu-link">Log in</router-link>
              </li>
              <li>
                <router-link to="/register" class="menu-link">Register</router-link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
  </header>
</template>

<style scoped lang="scss">
.exit{
  position: absolute;
  right: 2rem;
  top: 2rem;
  display: flex;
  border: 1px solid white;
  height: 2rem;
  width: 2rem;
  text-align: center;
  color: white;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all .2s ease-in-out;
  visibility: hidden;
  

  @media (max-width: 1050px) {
    visibility: visible;
  }
  
  &:hover{
    color: black;
    background: white;
    border: 1px solid black;
  }
  
}
#header{
  width: 100%;
  background: linear-gradient(to right,#aeaeae, #e2e2e2, #aeaeae);
  
  img{
    color: #2d2d2d;
    padding: 1rem;
    font-size: 3rem;
    display: block;
    text-align: center;
    margin: 0 auto;
  }
}

.NavMenu{
  display: flex;
  height: 6rem;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  position: relative;

  @media (max-width: 1050px) {
    flex-direction: column;
    position: fixed;
    top:0;
    left: 0;
    height: 100%;
    z-index: 999;
    justify-content: center;
    background: rgba(33,33,33,0.9);
  }

  .hamburger{
    display: none;
    width: 3rem;
    height: 3rem;
    background: orange;
    position: absolute;
    right: 2rem;
    top: 2rem;
    cursor: pointer;

    @media (max-width: 1050px) {
      display: none;
    }
  }

  &-logo{
    opacity: 0;
    transition: all .2s ease-in-out;

    @media (max-width: 1050px) {
      display: none;
    }
  }

  &-login-dropdown{
    position: absolute;
    background: red;
    bottom: 0;
    right: 0;
    transform: translateY(100%);
    list-style-type: none;
    z-index: 999;
  }

  &-list{
    display:flex;
    justify-content: stretch;
    padding: 0;

    &-item {
      list-style: none;
      display: inline-block;
      padding: 1.25rem;
      cursor: pointer;

      .menu-link{
        color: blue;
        text-decoration: none;
        display: block;
        width:100%;
        height:100%;

        @media (max-width: 1050px) {
          color: #e2e2e2;
          font-size: 2rem;
          font-weight: 100;
        }
      }
    }
  }
  &-item{
    width:33%;
    text-align: center;
  }

  &-menu{
    justify-content: flex-start;

    @media (max-width: 1050px){
      flex-direction: column;
    }
  }

  &-iconMenu{
    justify-content: flex-end;
    
    @media (max-width: 1050px){   
      justify-content: center;
    }
  }
}

.sticky{
  position: fixed;
  top: 0;
  left: 0;
  opacity:.9;
  z-index: 99999;
  background: white;
  height: 4rem;
  transition: .2s all ease-in-out;


  &:hover{
    opacity: 1;
    height: 6rem;
  }
  
  .NavMenu-logo{
    opacity: 1;
  }
}

</style>
