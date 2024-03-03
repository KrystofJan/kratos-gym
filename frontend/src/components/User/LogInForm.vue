<script setup>
import { computed, onMounted, ref } from 'vue';
import { BaseService } from '@/services/base/ApiService';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';

const router = useRouter();

const AuthModel = ref({
    LoginOrEmail: '',
    EncodedPassword: '',
});

const userId = useStorage("userId");

const error = ref("");

const showError = computed(() => {
    return error.value != "";
});


let AuthService = {};
const prepareServices = () => {
    AuthService = new BaseService("userauth/login");
}


const loading = ref(false);

const logIn = async () => {
    loading.value = true;
    AuthModel.value.EncodedPassword = btoa(AuthModel.value.EncodedPassword);
    const response = await AuthService.post(AuthModel.value);
    const body = await response.json();


    if(body.status == "success"){
        userId.value = body.userId
        loading.value = false;
        await router.push({path: '/profile'});
    }
    
    error.value = body.message;
    loading.value = false;
}

onMounted(() => {
    prepareServices();
})
</script>

<template>
    <div v-if="loading" class="loading">
    </div>
    <form class="LogInForm" @submit.prevent="logIn">
        <span class="Error" v-if="showError">{{ error }}</span>
        <div class="LogInFormItem">
            <label class="LogInFormItem-label" for="login-email">Login or email</label>
            <input required v-model="AuthModel.LoginOrEmail" id="login-email" class="LogInFormItem-input" type="text" placeholder="example@email.com" />
        </div>
        <div class="LogInFormItem">
            <label class="LogInFormItem-label" for="password">Password</label>
            <input required v-model="AuthModel.EncodedPassword" id="password" class="LogInFormItem-input" type="password" placeholder="password"/>
        </div>
        <div class="LogInFormItem">
            <button type="submit">LogIn</button>
        </div>
    </form>
</template>

<style lang="scss" scoped>
.Error{
    color: red;
}
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

.LogInForm{
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