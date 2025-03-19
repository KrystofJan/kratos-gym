<script setup lang="ts">
import { Machine, MachineService } from '@/support'
import { DumbbellIcon, ClipboardIcon, InfoIcon } from 'lucide-vue-next'
import { computed } from 'vue'
import { PartialReservation } from '@/support'
import { Card, CardContent, CardHeader, CardTitle } from '@/components'
import { Time } from '@internationalized/date'
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'

interface Props {
  reservation: Partial<PartialReservation>
}

const props = defineProps<Props>()
const machines: Ref<Machine[]> = ref([])

const formattedReservationTime = computed(() => {
  return props.reservation.ReservationTime?.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
  })
})

const formatTime = (time: Time) => {
  return `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`
}

onMounted(async () => {
  if (!props.reservation.Plan) {
    throw new Error('Could not find plan')
  }

  if (!props.reservation.Plan.Machines) {
    throw new Error('Could not find machines')
  }

  for (const machine of props.reservation.Plan?.Machines) {
    try {
      const data = await new MachineService().FetchMachine(machine.MachineId)
      machines.value.push(data)
    } catch (error) {
      throw new Error('Could not find this machine')
    }
  }
})
</script>

<template>
  <div
    class="bg-background text-foreground flex items-center justify-center p-4"
  >
    <Card class="w-full max-w-4xl">
      <CardHeader class="bg-primary text-primary-foreground">
        <CardTitle class="flex items-center text-2xl">
          <CalendarIcon class="mr-2" />
          Reservation Details
        </CardTitle>
      </CardHeader>
      <CardContent class="p-6 space-y-6">
        <!-- General Information -->
        <div>
          <h2 class="text-xl font-semibold mb-2 flex items-center">
            <InfoIcon class="mr-2" />
            General Information
          </h2>
          <p>
            <strong>Number of People:</strong> {{ reservation.AmountOfPeople }}
          </p>
          <p>
            <strong>Reservation Time:</strong> {{ formattedReservationTime }}
          </p>
        </div>

        <!-- Plan Details -->
        <div>
          <h2 class="text-xl font-semibold mb-2 flex items-center">
            <ClipboardIcon class="mr-2" />
            Plan Details
          </h2>
          <p><strong>Plan Name:</strong> {{ reservation.Plan?.PlanName }}</p>
          <div
            v-if="
              reservation.Plan?.ExerciseCategories &&
              reservation.Plan?.ExerciseCategories.length > 0
            "
          >
            <strong>Exercise Categories:</strong>
            <ul class="list-disc list-inside">
              <li
                v-for="category in reservation.Plan?.ExerciseCategories"
                :key="category.CategoryId"
              >
                {{ category.CategoryName }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Machines -->
        <div>
          <h2 class="text-xl font-semibold mb-2 flex items-center">
            <DumbbellIcon class="mr-2" />
            Machines
          </h2>
          <div class="grid grid-flow-col gap-3">
            <Card
              v-for="(machine, index) in reservation.Plan?.Machines"
              :key="index"
              class="mb-4"
            >
              <CardHeader>
                <CardTitle>{{
                  machines.find((x) => x.MachineId === machine.MachineId)
                    ?.MachineName
                }}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Reps:</strong> {{ machine.Reps }}</p>
                <p><strong>Sets:</strong> {{ machine.Sets }}</p>
                <p>
                  <strong>Start Time:</strong>
                  {{ formatTime(machine.StartTime) }}
                </p>
                <p>
                  <strong>End Time:</strong> {{ formatTime(machine.EndTime) }}
                </p>
                <p>
                  <strong>Can Disturb:</strong>
                  {{ machine.CanDisturb ? 'Yes' : 'No' }}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped lang="scss"></style>
