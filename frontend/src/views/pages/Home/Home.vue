<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { currentAccount, fetchAccount } from "../../../store/accountStore";
import { useUser } from 'vue-clerk'
import HeroBanner from '@/components/HeroBanner/HeroBanner.vue';
import StickyTextComposite from '@/components/StikyTextComposite/StickyTextComposite.vue'

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
    <HeroBanner />
    <StickyTextComposite />
</template>

<style scoped lang="scss"></style>
