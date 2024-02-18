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
const date = ref('');
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

        PlanMachine.value.WrkOutPlanId = r1.CreatedId;
        console.log("PLAN MACHINE", PlanMachine.value);
        const planMachineRes = await PlanMachineService.post(PlanMachine.value);
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
        alert(r4);
    }
    catch (err){
        alert(err);
    }
}

const submit = async () => {
    await postData();
}

const addMachine = (id) => {
    let contained = false;
    console.log(PlanMachine.value.WrkOutPlanMachines);

    PlanMachine.value.WrkOutPlanMachines = PlanMachine.value.WrkOutPlanMachines.filter(item => {
        if(item.WrkOutMachineId === id){
            contained = true;
            return false;
        }
        return true;
    });

    if (!contained){
        PlanMachine.value.WrkOutPlanMachines.push({WrkOutMachineId: id})
    }
}

onMounted(async () => {
    prepareServices();
    await fetchData();
});
</script>

<template>
    <section class="ReservationBuilder Builder">
        {{ PlanMachine.WrkOutPlanMachines }}
        <div class="PlanName BuilderStep">
            <div class="BuilderText">
                <h2>Pick a name and time for your plan!</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab reiciendis aliquid enim voluptatum molestias maxime voluptate, quae repellat quidem laboriosam eveniet aut perspiciatis odio minus dolorum voluptatem error, deleniti ducimus!</p>
            </div>
            <div class="BuilderItem"  data-plan-name>
                <label for="plan-name">
                    PlanName:
                </label>
                <input type="text" name="plan-name" id="plan-name" v-model="Plan.PlanName">    
            </div>
            <div class="BuilderItem"  data-plan-name>
                <label for="arrival-date">
                    ArrivalDate:
                </label>
                <input type="date" name="arrival-date" v-model="date">    
            </div>
        </div>

        <div class="PlanMachines BuilderStep">
            <div class="BuilderText">
                <h2>Pick your machines</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab reiciendis aliquid enim voluptatum molestias maxime voluptate, quae repellat quidem laboriosam eveniet aut perspiciatis odio minus dolorum voluptatem error, deleniti ducimus!</p>
            </div>

            <div class="BuilderItem" data-machine-checks>
                <div class="BuilderItem-machine" v-for="machine in Machines">
                    <input  type="checkbox" 
                            :name="'machine-' + machine.WrkOutMachineId" 
                            :id="'machine-' + machine.WrkOutMachineId"
                            :value="machine"
                            v-model="selected_machines"
                            @change="addMachine(machine.WrkOutMachineId)">
                    <label :for="'machine-' + machine.WrkOutMachineId">{{ machine.MachineName }}</label>
                </div>
            </div>
        </div>
        
        <div v-if="(selected_machines.length > 0)" class="PlanMachineDetails BuilderStep">
            <h2>Now pick time for each machine</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab reiciendis aliquid enim voluptatum molestias maxime voluptate, quae repellat quidem laboriosam eveniet aut perspiciatis odio minus dolorum voluptatem error, deleniti ducimus!</p>
            <div class="machineWrapper">
                <div class="PlanMachineDetails-item" v-for="(machine, index) in selected_machines">
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
                            v-model="PlanMachine.WrkOutPlanMachines[index].WrkOutStartTime"
                            :id="`MachineStartTime${index}`">

                    <label :for="`MachineEndTime${index}`">End time:</label>
                    <input  type="time" 
                            :id="`MachineEndTime${index}`" 
                            :name="`MachineEndTime${index}`" 
                            class="MachineTime"  
                            v-model="PlanMachine.WrkOutPlanMachines[index].WrkOutEndTime">
                    
                    <label :for="`reps${index}`">Reps:</label>
                    <input  type="number" 
                            max="50" min="1" 
                            :id="`reps${index}`" 
                            :name="`reps${index}`"
                            v-model="PlanMachine.WrkOutPlanMachines[index].Reps">

                    <label  :for="`sets${index}`">Sets:</label>
                    <input  type="number" 
                            max="10" min="1" 
                            :id="`sets${index}`" 
                            :name="`sets${index}`"
                            v-model="PlanMachine.WrkOutPlanMachines[index].Sets">
                    <label  :for="`canDisturb${index}`">Sets:</label>
                    <input  type="checkbox" 
                            :id="`canDisturb${index}`" 
                            :name="`canDisturb${index}`"
                            v-model="PlanMachine.WrkOutPlanMachines[index].canDisturb">
                </div>
            </div>
        </div>
        <div class="BuilderItem" data-type-checks>
            <div class="BuilderItem-type" v-for="ex_type in Types">
                <input  type="checkbox" 
                        :name="'type-' + ex_type.ExerciseTypeId" 
                        :id="'type-' + ex_type.ExerciseTypeId"
                        :value="ex_type.ExerciseTypeId"
                        v-model="selected_types">
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
                v-model="selected_aop"
                value="1"
                step="1" />
        </div>
        <div class="BuilderItem"  data-time-name>
            <label for="res-time">
                Time:
            </label>
            <input type="date" name="res-time" id="res-time" v-model="selected_time">    
        </div>
        <div class="BuilderItem">
            <button @click="submit">Post</button>
        </div>
    </section>
</template>

<style scoped lang="scss">
.ReservationBuilder{
    padding: 5rem 2.5rem;
    width: 75%;
    margin: auto;
    background-color: white;
}

.Builder{

    &Step{
        margin: 5rem auto;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    h2{
        text-align: center;
    }

    p{
        width: 50%;
        margin: auto;
        text-align: center;

    }

    &Text{
        grid-column: 1/-1;
    }

    &Item{
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

    .PlanMachineDetails{

        .machineWrapper{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
        }

        &-item{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            align-content: center;
            background: white;
            box-shadow: 0 0 2rem rgba(0,0,0,.1);
            padding: 1rem;

            .DetailItem{

                &-name{
                    font-size: 2rem;
                }
            }
        }

    }
}

</style>