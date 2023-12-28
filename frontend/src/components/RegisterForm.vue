<script setup>
import { ref } from 'vue';

const loginOrEmail = ref({
    "FirstName": '',
    "LastName": '',
    "login": '',
    "Email": '',
    "PhoneNumber": '',
    "Password": '',
    "AddressId": -1
});

const address = ref({
    Street: '',
    City: '',
    PostalCode: '',
    Country: '',
    BuildingNumber: '',
    ApartmentNumber: ''
});

const loading = ref(false);

</script>

<template>
    <div v-if="loading" class="loading">
    </div>
    <form class="RegisterForm" @submit.prevent="logIn">
        <div class="RegisterFormItem">
            <label class="RegisterFormItem-label" for="login-email">Reg or email</label>
            <input v-model="loginOrEmail" id="login-email" class="RegisterFormItem-input" type="text" placeholder="example@email.com" />
        </div>
        <div class="RegisterFormItem">
            <label class="RegisterFormItem-label" for="password">Password</label>
            <input v-model="password" id="password" class="RegisterFormItem-input" type="password" placeholder="password"/>
        </div>
        <div class="RegisterFormItem">
            <button type="submit">LogIn</button>
        </div>
    </form>
</template>

<style lang="scss" scoped>
.loading{
    position: absolute;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    backdrop-filter: blur(1rem);

    &:before{
        content: '';
        display: block;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        border: 1rem solid orange;
        border-top: 1rem solid red;
        animation: rotateCircle 1s infinite ease-in-out;
    }    
    @keyframes rotateCircle {
        from {
            transform: rotateZ(0deg);
        }
        to {
            transform: rotateZ(360deg);
        }
    }
}

.RegisterForm{
    width: fit-content;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    &Item{
        display: grid;
        grid-template-columns: 7rem 1fr;
        gap: 1rem;
        align-items: center;

        &-label{
            margin: auto 0;
            font-weight: 550;
        }

        &-input{
            height: 2rem;
        }
    }
}
</style>