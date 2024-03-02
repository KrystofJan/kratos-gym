<script setup>
import { ref } from 'vue';


const loginOrEmail = ref('');
const password = ref('');
const loading = ref(false);

const logIn = async () => {
    loading.value = true;
    const pass = btoa(password.value);
    console.log(pass);

    const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                LoginOrEmail: loginOrEmail.value,
                EncodedPassword: pass
            })
        };

    try{
        const response = await fetch('http://localhost:8080/api/userauth/login',requestOptions);
        const body = await response.json();

        loading.value = false;

        if(response.status == 500){
            alert(body.status);
            console.log(body);
        }


    }
    catch(err){
        console.log("pipi", err);
    }
}
</script>

<template>
    <div v-if="loading" class="loading">
    </div>
    <form class="LogInForm" @submit.prevent="logIn">
        <div class="LogInFormItem">
            <label class="LogInFormItem-label" for="login-email">Login or email</label>
            <input v-model="loginOrEmail" id="login-email" class="LogInFormItem-input" type="text" placeholder="example@email.com" />
        </div>
        <div class="LogInFormItem">
            <label class="LogInFormItem-label" for="password">Password</label>
            <input v-model="password" id="password" class="LogInFormItem-input" type="password" placeholder="password"/>
        </div>
        <div class="LogInFormItem">
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