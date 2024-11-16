<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useUser } from 'vue-clerk'
import AppHeader from './components/Header/Header.vue';
import Footer from './components/Footer/Footer.vue';
import { currentAccount, fetchAccount } from "./store/accountStore";
import Toaster from '@/components/shadcn/ui/toast/Toaster.vue'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue';

const router = useRouter()
const route = useRoute()

const { user, isLoaded: isUserLoaded } = useUser();

const loadAccount = async () => {
    if (!currentAccount.value && user.value) {
        console.log("I'm trying")
        try {
            await fetchAccount(user.value.id);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
};

onMounted(async () => {
    if (isUserLoaded.value) {
        await loadAccount();
    }
});

watch(isUserLoaded, async (newValue) => {
    if (newValue) {
        await loadAccount();
    }
});

watch(currentAccount, async (newValue) => {
    if (newValue) {
        await loadAccount();
    }
});

const showHeaderAndFooter = computed(() => {
    return !route.path.includes("/admin")
})
</script>
<template>
    <AppHeader v-if="showHeaderAndFooter" />
    <router-view v-slot="{ Component }">
        <component :is="Component" />
    </router-view>
    <Footer v-if="showHeaderAndFooter" />
    <Toaster />
</template>

<style scoped lang="scss">
@import './styles/sass/base/color-define.scss'
</style>
