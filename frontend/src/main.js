import { createApp } from 'vue'
import App from './App.vue'
import { plugin as formkit_plugin, defaultConfig as formkit_defaultConfig } from '@formkit/vue';
import router from './router';
import config from './config/formkit.config.js'

createApp(App)
.use(
    formkit_plugin,
    formkit_defaultConfig(config))
.use(router)
.mount('#app');
