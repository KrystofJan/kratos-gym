<script setup lang="ts">
import { ref } from 'vue';
import { ConfigureMachinesStepItem } from '.'
import Step from '../../Step.vue';
import { Machine } from '@/support';
import { FieldArray } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { Button } from '@/components/shadcn/ui/button';

const emit = defineEmits(['submit']);
interface Props {
    selectedMachines: Machine[],
}

const props = defineProps<Props>();

const builderText = ref({
    heading: 'Now pick time for each machine',
    text: '<p>In this step you need to pick a time and amount of work you\'ll be doing on this specific machine</p>'
});

const schema = toTypedSchema(
    z.object({
        machinesInPlan: z.array(
            z.object({
                Reps: z.number().default(6),
                Sets: z.number().default(4),
                StartTime: z.object({
                    hour: z.number().min(0).max(24).default(0),
                    minute: z.number().min(0).max(59).default(0),
                }),
                EndTime: z.object({
                    hour: z.number().min(0).max(24).default(0),
                    minute: z.number().min(0).max(59).default(0),
                }),
            })
        )
    })
);

const { handleSubmit, setFieldValue } = useForm({
    validationSchema: schema,
})

const onSubmit = handleSubmit(values => {
    console.log(values)
    emit('submit', values.machinesInPlan)
})

</script>

<template>
    <Step v-if="selectedMachines.length > 0" :builderText="builderText">

        <form class="w-2/3 space-y-6 justify-center flex" @submit="onSubmit">
            <div class="grid grid-cols-2 md:grid-cols-3 grid-auto-columns-1/2 md:grid-auto-columns-1/3 gap-4">
                <FieldArray name="machinesInPlan">
                    <ConfigureMachinesStepItem v-for="(machine, index) in selectedMachines" :key="index"
                        :machine="machine" :set-field-value="setFieldValue" :index="index" />
                </FieldArray>
            </div>

            <Button type="submit">
                Next
            </Button>
        </form>
    </Step>
</template>

<style lang="scss"></style>
