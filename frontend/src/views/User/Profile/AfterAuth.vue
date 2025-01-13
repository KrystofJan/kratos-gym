<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { Ref } from "vue";
import { SignedIn, SignedOut, useUser } from 'vue-clerk'
import { toTypedSchema } from "@vee-validate/zod"
import * as z from "zod"
import { AutoForm } from '@/components'
import { currentAccount, createAccount as createAccountRequest, fetchAccount } from "@/store/accountStore";
import { 
    AccountCreate, 
    Address, 
    AddressService, 
    AccountService 
} from "@/support";

const isLoading = ref(true);
const loadMessage = ref('Loading...')
const { user, isLoaded: isUserLoaded } = useUser();
const router = useRouter()
const address: Ref<Address> = ref({
    Street: '',
    City: '',
    Country: '',
    PostalCode: '',
    BuildingNumber: '',
    ApartmentNumber: '',
});

const phoneNumber: Ref<string> = ref("")

const addressSchema = z.object({
    PhoneNumber: z.string().min(9).max(50),
    Street: z.string().min(2).max(50),
    City: z.string().min(2).max(50),
    Country: z.string().min(2).max(50),
    PostalCode: z.string().min(2).max(50),
    BuildingNumber: z.string().min(2).max(50),
    ApartmentNumber: z.string().min(2).max(50).optional(),
});

const createAccount = async () => {
    if (user.value) {
        const accountCreateModel: AccountCreate = {
            Email: user.value.emailAddresses[0].emailAddress,
            FirstName: user.value.firstName,
            LastName: user.value.lastName,
            ClerkId: user.value.id,
            Login: user.value.username,
            ProfilePictureUrl: user.value.imageUrl
        }
        try {
            await createAccountRequest(accountCreateModel);
        } catch (error) {
            loadMessage.value = 'Error fetching data';
            console.error('Error fetching data:', error);
        }

        try {
            await fetchAccount(user.value.id);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    isLoading.value = false;
};

const createAddress = async (values: Record<string, any>) => {
    // Maybe make this a transaction
    let data: Record<string, any>
    try {
        const addressService = new AddressService();
        const addressBody: Address = {
            Street: values["Street"],
            City: values["City"],
            Country: values["Country"],
            PostalCode: values["PostalCode"],
            BuildingNumber: values["BuildingNumber"],
            ApartmentNumber: values["ApartmentNumber"]
        }
        phoneNumber.value = values["PhoneNumber"]

        data = await addressService.CreateAddress(addressBody);
        const model: Address = {
            ...addressBody,
            AddressId: data.CreatedId,
        }
        address.value = model;
    } catch (error) {
        loadMessage.value = 'Error fetching data';
        console.error('Error fetching data:', error);
    }

    try {
        const accountService = new AccountService();
        const data = await accountService.AddAddressToAccount(address.value, currentAccount.value.AccountId)
        currentAccount.value.Address = address.value;
        await router.push('/profile');
    } catch (error) {
        loadMessage.value = 'Error fetching data';
        console.error('Error fetching data:', error);
    }

    try {
        const accService = new AccountService()
        const _ = accService.UpdateAccount({ PhoneNumber: phoneNumber.value }, currentAccount.value.AccountId)
        currentAccount.value.PhoneNumber = phoneNumber.value
    } catch (err) {
        loadMessage.value = 'Error fetching data';
        console.error('Error fetching data:', err);
    }
};

onMounted(async () => {
    if (isUserLoaded.value) {
        await createAccount()
    }
})

watch(isUserLoaded, async (newValue) => {
    if (newValue) {
        await createAccount()
    }
});
</script>

<template>
    <SignedIn>
        <div v-if="isLoading">
            Loading...
        </div>

        <AutoForm v-else-if="currentAccount" class="w-2/3 space-y-6" :schema="addressSchema" @submit="createAddress">
            <Button type="submit">
                Submit
            </Button>
        </AutoForm>
    </SignedIn>
</template>
