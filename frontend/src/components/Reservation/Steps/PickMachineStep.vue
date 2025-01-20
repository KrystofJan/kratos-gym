<script setup lang="ts">
import { ref, onMounted, computed, watch, h } from 'vue';
import { 
    Machine,
    ExerciseType,
    MachineService,  
} from '@/support';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Checkbox,
    Button,
    toast,
    Step,
} from '@/components'
import { toTypedSchema } from '@vee-validate/zod';
import { useField } from 'vee-validate';
import { z } from 'zod';
import { useForm } from 'vee-validate'


const emit = defineEmits(['submit', 'prev']);

const machineArray = ref<Machine[]>([]);


const schema = toTypedSchema(z.object({
    machines: z.array(
        z.object({
            MachineId: z.number(),
            MachineName: z.string(),
            MaxWeight: z.number(),
            MinWeight: z.number(),
            MaxPeople: z.number(),
            AvgTimeTaken: z.number(),
            PopularityScore: z.number(),
        })).min(1)
}));

const { handleSubmit, setFieldValue, errors } = useForm({
    validationSchema: schema,
})

const { value: selectedMachines, handleChange } = useField<Machine[]>('machines');

watch(errors, (error) => {
    console.log(error);
}, { deep: true });


const builderText = ref({
    heading: 'Pick your machines',
    text: '<p>In this step you need to choose between our available machines</p>'
});

const fetchData = async () => {
    try {
        const data = await new MachineService().FetchMachines({ limit: 100 });
        machineArray.value = data;
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
    const machineId = machineArray.value.filter((machine: Machine) => {
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

const onSubmit = handleSubmit(
    values => {
        console.log(values.machines)
        emit('submit', values)
    }
)


const prev = () => {
    emit('prev')
}

onMounted(async () => {
    console.log("hi")
    await fetchData();
});
</script>

<template>
    asasd
    <Step :builderText="builderText">
    asdasd
        <form class="w-full flex flex-col gap-4" @submit="onSubmit">
            <FormField name="machines">
                <div class="grid fieldGrid">
                    <div v-for="(item, index) in machineArray" :key="item.MachineId ?? index">
                        <FormItem class="flex gap-2 items-center">
                            <FormControl>
                                <Checkbox
                                    :checked="selectedMachines?.some(machine => machine.MachineId === item.MachineId)"
                                    @update:checked="(checked) => {
                                        const newValue = checked
                                            ? [...(selectedMachines || []), item]
                                            : (selectedMachines || []).filter(machine => machine.MachineId !== item.MachineId);
                                        assignCategories(newValue)
                                        handleChange(newValue);
                                    }" />
                            </FormControl>
                            <FormLabel class="font-normal">
                                {{ item.MachineName }}
                            </FormLabel>
                        </FormItem>
                    </div>
                </div>

                <h3>Recommended machines</h3>
                <div class="grid fieldGrid w-full">
                    <div v-for="(item, index) in recommendMachines" :key="item.MachineId ?? index">
                        <FormItem class="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    :checked="selectedMachines?.some(machine => machine.MachineId === item.MachineId)"
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
                </div>
                <FormMessage />
            </FormField>
            <div>
                <Button @click="prev">
                    Prev
                </Button>

                <Button type="submit">
                    Next
                </Button>
            </div>
        </form>
    </Step>
</template>

<style lang="scss">
.fieldGrid {
    grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
}
</style>
