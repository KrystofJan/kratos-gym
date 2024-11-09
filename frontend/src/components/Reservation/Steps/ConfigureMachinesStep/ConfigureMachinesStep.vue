<script setup lang="ts">
import { ref } from 'vue';
import { ConfigureMachinesStepItem } from '.'
import Step from '../../Step.vue';
import { Machine } from '@/support';
import { FieldArray } from 'vee-validate';
const emit = defineEmits(['next']);
interface Props {
    selectedMachines: Machine[],
    setFieldValue: (field: any, value: any) => void
}

const props = defineProps<Props>();

const builderText = ref({
    heading: 'Now pick time for each machine',
    text: '<p>In this step you need to pick a time and amount of work you\'ll be doing on this specific machine</p>'
});
</script>

<template>
    <Step v-if="selectedMachines.length > 0" :builderText="builderText">
        <div class="grid grid-cols-2 md:grid-cols-3 grid-auto-columns-1/2 md:grid-auto-columns-1/3 gap-4">
            <FieldArray name="machinesInPlan">
                <ConfigureMachinesStepItem v-for="(machine, index) in selectedMachines" :key="index" :machine="machine"
                    :index="index" :setFieldValue="setFieldValue" />
            </FieldArray>
        </div>
    </Step>
</template>

<style lang="scss"></style>
