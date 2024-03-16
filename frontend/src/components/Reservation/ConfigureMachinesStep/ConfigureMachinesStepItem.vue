<script setup>
import {ref, defineProps, onMounted } from 'vue';
import { PlanMachineService } from '@/services/PlanMachineService';

const props = defineProps({
    PlanMachine: ref(Object),
    Machine: ref(Object),
    index: Number
});

let planMachineService = {};

const prepareServices = () => {
    planMachineService = new PlanMachineService();
}

const checkIsOccupied = async (id, time, date) => {
    try{
        const result = await planMachineService.isMachineOccupied(id, time, date);
        console.log(result);
    }
    catch(err){
        console.error(err);
    }
}

onMounted(() => {
    prepareServices();
})
</script>

<template>
<div class="DetailItem">
    <div class="DetailItem-name">
        <span class="MachineName">{{ Machine.MachineName }} {{ index }}</span>
    </div>
    <div class="DetailItem-weights">
        <span v-if="((Machine.MinWeight && Machine.MaxWeight) && (Machine.MinWeight != Machine.MaxWeight))" class="MachineWeightrange"> 
            {{ Machine.MinWeight }}kg - {{ Machine.MaxWeight }}kg
        </span>
    </div>

    <label :for="`MachineStartTime${index}`">Start time:</label>
    <input  type="time" 
            :name="`MachineStartTime${index}`" 
            class="MachineTime" 
            @change="checkIsOccupied(Machine.WrkOutMachineId, PlanMachine.WrkOutMachines[index].WrkOutStartTime)"
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
</template>

<style lang="scss">
@import '@/styles/sass/Reservation/Builder.scss';

[data-plan-name]{
    grid-column: 1/-1;
}

.BuilderItem{

}
</style>