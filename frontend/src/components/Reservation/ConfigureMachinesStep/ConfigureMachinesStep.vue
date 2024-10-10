<script setup lang="ts">
import { ref, defineProps, onMounted } from 'vue';
import ConfigureMachinesStepItem from './ConfigureMachinesStepItem.vue'
import { BaseService } from '@/services/base/ApiService';
import Step from '../Step.vue';
import PlanMachine from '@/store/PlanMachineStore.js';

const emit = defineEmits(['next']);

const props = defineProps({
    SelectedMachines: ref(Array),
});

// TODO: I need to split this component to parent and items, 
// fetch data on change of input and validate in real time

const showButton = ref(true);

let wrkOutPlanMachinesService = {};

const prepareServices = () => {
    wrkOutPlanMachinesService = new BaseService("plan-machine");
}

const builderText = ref({
    heading: 'Now pick time for each machine',
    text: '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab reiciendis aliquid enim voluptatum molestias maxime voluptate, quae repellat quidem laboriosam eveniet aut perspiciatis odio minus dolorum voluptatem error, deleniti ducimus!</p>'
});

const fetchData = async () => {
    try {
        const machineData = await MachineService.getAll();
        Machines.value = machineData;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const clickHandle = () => {
    emit('next');
    showButton.value = false;
}


onMounted(() => {
    prepareServices();
})
</script>

<template>
    <div v-if="(SelectedMachines.length > 0)" class="StepWrapper">
        <Step :builderText="builderText" :builderItemClasses="'PlanMachineDetails'">
            <ConfigureMachinesStepItem v-for="(machine, index) in SelectedMachines" :index="index" :Machine="machine"
                :PlanMachine="PlanMachine" />
        </Step>
        <div v-if="showButton" class="Button-next" @click="clickHandle">Next -></div>
    </div>
</template>

<style lang="scss">
@import '@/styles/sass/Reservation/Builder.scss';

[data-plan-name] {
    grid-column: 1/-1;
}

.PlanMachineDetails {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(24rem, 1fr)) !important;
    gap: 2rem 4rem;
}
</style>
