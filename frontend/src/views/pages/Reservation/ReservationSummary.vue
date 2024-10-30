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
import { SignedOut, SignInButton, SignUpButton, SignedIn, SignOutButton } from 'vue-clerk'
import { ReservationService } from '@/support';
import { currentAccount } from "@/store/accountStore"


// TODO:
const onSubmit = async (reservation: ReservationPost) => {
    try {
        const reservationService = new ReservationService();
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
}
</script>

<template>
    DETAIL
</template>

<style scoped lang="scss"></style>
