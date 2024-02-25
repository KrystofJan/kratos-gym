<script setup>
import {ref, defineProps } from 'vue';
import Step from './Step.vue';

const props = defineProps({
    Plan: ref(Object),
    Reservation: ref(Object),
});

const builderText = ref({
    heading: 'Pick a name and time for your plan!',
    text: '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab reiciendis aliquid enim voluptatum molestias maxime voluptate, quae repellat quidem laboriosam eveniet aut perspiciatis odio minus dolorum voluptatem error, deleniti ducimus!</p>'
});
</script>

<template>
    <Step :builderText="builderText">    
        <label for="plan-name">
            PlanName:
        </label>
        <input type="text" name="plan-name" id="plan-name" v-model="Plan.PlanName">    
        <label for="arrival-date">
            ArrivalDate:
        </label>
        <input type="date" name="arrival-date" v-model="Reservation.ReservationTime">    
    </Step>
</template>

<style lang="scss">
@import '@/styles/sass/Reservation/Builder.scss';

[data-plan-name]{
    grid-column: 1/-1;
}
</style>