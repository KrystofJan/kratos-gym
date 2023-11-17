<script>
export default{
  mathods: {
    toggleMenu(){
      const menu = document.querySelector('.NavMenu');
      menu.classList.toggle("closed");
    }
  }
}
</script>

<template>
    <header>
      <div id="header">
        <h1>Kratos Gym</h1>
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
        <h2 class="NavMenu-item NavMenu-logo">Kratos</h2>
        <ul class="NavMenu-item NavMenu-list NavMenu-iconMenu">
          <li class="NavMenu-list-item NavMenu-iconMenu-item">
            <router-link to="/" class="menu-link">icon</router-link>
          </li>
          <li class="NavMenu-list-item NavMenu-iconMenu-item">
            <router-link to="/" class="menu-link">icon</router-link>
          </li>
          <li class="NavMenu-list-item NavMenu-iconMenu-item">
            <router-link to="/" class="menu-link">icon</router-link>
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
  background: #e2e2e2;
  
  h1{
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
  width: 100%;
  justify-content: space-between;
  align-items: center;

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
      display: block;
    }
  }

  &-logo{

    @media (max-width: 1050px) {
      display: none;
  }
  }
  &-list{
    display:flex;
    justify-content: stretch;
    padding: 0;

    &-item {
      list-style: none;
      display: inline-block;
      padding: 1.25rem;

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

</style>
