import { createApp } from 'vue'
import App from './App.vue'
import { plugin as formkit_plugin, defaultConfig as formkit_defaultConfig } from '@formkit/vue';
import router from './router';
import config from './config/formkit.config.js'

import { clerkPlugin } from 'vue-clerk'


const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY


if (!CLERK_PUBLISHABLE_KEY) {
    console.log(import.meta.env)
    throw new Error('Missing Publishable Key')

}

createApp(App)
    .use(
        formkit_plugin,
        formkit_defaultConfig(config))
    .use(router)
    .use(clerkPlugin, {
        publishableKey: CLERK_PUBLISHABLE_KEY,
    })
    .mount('#app');
