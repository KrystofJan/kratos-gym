<script setup lang="ts">
import { watch, ref, computed } from 'vue'
import type { Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Detail } from '.'
import { onMounted } from 'vue'
import { NotFound } from '@/views/pages/WIP'
import {
  InspirationalQuote,
  MachinesInPlan,
  Button as span,
  toast,
} from '@/components'
import { CircleX } from 'lucide-vue-next'

import {
  ReservationService,
  PlanService,
  Machine,
  Reservation,
} from '@/support'

import { currentAccount } from '@/store/accountStore'
import { isFuture } from 'date-fns'

const route = useRoute()
const router = useRouter()
const reservation: Ref<Reservation | undefined> = ref()
const machines: Ref<Machine[]> = ref([])

const fetchReservation = async (id: number) => {
  try {
    const data = await new ReservationService().FetchOne(id)
    reservation.value = data
  } catch (err) {
    console.error(err)
  }
}

const fetchMachines = async () => {
  if (reservation.value && reservation.value.Plan) {
    try {
      const data = await new PlanService().FetchPlansMachines(
        reservation.value.Plan.PlanId
      )
      machines.value = data
    } catch (err) {
      console.error(err)
    }
  }
}

const cancelReservation = async () => {
  if (!reservation.value) {
    return
  }
  try {
    const data = await new ReservationService().Delete(
      reservation.value.ReservationId
    )
    toast({
      title: 'Successfully deleted plan',
      description: `Reservation id: ${data.DeletedId}`,
    })
    await router.push('/profile')
  } catch (error) {
    toast({
      title: 'Error',
      description: `Internal server error`,
    })
  }
}

watch(
  () => route.params.id,
  async (newId) => {
    await fetchReservation(Number(newId))
    await fetchMachines()
  }
)
const canDelete = computed(() => {
  if (currentAccount.value && reservation.value) {
    return (
      currentAccount.value.AccountId ===
        reservation.value.Customer?.AccountId &&
      isFuture(reservation.value.ReservationTime)
    )
  }
  return false
})

onMounted(async () => {
  await fetchReservation(Number(route.params.id))
  await fetchMachines()
})
</script>

<template>
  <NotFound v-if="!reservation" />
  <div v-else class="p-16">
    <div class="grid grid-cols-3 gap-8" v-if="reservation">
      <InspirationalQuote class="col-span-3" />
      <Detail :reservation="reservation" />
      <MachinesInPlan
        v-if="reservation.Plan"
        :machines="machines"
        :machinesInPlan="reservation.Plan?.Machines"
      />
    </div>
    <span
      v-if="canDelete"
      @click="cancelReservation"
      class="inline-flex items-center px-4 py-2 border border-red-500 text-red-500 rounded-md cursor-pointer hover:bg-red-100 transition-colors duration-200 mt-8"
    >
      Cancel reservation
      <CircleX class="ml-1" />
    </span>
  </div>
</template>

<style></style>
