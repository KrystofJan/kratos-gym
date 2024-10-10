<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { Ref } from "vue";
import { SignedIn, SignedOut, useUser } from 'vue-clerk'
import { currentAccount, createAccount as createAccountRequest } from "../../../store/accountStore";
import { AccountCreate, Address } from "../../../support/types";
import { AddressService } from '../../../support/services'
import { toTypedSchema } from "@vee-validate/zod"
import * as z from "zod"
import { useForm } from 'vee-validate'
import { AutoForm } from '../../../components/shadcn/ui/auto-form'

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

const addressSchema = z.object({
    Street: z.string().min(2).max(50),
    City: z.string().min(2).max(50),
    Country: z.string().min(2).max(50),
    PostalCode: z.string().min(2).max(50),
    BuildingNumber: z.string().min(2).max(50),
    ApartmentNumber: z.string().min(2).max(50),
});

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

const createAddress = async (values: Record<string, any>) => {
    console.log(values)
    try {
        const addressBody: Address = {
            Street: values["Street"],
            City: values["City"],
            Country: values["Country"],
            PostalCode: values["PostalCode"],
            BuildingNumber: values["BuildingNumber"],
            ApartmentNumber: values["ApartmentNumber"]
        }

        const addressService = new AddressService();
        const data = await addressService.CreateAddress(addressBody);
        const model: Address = {
            ...addressBody,
            AddressId: data.CreatedId,
        }
        address.value = model;
        await router.push('/profile');
    } catch (error) {
        loadMessage.value = 'Error fetching data';
        console.error('Error fetching data:', error);
    }
};

onMounted(async () => {
    await createAccount()
})
</script>

<template>
    <AutoForm class="w-2/3 space-y-6" :schema="addressSchema" @submit="createAddress">
        <Button type="submit">
            Submit
        </Button>
    </AutoForm>
</template>
