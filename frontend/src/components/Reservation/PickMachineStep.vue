<script setup>
import { ref, defineProps, onMounted } from 'vue';
import { MachineService } from '@/services/MachineService';
import Step from './Step.vue';

let machineService = {};

const prepareServices = () => {
    machineService = new MachineService();
}

const Machines = ref([]);
const selectedMachines = ref([]);
const builderText = ref({
    heading: 'Pick your machines',
    text: '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab reiciendis aliquid enim voluptatum molestias maxime voluptate, quae repellat quidem laboriosam eveniet aut perspiciatis odio minus dolorum voluptatem error, deleniti ducimus!</p>'
});

const fetchData = async () => {
    try {
        const machineData = await machineService.getAll();
        Machines.value = machineData;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

onMounted(async () => {
    prepareServices();
    await fetchData();
})
</script>

<template>
    <Step :builderText="builderText" :builderItemClasses="'BuilderItemGrid'">
        <div class="BuilderItem-machine" v-for="machine in Machines">
            <input type="checkbox" :name="'machine-' + machine.WrkOutMachineId"
                :id="'machine-' + machine.WrkOutMachineId" :value="machine" v-model="selectedMachines"
                @change="$emit('machineSelected', selectedMachines)" />
            <label :for="'machine-' + machine.WrkOutMachineId">{{ machine.MachineName }}</label>
        </div>
    </Step>
</template>

<style lang="scss">
@import '@/styles/sass/Reservation/Builder.scss';

[data-plan-name] {
    grid-column: 1/-1;
}
</style>
