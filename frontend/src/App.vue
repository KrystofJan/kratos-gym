<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useUser } from 'vue-clerk'
import AppHeader from './components/Header/Header.vue';
import Footer from './components/Footer/Footer.vue';
import { currentAccount, fetchAccount } from "./store/accountStore";

const { user, isLoaded: isUserLoaded } = useUser();

const loadAccount = async () => {
    if (!currentAccount.value && user.value) {
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

watch(isUserLoaded, (newValue) => {
    if (newValue) {
        loadAccount();
    }
});

</script>
<template>
    <AppHeader />
    <router-view v-slot="{ Component }">
        <component :is="Component" />
    </router-view>
    <Footer />
</template>

<style scoped lang="scss">
@import './styles/sass/base/color-define.scss'
</style>
