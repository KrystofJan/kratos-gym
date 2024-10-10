<script setup lang="ts">
import { onMounted, ref } from 'vue';

const array = ref([]);

const login = () => {
    alert("logged");
}

onMounted(() => {
    array.join(['esketit1',
        'esketit2',
        'esketit3',
        'esketit4',
        'esketit5',
        'esketit6'])
});
</script>

<template>
    <div class="White">
        <FormKit type="text" label="Your Email" name="email" prefix-icon="email" placeholder="email@domain.com"
            validation="required|email" help="Order confirmation will be sent to your address" />


        <FormKit type="checkbox" :options="array" label="Hey" validation="required|email" />

        <FormKit type="form" submit-label="Login" @submit="login">

            <FormKit name="email" label="Email address" validation="required|email" />

            <FormKit name="number" label="age" validation="required|max:18" validation-visibility="live" />
            <FormKit type="password" name="password" label="Password" validation="required" />
        </FormKit>
    </div>
</template>

<style lang="scss">
.White {
    background-color: white;
}
</style>
