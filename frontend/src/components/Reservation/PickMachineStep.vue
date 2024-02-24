<script setup>
import {ref, defineProps } from 'vue';
import Step from './Step.vue';

const props = defineProps({
    Machines: ref(Array),
    SelectedMachines: ref(Array),
});

const builderText = ref({
    heading: 'Pick your machines',
    text: '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab reiciendis aliquid enim voluptatum molestias maxime voluptate, quae repellat quidem laboriosam eveniet aut perspiciatis odio minus dolorum voluptatem error, deleniti ducimus!</p>'
});


const addMachine = async (id) => {
    // TODO: Change
    let contained = false;
    console.log(PlanMachine.value.WrkOutMachines);

    PlanMachine.value.WrkOutMachines = PlanMachine.value.WrkOutMachines.filter(item => {
        if(item.WrkOutMachineId === id){
            contained = true;
            return false;
        }
        return true;
    });

    if (!contained){
        PlanMachine.value.WrkOutMachines.push({WrkOutMachineId: id})
    }
}

</script>

<template>
    <Step :builderText="builderText">    
        <div class="BuilderItem-machine" v-for="machine in Machines">
            <input  type="checkbox" 
                    :name="'machine-' + machine.WrkOutMachineId" 
                    :id="'machine-' + machine.WrkOutMachineId"
                    :value="machine"
                    v-model="SelectedMachines" 
                    @change="addMachine(machine.WrkOutMachineId)"/>
            <label :for="'machine-' + machine.WrkOutMachineId">{{ machine.MachineName }}</label>
        </div>
    </Step>
</template>

<style lang="scss">
@import '../../styles/sass/Reservation/Builder.scss';

[data-plan-name]{
    grid-column: 1/-1;
}
</style>