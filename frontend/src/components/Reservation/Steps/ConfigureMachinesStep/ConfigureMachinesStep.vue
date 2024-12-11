<script setup lang="ts">
import { ref } from 'vue';
import { ConfigureMachinesStepItem } from '.'
import Step from '../../Step.vue';
import { Machine, Plan, PlanPost, MachinesInPlan, MachinesInPlanPost } from '@/support';
import { FormMessage } from '@/components/shadcn/ui/form'
import { FieldArray, } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { Button } from '@/components/shadcn/ui/button';
import { PlanService, MachineService } from "@/support/services"
import { format, max, parse } from 'date-fns'
import { onMounted } from 'vue';
import { reservation } from '@/store/ReservationStore';
import { Time } from "@internationalized/date";
import { TimeSuggestion } from '@/support';
import { start } from 'repl';
import { argv0 } from 'process';
import { computed } from '@vue/reactivity';

const emit = defineEmits(['submit', 'prev']);
interface Props {
    reservationTime?: Date,
    selectedMachines: Machine[],
    amountOfPeople?: number
}

const timeRecs = ref<Map<number, TimeSuggestion>>(new Map())

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
                CanDisturb: z.boolean().default(false)
            }).refine(
                (data) => {
                    const startTime = new Time(data.StartTime.hour, data.StartTime.minute)
                    const endTime = new Time(data.EndTime.hour, data.EndTime.minute)
                    return startTime < endTime
                }, { message: "Start time cannot be after End Time" }
            )).refine(
                (data) => {
                    timeRecs.value.clear()
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
                                maxStartTime < minEndTime
                            ) {

                                const startTimeTime = new Time(data[i].StartTime.hour, data[i].StartTime.minute)
                                const endTimeTime = new Time(data[i].EndTime.hour, data[i].EndTime.minute)
                                suggestTime(machine.MachineId, {
                                    desired_date: props.reservationTime ?? new Date(),
                                    desired_start_time: startTimeTime,
                                    desired_end_time: endTimeTime,
                                    amount_of_people: props.amountOfPeople || 1,
                                    can_disturb: data[i].CanDisturb
                                })
                                return false
                            }
                        }
                    }

                    return true
                },
                {
                    message: "Machines colide"
                }
            )
    })
);


const fetchConcurrentPlans = async () => {
    concurrentPlans.value = []
    if (!props.reservationTime) {
        console.error("Didn't select reservation plan")
        return;
    }

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

const suggestTime = async (id: number, vars: {
    desired_date: Date,
    desired_start_time: Time,
    desired_end_time: Time,
    amount_of_people: number,
    can_disturb: boolean
}) => {
    try {
        const data = await new MachineService().SuggestTime(id, vars)

        timeRecs.value.set(id, data)
    } catch (error) {
        console.error('Error fetching account:', error);
        timeRecs.value.delete(id)
    }
}

const { handleSubmit, setFieldValue } = useForm({
    validationSchema: schema,
})

const onSubmit = handleSubmit(values => {
    emit('submit', values.machinesInPlan)
})

const prev = () => {
    emit('prev')
}

onMounted(async () => {
    await fetchConcurrentPlans()
})

</script>

<template>

    <Step v-if="selectedMachines.length > 0" :builderText="builderText">
        <form class="justify-center flex flex-col gap-4" @submit="onSubmit">
            <div class="grid grid-cols-2 md:grid-cols-3 grid-auto-columns-1/2 md:grid-auto-columns-1/3 gap-4">
                <FieldArray name="machinesInPlan">
                    <div v-for="(machine, index) in selectedMachines" :key="index">
                        <ConfigureMachinesStepItem :machine="machine" :set-field-value="setFieldValue" :index="index"
                            :time-recs="timeRecs" />
                    </div>
                    <!-- <FormMessage /> -->
                </FieldArray>
            </div>

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

    <!-- <pre> -->
    <!--     <code> -->
    <!--         {{ timeRecs }} -->
    <!--     </code> -->
    <!-- </pre> -->
</template>

<style lang="scss"></style>
