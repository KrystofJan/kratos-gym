<script setup lang="ts">
import { watch, ref } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import { Machine, Reservation, UserRoleOptions } from '../../support/types';
import { ReservationService, PlanService } from '@/support/services';
import { Detail } from '.'
import { onMounted } from 'vue';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/shadcn'

import {
    InspirationalQuote,
    PlanInfo,
    UserCard,
    MachinesInPlan,
} from '@/components'

const route = useRoute()
const reservation: Ref<Reservation | undefined> = ref()
const machines: Ref<Machine[]> = ref([])

const fetchReservation = async (id: number) => {
    try {
        const data = await new ReservationService().FetchReservation(id)
        reservation.value = data
    } catch (err) {
        console.error(err)
    }
}

const fetchMachines = async () => {
    if (reservation.value && reservation.value.Plan) {

        try {
            const data = await new PlanService().FetchPlansMachines(reservation.value.Plan.PlanId)
            machines.value = data
        } catch (err) {
            console.error(err)
        }
    }
}


watch(
    () => route.params.id,
    async (newId, oldId) => {
        await fetchReservation(Number(newId))
        await fetchMachines()
    }
)

onMounted(async () => {
    await fetchReservation(Number(route.params.id))
    await fetchMachines()
})
</script>

<template>

    <div class="grid grid-cols-3 gap-8 p-16" v-if="reservation">
        <InspirationalQuote class="col-span-3" />
        <Detail :reservation="reservation" />
        <MachinesInPlan v-if="reservation.Plan" :machines="machines" :machinesInPlan="reservation.Plan?.Machines" />
    </div>
</template>

<style></style>
