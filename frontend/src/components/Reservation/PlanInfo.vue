<script setup lang="ts">
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/shadcn/ui/card'
import { Reservation } from '@/support/types';

interface Props {
    reservation: Reservation
}

const props = defineProps<Props>()

</script>
<template>
    <Card>

        <CardHeader class="grid grid-cols-2 gap-4 items-center md:grid-cols-1">
            <CardTitle class="text-center md:text-left">
                Reservation - {{ reservation.ReservationId }}
            </CardTitle>
            <CardDescription class="text-center md:text-left">
            </CardDescription>
        </CardHeader>

        <CardContent>
            <ul>
                <li>
                    Date of reservation: {{ reservation.ReservationTime }}
                </li>
                <li>
                    Amount of people in the reservation: {{ reservation.AmountOfPeople }}
                </li>
                <li>
                    PlanId: {{ reservation.Plan?.PlanId }}
                </li>

                <li>
                    PlanName: {{ reservation.Plan?.PlanName }}
                </li>
            </ul>
        </CardContent>
    </Card>
</template>


<style></style>
