<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import TopHeader from './TopHeader.vue';
import { currentAccount } from '../../store/'
import { cn } from '@/lib/utils'
import MainNav from './MainNav.vue'
import UserMenu from './UserMenu.vue'
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
    <header class="flex h-32 items-center justify-between px-8">
        <!-- <TopHeader /> -->
        <Logo type="horizontal" />
        <MainNav class="mx-6" />
        <UserMenu />
    </header>
</template>

<style scoped lang="scss">
@import './Header.scss';
</style>
