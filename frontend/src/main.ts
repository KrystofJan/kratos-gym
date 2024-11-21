import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import './styles/base/main.css'
import Logo from './components/Header/Logo.vue'

import { clerkPlugin } from 'vue-clerk'

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const CLERK_SECRET_KEY = import.meta.env.VITE_CLERK_SECRET_KEY

if (!CLERK_PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
}

createApp(App)
    .use(router)
    .use(clerkPlugin, {
        publishableKey: CLERK_PUBLISHABLE_KEY,
        secretKey: CLERK_SECRET_KEY,
        isSecure: false,
        signUpForceRedirectUrl: '/confirm-new-account',
    })
    .component('Logo', Logo)
    .mount('#app');

