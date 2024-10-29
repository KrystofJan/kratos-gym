<script setup lang="ts">
import { watch, ref } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import { Reservation, UserRoleOptions } from '../../support/types';
import { ReservationService } from '@/support/services';
import UserCard from '../../views/User/Profile/UserCard.vue'
import InspirationalQuote from "./InspirationalQuote.vue"
import PlanInfo from "./PlanInfo.vue"
import { onMounted } from 'vue';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/shadcn/ui/card'

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/shadcn/ui/avatar'


const route = useRoute()
const reservation: Ref<Reservation | undefined> = ref()

const fetchReservation = async (id: number) => {
    try {
        const data = await new ReservationService().FetchReservation(id)
        reservation.value = data
    } catch (err) {
        console.error(err)
    }
}

watch(
    () => route.params.id,
    async (newId, oldId) => {
        console.log("asdasd")
        fetchReservation(Number(newId))
    }
)

onMounted(async () => {
    await fetchReservation(Number(route.params.id))
    const data = await new APINinjasService().GetQuote()
    quote.value = data[0].quote
})
</script>

<template>

    <div class="grid grid-cols-3 gap-16 p-16" v-if="reservation">
        <InspirationalQuote class="col-span-3" />
        <div class="grid gap-16 grid-cols-5 col-span-3">
            <UserCard v-if="reservation.Customer" :currentAccount="reservation.Customer" :role="UserRoleOptions.AUTHOR"
                class="max-w-96 h-fit col-span-1" :class="{ 'col-span-2 max-w-full': !reservation.Trainer }" />

            <PlanInfo class="col-span-3" :reservation="reservation" />
            <UserCard v-if="reservation.Trainer" :currentAccount="reservation.Trainer" :role="UserRoleOptions.TRAINER"
                class="col-span-1 max-w-96 h-fit" />

        </div>
    </div>
</template>

<style></style>
