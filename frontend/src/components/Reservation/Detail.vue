<script setup lang="ts">
import { Machine, Reservation, UserRoleOptions } from '../../support/types';
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


interface Props {
    reservation: Reservation
}
const props = defineProps<Props>()


</script>
<template>
    <div class="grid gap-8 grid-cols-5 col-span-3">
        <UserCard v-if="reservation.Customer" :currentAccount="reservation.Customer" :role="UserRoleOptions.AUTHOR"
            class="max-w-96 col-span-1 h-full flex justify-center items-center"
            :class="{ 'col-span-2 max-w-full': !reservation.Trainer }" />

        <PlanInfo class="col-span-3" :reservation="reservation" />
        <UserCard v-if="reservation.Trainer" :currentAccount="reservation.Trainer" :role="UserRoleOptions.TRAINER"
            class="col-span-1 max-w-96 h-full flex justify-center items-center" />
    </div>
</template>
