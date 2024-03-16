<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStorage } from '@vueuse/core';
import { BaseService } from '@/services/base/ApiService';

import PlanStep from '@/components/Reservation/PlanStep.vue';
import PickMachineStep from '@/components/Reservation/PickMachineStep.vue';
import ConfigureMachinesStep from '@/components/Reservation/ConfigureMachinesStep/ConfigureMachinesStep.vue';
import ExTypeStep from '@/components/Reservation/ExTypeStep.vue';

import Plan from '@/store/PlanStore.js';
import PlanMachine from '@/store/PlanMachineStore.js';
import Reservation from '@/store/ReservationStore.js';
import PlanType from '@/store/PlanTypeStore.js';
import userId  from '@/store/userStore';

const SelectedMachines = ref([]);
const StepNumber = ref(1);

let PlanService = {};
let PlanTypeService = {};
let PlanMachineService = {};
let ReservationService = {};

const prepareServices = () => {
    PlanService = new BaseService("plan");
    PlanMachineService = new BaseService("plan-machine");
    ReservationService = new BaseService("reservation");
    PlanTypeService = new BaseService('plan-type');
}


const addMachine = async (machines) => {
    SelectedMachines.value = machines;
}

watch(SelectedMachines, () => {
    PlanMachine.value.WrkOutMachines = SelectedMachines.value.map(machine => ({"WrkOutMachineId": machine.WrkOutMachineId}));
    // TODO: Go back if there are no selectedMachines
    // if(SelectedMachines.value.length == 0){
    //     StepNumber.value = 2;
    // }
});

watch(userId, () => {
    Plan.value.UserId = parseInt(userId.value);
    Reservation.value.CustomerId = parseInt(userId.value);
});

const postData = async () => {
    try{
        const planRes = await PlanService.post(Plan.value);
        const r1 = await planRes.json();
        console.log(r1);

        PlanMachine.value.WrkOutPlanId = r1.CreatedId;
        Reservation.value.WrkOutPlanId = r1.CreatedId;
        PlanType.value.WrkOutPlanId = r1.CreatedId;
        
        // something goes wrong here
        const planMachineRes = await PlanMachineService.post(PlanMachine.value);
        const r2 = await planMachineRes.json();
        console.log(r2);
        
        const planTypeRes = await PlanTypeService.post(PlanType.value);
        const r3 = await planTypeRes.json();
        console.log(r3);

        const reservationRes = await ReservationService.post(Reservation.value)
        const r4 = await reservationRes.json();
        console.log(r4);
        alert(r4);
    }
    catch (err){
        alert(err);
    }
}

const submit = async () => {
    await postData();
}

const moveNext = (stepNumber) => {
    if(StepNumber.value == stepNumber){
        StepNumber.value ++;
    }
}
onMounted(async () => {
    prepareServices();
});
</script>

<template>
    <div class="logInPls" v-if="!userId">
    Log in lol</div>
    <form v-else @submit.prevent="submit" class="ReservationBuilder Builder">
        <PlanStep @next="moveNext(1)"/>
        <PickMachineStep  v-if="StepNumber >= 2" @machine-selected="addMachine"/>
        <ConfigureMachinesStep @next="moveNext(2)" :SelectedMachines="SelectedMachines" />
        <ExTypeStep @next="moveNext(3)" v-if="StepNumber >= 3"/>

        <div class="BuilderItem"  v-if="PlanType.ExerciseTypeIds.length > 0">
            <input type="submit" value="Postik">
        </div>
    </form>
</template>

<style scoped lang="scss">
@import '@/styles/sass/Reservation/Builder.scss';

.logInPls{
    color: white;
}
</style>
