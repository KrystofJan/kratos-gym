<script setup>
import {ref, defineProps, onMounted } from 'vue';
import { BaseService } from '@/services/base/ApiService';
import Step from './Step.vue';

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
            <div class="DetailItem-name">
                <span class="MachineName">{{ machine.MachineName }} {{ index  }}</span>
            </div>
            <div class="DetailItem-weights">
                <span v-if="((machine.MinWeight && machine.MaxWeight) && (machine.MinWeight != machine.MaxWeight))" class="MachineWeightrange"> 
                    {{ machine.MinWeight }}kg - {{ machine.MaxWeight }}kg
                </span>
            </div>

            <label :for="`MachineStartTime${index}`">Start time:</label>
            <input  type="time" 
                    :name="`MachineStartTime${index}`" 
                    class="MachineTime" 
                    v-model="PlanMachine.WrkOutMachines[index].WrkOutStartTime"
                    :id="`MachineStartTime${index}`">

            <label :for="`MachineEndTime${index}`">End time:</label>
            <input  type="time" 
                    :id="`MachineEndTime${index}`" 
                    :name="`MachineEndTime${index}`" 
                    class="MachineTime"  
                    v-model="PlanMachine.WrkOutMachines[index].WrkOutEndTime">
            
            <label :for="`reps${index}`">Reps:</label>
            <input  type="number" 
                    max="50" min="1" 
                    :id="`reps${index}`" 
                    :name="`reps${index}`"
                    v-model="PlanMachine.WrkOutMachines[index].Reps">

            <label  :for="`sets${index}`">Sets:</label>
            <input  type="number" 
                    max="10" min="1" 
                    :id="`sets${index}`" 
                    :name="`sets${index}`"
                    v-model="PlanMachine.WrkOutMachines[index].Sets">
            <label  :for="`canDisturb${index}`">Can you be interrupted: </label>
            <input  type="checkbox" 
                    :id="`canDisturb${index}`" 
                    :name="`canDisturb${index}`"
                    v-model="PlanMachine.WrkOutMachines[index].CanDisturb">
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