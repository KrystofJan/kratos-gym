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

const reservation = ref<Partial<ReservationPost>>({})
const stepIndex = ref<number>(0)
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


const concurrentPlans = ref<Plan[]>([])
watch(() => selectedMachines, async () => {
    concurrentPlans.value = []
    const newDate = reservation.value.ReservationTime
    if (!newDate) {
        return;
    }

    const date = parse(`${newDate.getFullYear()}-${newDate.getMonth()}-${newDate.getDay()}`, "yyyy-MM-dd", new Date())
    for (const machine of selectedMachines.value) {
        try {
            const data = await new PlanService().FetchPlansOnDate({
                machine_id: machine.MachineId,
                date
            })

            data.forEach((element: Plan) => {
                concurrentPlans.value.push(element)
            });
        } catch (err) {
            console.error("error fetching concurrent plans", err)
        }
    }
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
            <form class="w-2/3 space-y-6" @submit.prevent="onSubmit">
                <PlanStep @submit="value => {
                    reservation.AmountOfPeople = value.amountOfPeople
                    reservation.ReservationTime = new Date(
                        value.arrivalDate.year,
                        value.arrivalDate.month,
                        value.arrivalDate.day
                    )
                    reservation.TrainerId = value.trainer?.AccountId
                    reservation.Plan = { PlanName: value.planName }
                    stepIndex++

                    toast({
                        title: 'Sucessfully created a reservation',
                        description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
                            h('code', { class: 'text-white' }, JSON.stringify(reservation, null, 4))),
                    });
                }" />
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
                <ConfigureMachinesStep :selectedMachines="selectedMachines" @submit="value => {
                    const plan = reservation.Plan
                    reservation.Plan = {
                        ...plan,
                        Machines: value
                    }

                    toast({
                        title: 'Sucessfully created a reservation',
                        description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
                            h('code', { class: 'text-white' }, JSON.stringify(reservation, null, 4))),
                    });
                }" />
                <TypeStep @submit="value => {
                    const plan = reservation.Plan
                    reservation.Plan = {
                        ...plan,
                        ExerciseCategories: value
                    }

                    toast({
                        title: 'Sucessfully created a reservation',
                        description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
                            h('code', { class: 'text-white' }, JSON.stringify(reservation, null, 4))),
                    });
                }" />
                <Button type="submit">
                    Submit
                </Button>
            </form>
        </div>
    </SignedIn>
</template>

<style scoped lang="scss"></style>
