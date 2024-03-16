<script setup>
import {ref, defineProps, onMounted } from 'vue';
import ConfigureMachinesStepItem from './ConfigureMachinesStepItem.vue'
import { BaseService } from '@/services/base/ApiService';
import Step from '../Step.vue';

const props = defineProps({
    SelectedMachines: ref(Array),
    PlanMachine: ref(Object),
});

// TODO: I need to split this component to parent and items, 
// fetch data on change of input and validate in real time

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

onMounted(() => {
    prepareServices();
})
</script>

<template>

<Step v-if="(SelectedMachines.length > 0)" :builderText="builderText" :builderItemClasses="'PlanMachineDetails'">
    <div class="PlanMachineDetails-item" v-for="(machine, index) in SelectedMachines">
           <ConfigureMachinesStepItem 
                :index="index"
                :Machine="machine"
                :PlanMachine="PlanMachine"
           />
    </div>
</Step>

</template>

<style lang="scss">
@import '@/styles/sass/Reservation/Builder.scss';

[data-plan-name]{
    grid-column: 1/-1;
}

.BuilderItem{

}
</style>

