<script setup>
import { ref, onMounted } from 'vue';
import { BaseService } from '../services/base/ApiService';

const Plan = ref({
    PlanName: '',
    UserId: 1 // todo change to loged in user
});

const PlanMachine = ref({
    WrkOutPlanId: 0,
    WrkOutPlanMachines: ref([])
});
// todo split to objs

const Machines = ref([]);
const Types = ref([]);
const selected_machines = ref([]);
const selected_types = ref([]);
const selected_time = ref('');
const selected_aop = ref(1);
const User = 1;


let PlanService = {};
let PlanTypeService = {};
let PlanMachineService = {};
let ReservationService = {};
let MachineService = {};
let TypeService = {};

const prepareServices = () => {
    PlanService = new BaseService("plan");
    PlanMachineService = new BaseService("plan-machine");
    ReservationService = new BaseService("reservation");
    MachineService = new BaseService("machine");
    TypeService = new BaseService('exercise-type');
    PlanTypeService = new BaseService('plan-type');
}

const fetchData = async () => {
    try {
        const machineData = await MachineService.getAll();
        Machines.value = machineData;
        const typeData = await TypeService.getAll();
        Types.value = typeData;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const postData = async () => {
    try{
        //todo fetch from obj
        const planRes = await PlanService.post(Plan.value);
        const r1 = await planRes.json();
        console.log(r1);
        const machines = [];

        for(let m of selected_machines.value){
            machines.push({
                "WrkOutMachineId": m,
                "Reps": 12,
                "Sets": 3,
                "WrkOutStartTime": "2023-12-24 17:30:00",
                "WrkOutEndTime": "2023-12-24 17:45:00",
                "CanDisturb": true
            })
        }
        console.log({
            WrkOutPlanId: r1.CreatedId,
            WrkOutMachines: machines
        });
        const planMachineRes = await PlanMachineService.post({
            WrkOutPlanId: r1.CreatedId,
            WrkOutMachines: machines
        });
        const r2 = await planMachineRes.json();
        console.log(r2);
        
        const planTypeRes = await PlanTypeService.post({
            WrkOutPlanId: r1.CreatedId,
            ExerciseTypeIds: selected_types.value
        });
        const r3 = await planTypeRes.json();
        console.log(r3);

        const reservationRes = await ReservationService.post({
            "AmmoutOfPeople": selected_aop.value,
            "ReservationTime": selected_time.value,
            "CustomerId": User,
            "WrkOutPlanId": r1.CreatedId
        })
        const r4 = await reservationRes.json();
        console.log(r4);
        alert("poppo");
    }
    catch{
        alert("noooo");
    }
}

const submit = async () => {
    await postData();
}

onMounted(async () => {
    prepareServices();
    await fetchData();
});
</script>

<template>
    <section class="ReservationForm">
        <div class="FormItem"  data-plan-name>
            <label for="plan-name">
                PlanName:
            </label>
            <input type="text" name="plan-name" id="plan-name" v-model="Plan.PlanName">    
        </div>
        <div class="FormItem" data-machine-checks>
            <div class="FormItem-machine" v-for="machine in Machines">
                <input  type="checkbox" 
                        :name="'machine-' + machine.WrkOutMachineId" 
                        :id="'machine-' + machine.WrkOutMachineId"
                        :value="machine.WrkOutMachineId"
                        v-model="selected_machines">
                <label :for="'machine-' + machine.WrkOutMachineId">{{ machine.MachineName }}</label>
            </div>
        </div>
        <div class="FormItem" data-type-checks>
            <div class="FormItem-type" v-for="ex_type in Types">
                <input  type="checkbox" 
                        :name="'type-' + ex_type.ExerciseTypeId" 
                        :id="'type-' + ex_type.ExerciseTypeId"
                        :value="ex_type.ExerciseTypeId"
                        v-model="selected_types">
                <label :for="'type-' + ex_type.ExerciseTypeId">{{ ex_type.TypeName }}</label>
            </div>
        </div>
        <div class="FormItem"  data-aop-name>
            <label for="aop">
                AmmountOfPeople:
            </label>
            <input type="number" name="aop" id="aop" min="1" max="3" v-model="selected_aop">    
        </div>
        <div class="FormItem"  data-time-name>
            <label for="res-time">
                Time:
            </label>
            <input type="date" name="res-time" id="res-time" v-model="selected_time">    
        </div>
        <div class="FormItem">
            <button @click="submit">Post</button>
        </div>
    </section>
</template>

<style scoped>
.ReservationForm{
    padding: 5rem 2.5rem;
    background-color: white;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 2rem;

    .FormItem{
        display: grid;
        grid-template-columns: 16rem 1fr;
    }


    [data-plan-name]{
        grid-column: 1/-1;
    }

    [data-type-checks]{
        grid-column: 1/-1;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
    
        label{
            padding-left: 1rem; 
        }
    
    }
    [data-machine-checks]{
        grid-column: 1/-1;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
    
        label{
            padding-left: 1rem; 
        }
    }
}




</style>