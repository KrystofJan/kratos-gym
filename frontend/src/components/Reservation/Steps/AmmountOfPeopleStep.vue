<script setup lang="ts">
import { ref } from 'vue';
import Step from '../Step.vue';

const esketit = ref(0)
</script>

<template>
    <Step>
        <label for="aop">
            AmmountOfPeople:
        </label>

        <FormKit type="number" validation="required|number|between:1,4" validation-visibility="live" id="aop" name="aop"
            v-model="esketit" value="1" step="1" />
    </Step>
</template>

<style scoped lang="scss"></style>
