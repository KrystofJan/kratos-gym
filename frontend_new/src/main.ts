import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { clerkPlugin } from 'vue-clerk'

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY) {
    console.log(import.meta.env)
    throw new Error('Missing Publishable Key')
}

createApp(App)
    .use(router)
    .use(clerkPlugin, {
        publishableKey: CLERK_PUBLISHABLE_KEY,
    })
    .mount('#app');
