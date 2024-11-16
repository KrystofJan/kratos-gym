<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import Step from '../Step.vue';
import { Machine, ExerciseType } from '@/support';
import { MachineService } from '@/support/services/machine.service';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/shadcn/ui/form'
import { Checkbox } from '@/components/shadcn/ui/checkbox'
import { TypedSchema } from 'vee-validate';
import { useField } from 'vee-validate';

const { value: selectedMachines, handleChange } = useField<Machine[]>('machines');

const machines = ref<Machine[]>([]);

defineExpose({
    machines
});

const builderText = ref({
    heading: 'Pick your machines',
    text: '<p>In this step you need to choose between our available machines</p>'
});

const fetchData = async () => {
    try {
        const data = await new MachineService().FetchMachines({ limit: 100 });
        machines.value = data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const selectedCategories = ref<number[]>([])

function assignCategories(value: Machine[]) {
    const result = value.flatMap(
        (machine: Machine) => machine.ExerciseTypes.map(
            (type: ExerciseType) => type.Category.CategoryId
        )
    );
    selectedCategories.value = result
}

const mostFrequentCategoryId = computed(() => {
    if (!selectedMachines.value) {
        return -1
    }

    if (selectedMachines.value.length < 3) {
        return -1
    }
    let max = 0
    let index = -1
    for (const catId of selectedCategories.value) {
        const amount = selectedCategories.value.filter(cat => cat === catId).length
        if (amount >= max) {
            max = amount
            index = catId
        }
    }
    return index
})

const recommendMachines = ref<Machine[]>([])

watch(mostFrequentCategoryId, async (newId) => {
    if (newId <= 0) {
        recommendMachines.value = []
        return
    }

    const machineids = selectedMachines.value.map(x => x.MachineId)
    const machineId = machines.value.filter((machine: Machine) => {
        return machine.ExerciseTypes.filter((type: ExerciseType) => {
            return type.Category.CategoryId === newId
        }).length > 0
    })[0].MachineId
    try {
        const data = await new MachineService().FetchRecommendMachine(machineId)
        recommendMachines.value = data.filter(
            (machine: Machine) => !machineids.includes(machine.MachineId)
        ).slice(0, 5);
    } catch (error) {
        console.error('Error fetching account:', error);
        recommendMachines.value = []
    }

}, { deep: true })

onMounted(async () => {
    await fetchData();
});
</script>

<template>
    <Step :builderText="builderText">
        <FormField name="machines">
            <div v-for="(item, index) in machines" :key="item.MachineId ?? index">
                <FormItem class="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                        <Checkbox :checked="selectedMachines?.some(machine => machine.MachineId === item.MachineId)"
                            @update:checked="(checked) => {
                                const newValue = checked
                                    ? [...(selectedMachines || []), item]
                                    : (selectedMachines || []).filter(machine => machine.MachineId !== item.MachineId);
                                assignCategories(newValue)
                                handleChange(newValue);
                            }" />
                    </FormControl>
                    <FormLabel class="font-normal">
                        {{ item.MachineName }}<br>
                    </FormLabel>
                </FormItem>
            </div>

            <h3>Recommended machines</h3>
            <div v-for="(item, index) in recommendMachines" :key="item.MachineId ?? index">
                <FormItem class="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                        <Checkbox :checked="selectedMachines?.some(machine => machine.MachineId === item.MachineId)"
                            @update:checked="(checked) => {
                                const newValue = checked
                                    ? [...(selectedMachines || []), item]
                                    : (selectedMachines || []).filter(machine => machine.MachineId !== item.MachineId);
                                assignCategories(newValue)
                                handleChange(newValue);
                            }" />
                    </FormControl>
                    <FormLabel class="font-normal">
                        {{ item.MachineName }}<br>
                    </FormLabel>
                </FormItem>
            </div>
            <FormMessage />
        </FormField>
    </Step>
</template>
