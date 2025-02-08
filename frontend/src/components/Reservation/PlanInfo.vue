<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components'
import { Reservation } from '@/support'

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
      <CardDescription class="text-center md:text-left"> </CardDescription>
    </CardHeader>

    <CardContent class="flex gap-4 justify-between">
      <ul>
        <li>Date of reservation: {{ reservation.ReservationTime }}</li>
        <li>
          Amount of people in the reservation: {{ reservation.AmountOfPeople }}
        </li>
        <li>PlanId: {{ reservation.Plan?.PlanId }}</li>

        <li>PlanName: {{ reservation.Plan?.PlanName }}</li>
      </ul>
      <div class="flex flex-row gap-4 flex-wrap">
        <div
          v-for="(item, index) in reservation.Plan?.ExerciseCategories"
          :key="index"
        >
          <!-- So here I want to add some icons based on the category... I can't find any icons yet but I'll look into it -->
          {{ item.CategoryName }}
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<style></style>
