<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import TopHeader from './TopHeader.vue';
import { currentAccount } from '../../store/'
import { cn } from '@/lib/utils'
import {
    MainNav,
    UserMenu,
} from '.'
import { SignedOut, SignInButton, SignUpButton, SignedIn, SignOutButton } from 'vue-clerk'

</script>

<template>
    <header class="flex h-32 items-center justify-between px-8 sticky top-0 z-50 bg-background px-32">
        <Logo type="horizontal" />
        <MainNav class="mx-6" />
        <UserMenu />
    </header>
</template>

<style scoped lang="scss">
</style>
