<script setup lang="ts">
import { Button } from '@/components/shadcn/ui/button'
import { ref, watch } from 'vue';
import { Input } from '@/components/shadcn/ui/input'
import { toast } from '@/components/shadcn/ui/toast'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { h } from 'vue'
import * as z from 'zod'
import { Machine, MachinesInPlan } from '@/support';
import { ConfigureMachinesStep, PlanStep, PickMachineStep, TypeStep } from '@/components/Reservation/Steps/'
import { ReservationPost } from '@/support/types/reservation';
import { Time } from '@internationalized/date';
import { SignedOut, SignedIn } from 'vue-clerk'
import { ReservationService } from '@/support';
import { currentAccount } from "@/store/accountStore"

const formSchema = toTypedSchema(z.object({
    planName: z.string().min(5).max(50),
    amountOfPeople: z.number().min(1).max(5).default(1),
    arrivalDate: z.any(),
    machines: z.array(z.object({
        MachineId: z.number(),
        MachineName: z.string(),
        MaxWeight: z.number(),
        MinWeight: z.number(),
        MaxPeople: z.number(),
        AvgTimeTaken: z.number(),
        PopularityScore: z.number(),
    })).min(1),
    machinesInPlan: z.array(z.object({
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
    })),
    exerciseCategories: z.array(z.object({
        CategoryId: z.number(),
        CategoryName: z.string()
    }))
}))

const Form = useForm({
    validationSchema: formSchema,
})

const onSubmit = Form.handleSubmit(async (values) => {

    // TODO: CREATE A RESERVATION AND ROUTE TO DETAIL
    try {
        const reservationService = new ReservationService();
        const reservation: ReservationPost = {
            AmountOfPeople: values.amountOfPeople,
            ReservationTime: new Date(values.arrivalDate.year, values.arrivalDate.month, values.arrivalDate.day),
            CustomerId: Number(currentAccount.value?.AccountId),
            Plan: {
                PlanName: values.planName,
                AccountId: Number(currentAccount.value?.AccountId),
                Machines: values.machinesInPlan.map((mip, index) => {
                    const StartTime = new Time(mip.StartTime.hour, mip.StartTime.minute)
                    const EndTime = new Time(mip.EndTime.hour, mip.EndTime.minute)
                    return {
                        ...mip,
                        MachineId: values.machines[index].MachineId,
                        StartTime: StartTime.toString(),
                        EndTime: EndTime.toString(),
                    }
                }),
                ExerciseCategories: values.exerciseCategories
            }
        }
        const data = await reservationService.CreateFullReservation(reservation);
        toast({
            title: 'Sucessfully created a reservation',
            description: `Reservation id: ${data.CreatedId}`
        })
    } catch (err) {
        toast({
            title: 'Error when trying to create reservation',
            description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
                h('code', { class: 'text-white' }, err?.toString())),
        })
    }
})

const StepNumber = ref(1);
const moveNext = (stepNumber: number) => {
    if (StepNumber.value == stepNumber) {
        StepNumber.value++;
    }
}

const selectedMachines = ref<Machine[]>([]);
const machineSelector = ref<InstanceType<typeof PickMachineStep> | null>(null);

watch(Form.errors, (errors) => {
    console.log(errors);
}, { deep: true });

watch(() => Form.values.machines, (newMachines) => {
    if (!newMachines) {
        selectedMachines.value = [];
        return;
    }

    selectedMachines.value = newMachines.map(machine => ({
        ...machine,
        ExerciseTypes: []
    }));
}, { deep: true });
</script>

<template>
    <SignedOut>
        <Alert title="Error">
            <Terminal class="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                You need to be logged in !
            </AlertDescription>
        </Alert>
    </SignedOut>
    <SignedIn>
        <div class="flex justify-center">
            <form class="w-2/3 space-y-6" @submit="onSubmit">
                <PlanStep @next="moveNext(1)" :setFieldValue="Form.setFieldValue" />
                <PickMachineStep ref="machineSelector" />
                <ConfigureMachinesStep :selectedMachines="selectedMachines" :setFieldValue="Form.setFieldValue" />
                <TypeStep :setFieldValue="Form.setFieldValue" />
                <Button type="submit">
                    Submit
                </Button>
            </form>
        </div>
    </SignedIn>
</template>

<style scoped lang="scss"></style>
