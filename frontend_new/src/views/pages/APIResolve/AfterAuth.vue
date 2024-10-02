<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { SignedIn, SignedOut, useUser } from 'vue-clerk'
import { createAccount as createAccountRequest } from "../../../store/accountStore";
import { AccountCreate } from "../../../support/types";

const isLoading = ref(true);
const loadMessage = ref('Loading...')
const { user, isLoaded: isUserLoaded } = useUser();

const createAccount = async () => {
    if (user.value) {
        const accountCreateModel: AccountCreate = {
            Email: user.value.emailAddresses[0].emailAddress,
            FirstName: user.value.firstName,
            LastName: user.value.lastName,
            ClerkId: user.value.id,
            Login: user.value.username,
        }
        try {
            await createAccountRequest(accountCreateModel);
        } catch (error) {
            loadMessage.value = 'Error fetching data';
            console.error('Error fetching data:', error);
        }
    }
    isLoading.value = false;
};

onMounted(async () => {
    if (isUserLoaded.value) {
        await createAccount();
    }
});

watch(isUserLoaded, (newValue) => {
    if (newValue) {
        createAccount();
    }
});
</script>

<template>
    {{ loadMessage }}
    {{ user }}
</template>
