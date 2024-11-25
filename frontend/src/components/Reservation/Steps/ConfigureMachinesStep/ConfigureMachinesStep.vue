<script setup lang="ts">
import { ref } from 'vue';
import { ConfigureMachinesStepItem } from '.'
import Step from '../../Step.vue';
import { Machine, Plan, PlanPost, MachinesInPlan, MachinesInPlanPost } from '@/support';
import { FieldArray } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { Button } from '@/components/shadcn/ui/button';
import { PlanService } from "@/support/services"
import { format, max, parse } from 'date-fns'
import { onMounted } from 'vue';
import { reservation } from '@/store/ReservationStore';
import { Time } from "@internationalized/date";
import { start } from 'repl';
import { argv0 } from 'process';

const emit = defineEmits(['submit']);
interface Props {
    reservationTime?: Date,
    selectedMachines: Machine[],
}

const props = defineProps<Props>();

const builderText = ref({
    heading: 'Now pick time for each machine',
    text: '<p>In this step you need to pick a time and amount of work you\'ll be doing on this specific machine</p>'
});

const concurrentPlans = ref<Plan[]>([])
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
            }).refine(
                (data) => {
                    const startTime = new Time(data.StartTime.hour, data.StartTime.minute)
                    const endTime = new Time(data.EndTime.hour, data.EndTime.minute)
                    return startTime <= endTime
                }, { message: "Start time cannot be after End Time" }
            )).refine(
                (data) => {
                    for (let i = 0; i < data.length; ++i) {
                        const startTime = data[i].StartTime.hour * 60 + data[i].StartTime.minute
                        const endTime = data[i].EndTime.hour * 60 + data[i].EndTime.minute

                        const concurrentMachines: MachinesInPlanPost[] = concurrentPlans.value
                            .map((plan: PlanPost) => plan.Machines)
                            .flat()
                            .filter(machine => machine.MachineId === props.selectedMachines[i].MachineId)
                        for (const machine of concurrentMachines) {
                            const startMachineTime = machine.StartTime.split(':').map(x => Number(x))
                            const endMachineTime = machine.EndTime.split(':').map(x => Number(x))
                            const machineEndTime = endMachineTime[0] * 60 + endMachineTime[1]
                            const machineStartTime = startMachineTime[0] * 60 + startMachineTime[1]
                            const minEndTime = machineEndTime <= endTime ? machineEndTime : endTime
                            const maxStartTime = machineStartTime >= startTime ? machineStartTime : startTime

                            if (
                                maxStartTime <= minEndTime
                            ) {
                                return false
                            }
                        }
                    }
                    return true
                },
                { message: "There is a value a reservation in this timeframe try a different one" } // NOTE: Get free timeframe
            )
    })
);


const fetchConcurrentPlans = async () => {
    concurrentPlans.value = []
    if (!props.reservationTime) {
        console.error("Didn't select reservation plan")
        return;
    }

    console.log()
    for (const machine of props.selectedMachines) {
        try {
            const data = await new PlanService().FetchPlansOnDate({
                machine_id: machine.MachineId,
                date: props.reservationTime
            })

            data.forEach((element: Plan) => {
                concurrentPlans.value.push(element)
            });
        } catch (err) {
            console.error("error fetching concurrent plans", err)
        }
    }
}

const { handleSubmit, setFieldValue } = useForm({
    validationSchema: schema,
})

const onSubmit = handleSubmit(values => {
    console.log(values)
    emit('submit', values.machinesInPlan)
})

onMounted(async () => {
    await fetchConcurrentPlans()
})

</script>

<template>
    <Step v-if="selectedMachines.length > 0" :builderText="builderText">
        <pre>
            <code>
                {{ concurrentPlans }}
            </code>
        </pre>
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
