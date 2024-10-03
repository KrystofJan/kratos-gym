<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import type { Ref } from "vue";
import { SignedIn, SignedOut, useUser } from 'vue-clerk'
import { currentAccount, createAccount as createAccountRequest } from "../../../store/accountStore";
import { AccountCreate, Address } from "../../../support/types";
import { AddressService } from '../../../support/services'

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

const createAddress = async () => {
    try {
        console.log(address.value)
        const addressService = new AddressService();
        const data = await addressService.CreateAddress(address.value);
        const model: Address = {
            ...address.value,
            AddressId: data.CreatedId,
        }
        address.value = model;
        await router.push('/profile');
    } catch (error) {
        loadMessage.value = 'Error fetching data';
        console.error('Error fetching data:', error);
    }
}

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
    <div v-if="isLoading">
        {{ loadMessage }}
    </div>
    <div style="background: white ; padding: 4rem;" v-else>
        <form @submit.prevent="createAddress">

            <div>
                <label for="country">Country</label>
                <input type="text" id="country" v-model="address.Country" />
            </div>
            <div>
                <label for="street">Street</label>
                <input type="text" id="street" v-model="address.Street" />
            </div>

            <div>
                <label for="city">City</label>
                <input type="text" id="city" v-model="address.City" />
            </div>

            <div>
                <label for="postalCode">Postral Code</label>
                <input type="text" id="postalCode" v-model="address.PostalCode" />
            </div>


            <div>
                <label for="buildingNumber">Building Number</label>
                <input type="text" id="buildingNumber" v-model="address.BuildingNumber" />
            </div>

            <div>
                <label for="apartmentNumber">Apartment Number</label>
                <input type="text" id="apartmentNumber" v-model="address.ApartmentNumber" />
            </div>
            <button type="submit">Submit</button>
        </form>
    </div>

</template>
