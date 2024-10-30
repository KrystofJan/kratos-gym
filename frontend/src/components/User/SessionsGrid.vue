<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/shadcn/ui/table'
import {
    Button
} from '@/components/shadcn/ui/button'
import { currentAccount } from "@/store/accountStore"
import { Reservation } from '@/support/types';
import { ReservationService } from '@/support/services';

const reservations: Ref<Reservation[]> = ref([])

onMounted(async () => {
    if (currentAccount.value) {
        try {
            const data = await new ReservationService().FetchReservationsByAddressId(currentAccount.value?.AccountId);
            reservations.value = data
            console.log("asdasd")
        } catch (error) {
            console.error('Error fetching account:', error);
            // Instead of throwing, we set currentAccount to null to indicate a failed fetch
            currentAccount.value = null;
        }
    }
})

</script>

<template>
    <div>
        <Table>
            <TableCaption>Reservations</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead class="w-[100px]">
                        ReservationId
                    </TableHead>
                    <TableHead>Amount of people</TableHead>
                    <TableHead>Trainer</TableHead>
                    <TableHead>
                        Date
                    </TableHead>
                    <TableHead>
                        upcoming
                    </TableHead>
                    <TableHead class="text-right">
                        Details
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow v-for="reservation in reservations" :key="reservation.ReservationId">
                    <TableCell class="font-medium">
                        {{ reservation.ReservationId }}
                    </TableCell>
                    <TableCell>
                        {{ reservation.AmountOfPeople }}
                    </TableCell>
                    <TableCell>
                        {{ reservation.Trainer ? `${reservation.Trainer?.FirstName[0]}.
                        ${reservation.Trainer?.LastName}` : '' }}
                    </TableCell>
                    <TableCell>
                        {{ reservation.ReservationTime }}
                    </TableCell>
                    <TableCell>
                        {{ reservation.ReservationTime > new Date() }}
                    </TableCell>
                    <TableCell class="text-right">
                        <Button as-child>
                            <router-link :to="`/reservation/${reservation.ReservationId}`">Profile</router-link>
                        </Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </div>
</template>
