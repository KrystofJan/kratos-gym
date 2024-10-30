<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Step from '../Step.vue';
import { Machine } from '@/support';

const Machines = ref<Machine>([]);
const selectedMachines = ref([]);
const builderText = ref({
    heading: 'Pick your machines',
    text: '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab reiciendis aliquid enim voluptatum molestias maxime voluptate, quae repellat quidem laboriosam eveniet aut perspiciatis odio minus dolorum voluptatem error, deleniti ducimus!</p>'
});

const fetchData = async () => {
    try {

    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

onMounted(async () => {
    await fetchData();
})
</script>

<template>
    <Step :builderText="builderText" :builderItemClasses="'BuilderItemGrid'">
        <div class="BuilderItem-machine" v-for="(machine, _ ) in Machines">
            <input type="checkbox" :name="'machine-' + machine" :id="'machine-' + Number(machine.MachineId)"
                :value="machine" v-model="selectedMachines" @change="$emit('machineSelected', selectedMachines)" />
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
