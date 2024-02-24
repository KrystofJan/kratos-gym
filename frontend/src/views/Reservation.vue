<script setup>
import { ref, onMounted } from 'vue';
import { BaseService } from '../services/base/ApiService';

import PlanStep from '../components/Reservation/PlanStep.vue';

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

const prepareData = () =>{
    for(let i = 0; i < SelectedMachines.length; i++){
        PlanMachine.value.WrkOutMachines[i] = SelectedMachines.value[i];
    }
}

const postData = async () => {
    try{
        prepareData();
        //todo fetch from obj
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
    await fetchData();
});
</script>

<template>
    <form @submit.prevent="submit" class="ReservationBuilder Builder">
        <PlanStep :Plan="Plan" :Reservation="Reservation"/>
        
        
        <div v-if="(SelectedMachines.length > 0)" class="PlanMachineDetails BuilderStep">
            <div class="BuilderText">
                <h2>Now pick time for each machine</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab reiciendis aliquid enim voluptatum molestias maxime voluptate, quae repellat quidem laboriosam eveniet aut perspiciatis odio minus dolorum voluptatem error, deleniti ducimus!</p>
            </div>
            <div class="machineWrapper BuilderItem">
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
                    <label  :for="`canDisturb${index}`">Sets:</label>
                    <input  type="checkbox" 
                            :id="`canDisturb${index}`" 
                            :name="`canDisturb${index}`"
                            v-model="PlanMachine.WrkOutMachines[index].CanDisturb">
                </div>
            </div>
        </div>
        <div class="BuilderItem" data-type-checks>
            <div class="BuilderItem-type" v-for="ex_type in Types">
                <input  type="checkbox" 
                        :name="'type-' + ex_type.ExerciseTypeId" 
                        :id="'type-' + ex_type.ExerciseTypeId"
                        :value="ex_type.ExerciseTypeId"
                        v-model="PlanType.ExerciseTypeIds">
                <label :for="'type-' + ex_type.ExerciseTypeId">{{ ex_type.TypeName }}</label>
            </div>
        </div>
        <div class="BuilderItem"  data-aop-name>
            <label for="aop">
                AmmountOfPeople:
            </label>

            <FormKit
                type="number"
                validation="required|number|between:1,4"
                validation-visibility="live"
                id="aop"
                name="aop"
                v-model="Reservation.AmmoutOfPeople"
                value="1"
                step="1" />
        </div>
        <div class="BuilderItem">
            <input type="submit" value="Postik">
        </div>
    </form>
</template>

<style scoped lang="scss">
@import '../styles/sass/Reservation/Builder.scss';
</style>