<script setup lang="ts">
import { format, isFuture } from 'date-fns'
import { onMounted, ref } from 'vue'

import { currentAccount } from '@/store/accountStore'
import { Reservation, ReservationService } from '@/support'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ScrollArea,
  Button,
} from '@/components'

const reservations = ref<Reservation[]>([])

onMounted(async () => {
  if (currentAccount.value) {
    try {
      const data = await new ReservationService().FetchReservationsByAccountId(
        currentAccount.value?.AccountId
      )
      reservations.value = data
    } catch (error) {
      console.error('Error fetching account:', error)
      // Instead of throwing, we set currentAccount to null to indicate a failed fetch
      currentAccount.value = null
    }
  }
})
</script>

<template>
  <ScrollArea class="h-96 rounded-md border">
    <Table class="p-4">
      <TableCaption>Reservations</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[100px]"> ReservationId </TableHead>
          <TableHead>Amount of people</TableHead>
          <TableHead>Trainer</TableHead>
          <TableHead> Date </TableHead>
          <TableHead> upcoming </TableHead>
          <TableHead class="text-right"> Details </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="reservation in reservations"
          :key="reservation.ReservationId"
        >
          <TableCell class="font-medium">
            {{ reservation.ReservationId }}
          </TableCell>
          <TableCell>
            {{ reservation.AmountOfPeople }}
          </TableCell>
          <TableCell>
            {{
              reservation.Trainer
                ? `${reservation.Trainer?.FirstName[0]}.
                        ${reservation.Trainer?.LastName}`
                : ''
            }}
          </TableCell>
          <TableCell>
            {{ format(reservation.ReservationTime, 'MM/dd/yyyy') }}
          </TableCell>
          <TableCell>
            {{ isFuture(reservation.ReservationTime) ? 'yes' : 'no' }}
          </TableCell>
          <TableCell class="text-right">
            <Button as-child>
              <router-link :to="`/reservation/${reservation.ReservationId}`"
                >Profile</router-link
              >
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </ScrollArea>
</template>
