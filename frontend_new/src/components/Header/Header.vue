<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import TopHeader from './TopHeader.vue';
import { currentAccount } from '../../store/'
import { SignedOut, SignInButton, SignUpButton, SignedIn, SignOutButton } from 'vue-clerk'

// TODO: figure out how to make it reacitve or use the vueuse lib

const showLog = ref<boolean>(false);

const toggleMenu = () => {
    const menu = document.querySelector('.NavMenu');
    const hamburger = document.querySelector('.hamburger');

    menu.classList.toggle('show-menu');
    hamburger.classList.toggle('active');
}

</script>

<template>
    <header>
        <TopHeader />
        <nav class="NavMenu frame">
            <ul class="NavMenu-item NavMenu-list NavMenu-menu">
                <li class="NavMenu-list-item">
                    <router-link to="/" class="menu-link" @click="toggleMenu()">Home</router-link>
                </li>
                <li class="NavMenu-list-item">
                    <router-link to="/reservations" class="menu-link" @click="toggleMenu()">Reservations</router-link>
                </li>
                <li class="NavMenu-list-item">
                    <router-link to="/about-us" class="menu-link" @click="toggleMenu()">About us</router-link>
                </li>
                <li class="NavMenu-list-item">
                    <router-link to="/contacts" class="menu-link" @click="toggleMenu()">Contacts</router-link>
                </li>
            </ul>
            <div class="NavMenu-item NavMenu-logo">
                <img src="../../assets/logo.svg" alt="KratosLogo" height="35">
            </div>
            <ul class="NavMenu-item NavMenu-list NavMenu-iconMenu">
                <li class="NavMenu-list-item NavMenu-iconMenu-item">
                    <router-link to="/" class="menu-link" @click="toggleMenu()">icon</router-link>
                </li>
                <li class="NavMenu-list-item NavMenu-iconMenu-item">
                    <router-link to="/" class="menu-link" @click="toggleMenu()">icon</router-link>
                </li>
                <li class="NavMenu-list-item NavMenu-iconMenu-item" @click="showLog = !showLog">
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                        <path
                            d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                    </svg>
                    <ul v-if="showLog" class="NavMenu-login-dropdown">
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedOut>
                            <SignUpButton />
                        </SignedOut>
                        <SignedIn>
                            <router-link to="/profile" class="menu-link" @click="toggleMenu()">Profile</router-link>
                        </SignedIn>
                        <SignedIn>
                            <SignOutButton />
                        </SignedIn>
                    </ul>
                </li>
            </ul>
        </nav>
    </header>
</template>

<style scoped lang="scss">
@import './Header.scss';
</style>
