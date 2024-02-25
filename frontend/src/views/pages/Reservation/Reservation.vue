<script setup>
import { ref, onMounted } from 'vue';
import { BaseService } from '@/services/base/ApiService';

import PlanStep from '@/components/Reservation/PlanStep.vue';
import PickMachineStep from '@/components/Reservation/PickMachineStep.vue';
import ConfigureMachinesStep from '@/components/Reservation/ConfigureMachinesStep.vue';
import ExTypeStep from '@/components/Reservation/ExTypeStep.vue';
import AmmountOfPeopleStep from '@/components/Reservation/AmmountOfPeopleStep.vue';

const Plan = ref({
    PlanName: '',
    UserId: 1 // todo change to loged in user
});

const PlanMachine = ref({
    WrkOutPlanId: Number,
    WrkOutMachines: []
});

const Reservation = ref({
    AmmoutOfPeople: Number,
    WrkOutPlanId: Number,
    ReservationTime: String,
    CustomerId: 1, // todo change to loged in user
})

const PlanType = ref({
    WrkOutPlanId: Number,
    ExerciseTypeIds: []
});

const SelectedMachines = ref([]);

// todo split to objs
const Machines = ref([]);
const Types = ref([]);

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

const prepareData = () =>{
    for(let i = 0; i < SelectedMachines.length; i++){
        PlanMachine.value.WrkOutMachines[i] = SelectedMachines.value[i];
    }
}


const addMachine = async (machine) => {
    // TODO: Change
    const id = machine.WrkOutMachineId;

    let contained = false;

    PlanMachine.value.WrkOutMachines = PlanMachine.value.WrkOutMachines.filter(item => {
        if(item.WrkOutMachineId === id){
            contained = true;
            return false;
        }
        return true;
    });

    SelectedMachines.value = SelectedMachines.value.filter(item => {
        if(item.WrkOutMachineId === id){
            return false;
        }
        return true;
    });

    if (!contained){
        SelectedMachines.value.push(machine);
        PlanMachine.value.WrkOutMachines.push({WrkOutMachineId: id})
    }
}


const postData = async () => {
    try{
        prepareData();
        const planRes = await PlanService.post(Plan.value);
        const r1 = await planRes.json();
        console.log(r1);

        PlanMachine.value.WrkOutPlanId = r1.CreatedId;
        Reservation.value.WrkOutPlanId = r1.CreatedId;
        PlanType.value.WrkOutPlanId = r1.CreatedId;
        
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