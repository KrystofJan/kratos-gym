<script setup>
import { ref } from 'vue';
import Step from './Step.vue';
import Plan from '@/store/PlanStore.js';
import AmmountOfPeopleStep from '@/components/Reservation/AmmountOfPeopleStep.vue';
import Reservation from '@/store/ReservationStore.js';

const emit = defineEmits(['next']);

const builderText = ref({
    heading: 'Pick a name and time for your plan!',
    text: '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab reiciendis aliquid enim voluptatum molestias maxime voluptate, quae repellat quidem laboriosam eveniet aut perspiciatis odio minus dolorum voluptatem error, deleniti ducimus!</p>'
});

const showButton = ref(true);

const validateYear = () => {
    const date = Reservation.value.ReservationTime;
    console.log(date);
}

const clickHandle = () => {
    emit('next');
    showButton.value = false;
}

</script>

<template>
    <Step :builderText="builderText">    
        <label for="plan-name">
            PlanName:
        </label>
        <input type="text" name="plan-name" id="plan-name" v-model="Plan.PlanName" required>    
        <label for="arrival-date">
            ArrivalDate:
        </label>
        <input type="datetime-local" name="arrival-date" @change="validateYear" v-model="Reservation.ReservationTime" required>    
    </Step>

    <AmmountOfPeopleStep />

    <div v-if="showButton" class="Button-next" @click="clickHandle">Next -></div>
</template>

<style lang="scss">
@import '@/styles/sass/Reservation/Builder.scss';

[data-plan-name]{
    grid-column: 1/-1;
}
</style>