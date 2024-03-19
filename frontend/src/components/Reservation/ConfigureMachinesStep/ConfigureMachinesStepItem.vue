<script setup>
import {ref, defineProps, onMounted } from 'vue';
import { PlanMachineService } from '@/services/PlanMachineService';

import PlanMachine from '@/store/PlanMachineStore.js';
import Reservation from '@/store/ReservationStore.js';

import NumberInput from '@/components/Form/NumberInput.vue';

const props = defineProps({
    Machine: ref(Object),
    index: Number
});

const isOccupiedAtStart = ref(false);
const isOccupiedAtEnd = ref(false);
let planMachineService = {};

const prepareServices = () => {
    planMachineService = new PlanMachineService();
}

const checkIsOccupied = async (id, time, date, isEnd) => {
    try{
        const result = await planMachineService.isMachineOccupied(id, time, date);
        if(isEnd){
            isOccupiedAtEnd.value = result;
            return;
        }

        isOccupiedAtStart.value = result;

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
    <h2 class="DetailItem-heading">{{ Machine.MachineName }}</h2>
    <div class="DetailItem-holder">
        <div class="DetailItem-line">
            <label :for="`MachineStartTime${index}`">Start time:</label>
        <div v-if="isOccupiedAtStart" class="DetailItem-lineError">
            Machine is occupied at this time
        </div>
        <input  type="time" 
                :name="`MachineStartTime${index}`" 
                class="MachineTime" 
                :class="{'MachineTime-Error': isOccupiedAtStart}"   
                @change="checkIsOccupied(
                    Machine.WrkOutMachineId,
                    PlanMachine.WrkOutMachines[index].WrkOutStartTime,
                    Reservation.ReservationTime.split('T')[0]
                )"
                v-model="PlanMachine.WrkOutMachines[index].WrkOutStartTime"
                :id="`MachineStartTime${index}`"
                required >
        </div>
        
        <div class="DetailItem-line">
            <label :for="`MachineEndTime${index}`">End time:</label>
            <div v-if="isOccupiedAtEnd" class="DetailItem-lineError">
                Machine is occupied at this time
            </div>
            <input  type="time" 
                    :id="`MachineEndTime${index}`" 
                    :name="`MachineEndTime${index}`" 
                    class="MachineTime"           
                    :class="{'MachineTime-Error': isOccupiedAtEnd}"   
                    @change="checkIsOccupied(
                        Machine.WrkOutMachineId,
                        PlanMachine.WrkOutMachines[index].WrkOutStartTime,
                        Reservation.ReservationTime.split('T')[0],
                        true
                    )"
                    v-model="PlanMachine.WrkOutMachines[index].WrkOutEndTime"
                    required>
        </div>

        <div class="DetailItem-line">
            <label :for="`reps${index}`">Reps:</label>
            <div v-if="isOccupiedAtEnd" class="DetailItem-lineError">
                
            </div>
            <NumberInput 
                :max="50"
                :min="1"
                :id="`reps${index}`"
                :name="`reps${index}`"
                @value-change="(val) => PlanMachine.WrkOutMachines[index].Reps = val"
                :required="true"/>
            <!-- <input  type="number" 
                    max="50" min="1" 
                    :id="`reps${index}`" 
                    :name="`reps${index}`"
                    v-model="PlanMachine.WrkOutMachines[index].Reps"
                    required> -->
        </div>
        <div class="DetailItem-line">
            <label  :for="`sets${index}`">Sets:</label>
            <NumberInput 
                :max="10"
                :min="1"
                :id="`sets${index}`"
                :name="`sets${index}`"
                @value-change="(val) => PlanMachine.WrkOutMachines[index].Sets = val"
                :required="true"/>
        </div>
        <div class="DetailItem-line">
            <label  :for="`canDisturb${index}`">Can you be interrupted: </label>
            <input  type="checkbox" 
                    :id="`canDisturb${index}`" 
                    :name="`canDisturb${index}`"
                    v-model="PlanMachine.WrkOutMachines[index].CanDisturb" >
        </div>
    </div>
</div>
</template>

<style lang="scss">
@import '@/styles/sass/Reservation/Builder.scss';

.DetailItem {
    width: 100%;
    background: white;
    box-shadow: 0 0 2rem rgba(0,0,0,.1);
    padding: 1rem;

    &-holder {
        display: grid;
        grid-template-columns: 1fr;
        gap: .875rem;
    }

    &-heading {
        text-align: left;
    }

    .MachineTime-Error{
        border-color: red;
    }

    &-line{
        position: relative;
        display: grid;
        grid-template-columns: 7.5rem 1fr;

        &Error{
            position: absolute;
            background: red;
            color: white;
            padding: .25rem;
            top: -1rem;
            right: 0;
        }
    }
}
</style>