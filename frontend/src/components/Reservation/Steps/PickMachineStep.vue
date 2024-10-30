<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Step from '../Step.vue';
import { Machine } from '@/support';
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

// Expose machines to parent component
defineExpose({
    machines
});

const builderText = ref({
    heading: 'Pick your machines',
    text: '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab reiciendis aliquid enim voluptatum molestias maxime voluptate, quae repellat quidem laboriosam eveniet aut perspiciatis odio minus dolorum voluptatem error, deleniti ducimus!</p>'
});

const fetchData = async () => {
    try {
        const data = await new MachineService().FetchMachines({ limit: 100 });
        machines.value = data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

onMounted(async () => {
    await fetchData();
});
</script>

<template>
    <Step :builderText="builderText" :builderItemClasses="'BuilderItemGrid'">
        <FormField name="machines">
            <div v-for="(item, index) in machines" :key="item.MachineId ?? index">
                <FormItem class="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                        <Checkbox :checked="selectedMachines?.some(machine => machine.MachineId === item.MachineId)"
                            @update:checked="(checked) => {
                                const newValue = checked
                                    ? [...(selectedMachines || []), item]
                                    : (selectedMachines || []).filter(machine => machine.MachineId !== item.MachineId);
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
