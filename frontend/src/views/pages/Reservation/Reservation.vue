<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStorage } from '@vueuse/core';
import { BaseService } from '@/services/base/ApiService';

import PlanStep from '@/components/Reservation/PlanStep.vue';
import PickMachineStep from '@/components/Reservation/PickMachineStep.vue';
import ConfigureMachinesStep from '@/components/Reservation/ConfigureMachinesStep/ConfigureMachinesStep.vue';
import ExTypeStep from '@/components/Reservation/ExTypeStep.vue';
import AmmountOfPeopleStep from '@/components/Reservation/AmmountOfPeopleStep.vue';


const userId = useStorage('userId');

const Plan = ref({
    PlanName: '',
    UserId: userId.value
});

const PlanMachine = ref({
    WrkOutPlanId: Number,
    WrkOutMachines: []
});

const Reservation = ref({
    AmmoutOfPeople: Number,
    WrkOutPlanId: Number,
    ReservationTime: String,
    CustomerId: userId.value,
});

const PlanType = ref({
    WrkOutPlanId: Number,
    ExerciseTypeIds: []
});

const SelectedMachines = ref([]);

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

onMounted(async () => {
    prepareServices();
});
</script>

<template>
    <form @submit.prevent="submit" class="ReservationBuilder Builder">
        {{ PlanMachine }}
        <PlanStep :Plan="Plan" :Reservation="Reservation"/>
        <PickMachineStep @machine-selected="addMachine"/>
        <ConfigureMachinesStep :SelectedMachines="SelectedMachines" :PlanMachine="PlanMachine" />
        <ExTypeStep :PlanType="PlanType" />
        <AmmountOfPeopleStep :Reservation="Reservation" />

        <div class="BuilderItem">
            <input type="submit" value="Postik">
        </div>
    </form>
</template>

<style scoped lang="scss">
@import '@/styles/sass/Reservation/Builder.scss';
</style>
