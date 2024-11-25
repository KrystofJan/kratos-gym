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
import { PlanService } from "@/support/services"
import { Plan } from '@/support';
import { format, parse } from 'date-fns'
import { Stepper, StepperItem, StepperTrigger, StepperSeparator, StepperTitle, StepperDescription } from '@/components/shadcn/ui/stepper';

const reservation = ref<Partial<ReservationPost>>({})
const stepIndex = ref<number>(1)
const selectedMachines = ref<Machine[]>([]);


// Exercise Category Schema
const onSubmit = async () => {

    // TODO: CREATE A RESERVATION AND ROUTE TO DETAIL
    try {
        const reservationService = new ReservationService();
        if (!reservation.value.Plan) {
            throw new Error("Plan was not set")
        }
        const reserv: Partial<ReservationPost> = {
            ...reservation.value,
            CustomerId: Number(currentAccount.value?.AccountId),
            Plan: {
                ...reservation.value.Plan,
                AccountId: Number(currentAccount.value?.AccountId),
                Machines: reservation.value.Plan.Machines.map((mip, index) => {
                    const StartTime = new Time(mip.StartTime.hour, mip.StartTime.minute)
                    const EndTime = new Time(mip.EndTime.hour, mip.EndTime.minute)
                    return {
                        ...mip,
                        MachineId: selectedMachines.value[index].MachineId,
                        StartTime: StartTime.toString(),
                        EndTime: EndTime.toString(),
                    }
                }),
            }
        }
        console.log(reserv)
        const data = await reservationService.CreateFullReservation(reserv);
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
}


watch(() => reservation.value, () => {
    console.log(reservation.value)
}, { deep: true })
const steps = [
    { step: 1, title: 'Plan Details', description: 'Provide plan details like name and trainer.' },
    { step: 2, title: 'Pick Machines', description: 'Select the machines for your plan.' },
    { step: 3, title: 'Configure Machines', description: 'Configure machines with sets, reps, and timings.' },
    { step: 4, title: 'Add Exercise Types', description: 'Add exercise categories to your plan.' },
];
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
            <Stepper v-model="stepIndex" class="flex flex-col justify-center w-full">
                <div class="flex w-full flex-start gap-2 justify-center">
                    <StepperItem v-for="step in steps" :key="step.step" :step="step.step" v-slot="{ state }"
                        class="relative flex flex-col items-center justify-center">
                        <StepperSeparator v-if="step.step !== steps.length"
                            class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 h-0.5 bg-muted group-data-[state=completed]:bg-primary" />
                        <StepperTrigger as-child>
                            <Button :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'"
                                size="icon" :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2']"
                                :disabled="state === 'inactive'">
                                <Check v-if="state === 'completed'" class="w-4 h-4" />
                                <Circle v-if="state === 'active'" class="w-4 h-4" />
                                <Dot v-if="state === 'inactive'" class="w-4 h-4" />
                            </Button>
                        </StepperTrigger>
                        <div class="mt-5 text-center">
                            <StepperTitle :class="{ 'text-primary': state === 'active' }" class="text-sm font-semibold">
                                {{ step.title }}
                            </StepperTitle>
                            <StepperDescription :class="{ 'text-primary': state === 'active' }"
                                class="text-xs text-muted">
                                {{ step.description }}
                            </StepperDescription>
                        </div>
                    </StepperItem>
                </div>
                <form class="w-full space-y-6" @submit.prevent="onSubmit">
                    <div class="flex flex-col gap-4">
                        <template v-if="stepIndex === 1">
                            <PlanStep @submit="value => {
                                reservation.AmountOfPeople = value.amountOfPeople
                                reservation.ReservationTime = parse(
                                    `${value.arrivalDate.month}-${value.arrivalDate.day}-${value.arrivalDate.year}`,
                                    'MM-dd-yyyy',
                                    new Date()
                                )
                                console.log(reservation.ReservationTime)

                                console.log(value.arrivalDate.year)
                                console.log(value.arrivalDate.month)
                                console.log(value.arrivalDate.day)
                                reservation.TrainerId = value.trainer?.AccountId
                                reservation.Plan = { PlanName: value.planName }
                                stepIndex++

                                toast({
                                    title: 'Sucessfully created a reservation',
                                    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
                                        h('code', { class: 'text-white' }, JSON.stringify(reservation, null, 4))),
                                });
                            }" />

                        </template>
                        <template v-if="stepIndex === 2">
                            <PickMachineStep @submit="value => {
                                selectedMachines = [...value.machines.map(machine => {
                                    return {
                                        ...machine,
                                        ExerciseTypes: []
                                    }
                                })]

                                stepIndex++

                                toast({
                                    title: 'Sucessfully created a reservation',
                                    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
                                        h('code', { class: 'text-white' }, JSON.stringify(selectedMachines, null, 4))),
                                });
                            }" />
                        </template>
                        <template v-if="stepIndex === 3">
                            <ConfigureMachinesStep :reservation-time="reservation.ReservationTime"
                                :selectedMachines="selectedMachines" @submit="value => {
                                    const plan = reservation.Plan
                                    reservation.Plan = {
                                        ...plan,
                                        Machines: value
                                    }

                                    stepIndex++

                                    toast({
                                        title: 'Sucessfully created a reservation',
                                        description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
                                            h('code', { class: 'text-white' }, JSON.stringify(reservation, null, 4))),
                                    });
                                }" />
                        </template>
                        <template v-if="stepIndex === 4">
                            <TypeStep @submit="value => {
                                const plan = reservation.Plan
                                reservation.Plan = {
                                    ...plan,
                                    ExerciseCategories: value
                                }

                                stepIndex++

                                toast({
                                    title: 'Sucessfully created a reservation',
                                    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
                                        h('code', { class: 'text-white' }, JSON.stringify(reservation, null, 4))),
                                });
                            }" />
                        </template>

                        <template v-if="stepIndex === 5">

                            <pre class="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                                <code class="text-white">
                                    {{ JSON.stringify(reservation, null, 4) }}
                                </code>
                            </pre>
                            <Button type="submit">
                                Submit
                            </Button>
                        </template>
                    </div>
                </form>
            </Stepper>
        </div>
    </SignedIn>
</template>

<style scoped lang="scss"></style>
