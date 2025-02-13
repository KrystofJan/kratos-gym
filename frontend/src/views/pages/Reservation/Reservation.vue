<script setup lang="ts">
import { ref, watch, h } from 'vue'
import type { Ref } from 'vue'
import { Time } from '@internationalized/date'
import { SignedOut, SignedIn } from 'vue-clerk'
import { currentAccount } from '@/store/accountStore'
import { parse } from 'date-fns'
import { ReservationSummary } from '.'
import { PlanGeneratorResults } from '@/support/types/plan-generator.config'

import { Circle, Check, Dot, Terminal } from 'lucide-vue-next'

import {
  toast,
  Button,
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperSeparator,
  StepperTitle,
  StepperDescription,
  ConfigureMachinesStep,
  PickMachineStep,
  PickMachineOrderStep,
  PlanStep,
  TypeStep,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components'

import {
  Machine,
  MachinesInPlan,
  PartialReservation,
  ReservationPost,
  ReservationService,
} from '@/support'

const reservation: Ref<Partial<PartialReservation>> = ref({})

const stepIndex = ref<number>(1)
const selectedMachines = ref<Machine[]>([])

const generatedTime: Ref<{
  map: Map<number, [Time, Time]>[]
  data: PlanGeneratorResults
} | null> = ref(null)

// Exercise Category Schema
const onSubmit = async () => {
  // TODO: CREATE A RESERVATION AND ROUTE TO DETAIL
  try {
    const reservationService = new ReservationService()
    if (!reservation.value.Plan) {
      throw new Error('Plan was not set')
    }
    const reserv: Partial<ReservationPost> = {
      ...reservation.value,
      CustomerId: Number(currentAccount.value?.AccountId),
      Plan: {
        ...reservation.value.Plan,
        AccountId: Number(currentAccount.value?.AccountId),
        Machines: reservation.value.Plan.Machines?.map((mip, index) => {
          return {
            ...mip,
            MachineId: selectedMachines.value[index].MachineId,
            StartTime: `${mip.StartTime.hour}:${mip.StartTime.minute}`,
            EndTime: `${mip.EndTime.hour}:${mip.EndTime.minute}`,
          }
        }),
      },
    }
    const data = await reservationService.CreateFullReservation(reserv)
    toast({
      title: 'Sucessfully created a reservation',
      description: `Reservation id: ${data.CreatedId}`,
    })
  } catch (err) {
    toast({
      title: 'Error when trying to create reservation',
      description: h(
        'pre',
        { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
        h('code', { class: 'text-white' }, err?.toString())
      ),
    })
  }
}
watch(
  () => reservation.value,
  () => {
    console.log(reservation.value)
  },
  { deep: true }
)
const steps = [
  {
    step: 1,
    title: 'Plan Details',
    description: 'Provide plan details like name and trainer.',
  },
  {
    step: 2,
    title: 'Pick Machines',
    description: 'Select the machines for your plan.',
  },
  { step: 3, title: 'Pick Machine order', description: 'Choose machine order' },
  {
    step: 4,
    title: 'Configure Machines',
    description: 'Configure machines with sets, reps, and timings.',
  },
  {
    step: 5,
    title: 'Add Exercise Types',
    description: 'Add exercise categories to your plan.',
  },
]
</script>

<template>
  <SignedOut>
    <Alert title="Error">
      <Terminal class="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription> You need to be logged in ! </AlertDescription>
    </Alert>
  </SignedOut>
  <SignedIn>
    <div class="flex justify-center">
      <Stepper v-model="stepIndex" class="flex flex-col justify-center w-full">
        <div class="flex w-full flex-start gap-2 justify-center">
          <StepperItem
            v-for="step in steps"
            :key="step.step"
            :step="step.step"
            v-slot="{ state }"
            class="relative flex flex-col items-center justify-center"
          >
            <StepperSeparator
              v-if="step.step !== steps.length"
              class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 h-0.5 bg-muted group-data-[state=completed]:bg-primary"
            />
            <StepperTrigger as-child>
              <Button
                :variant="
                  state === 'completed' || state === 'active'
                    ? 'default'
                    : 'outline'
                "
                size="icon"
                :class="[
                  state === 'active' && 'ring-2 ring-ring ring-offset-2',
                ]"
                :disabled="state === 'inactive'"
              >
                <Check v-if="state === 'completed'" class="w-4 h-4" />
                <Circle v-if="state === 'active'" class="w-4 h-4" />
                <Dot v-if="state === 'inactive'" class="w-4 h-4" />
              </Button>
            </StepperTrigger>
            <div class="mt-5 text-center">
              <StepperTitle
                :class="{ 'text-primary': state === 'active' }"
                class="text-sm font-semibold"
              >
                {{ step.title }}
              </StepperTitle>
              <StepperDescription
                :class="{ 'text-primary': state === 'active' }"
                class="text-xs text-muted"
              >
                {{ step.description }}
              </StepperDescription>
            </div>
          </StepperItem>
        </div>
        <form class="w-full space-y-6" @submit.prevent="onSubmit">
          <div class="flex flex-col gap-4">
            <KeepAlive>
              <template v-if="stepIndex === 1">
                <PlanStep
                  @submit="
                    (value) => {
                      reservation.AmountOfPeople = value.amountOfPeople
                      console.log(value.arrivalDate)
                      reservation.ReservationTime = parse(
                        value.arrivalDate,
                        'yyyy-MM-dd',
                        new Date()
                      )

                      reservation.TrainerId = value.trainer?.AccountId
                      reservation.Plan = { PlanName: value.planName }
                      stepIndex++
                    }
                  "
                />
              </template>
            </KeepAlive>
            <KeepAlive>
              <template v-if="stepIndex === 2">
                <PickMachineStep
                  @prev="stepIndex = 1"
                  @submit="
                    (value) => {
                      selectedMachines = [
                        ...value.machines.map(
                          (machine: Partial<MachinesInPlan>) => {
                            return {
                              ...machine,
                              ExerciseTypes: [],
                            }
                          }
                        ),
                      ]

                      stepIndex++
                    }
                  "
                />
              </template>
            </KeepAlive>
            <template v-if="stepIndex === 3">
              <!-- Not cashing due to constant changes -->
              <PickMachineOrderStep
                @prev="stepIndex = 2"
                :selectedMachines="selectedMachines"
                :amountOfPeople="Number(reservation.AmountOfPeople)"
                :reservation-date="reservation.ReservationTime as Date"
                @submit="
                  (value) => {
                    console.log(value)
                    stepIndex++
                    selectedMachines = value
                    generatedTime = null
                  }
                "
                @generated="
                  (value) => {
                    stepIndex++
                    generatedTime = value
                  }
                "
              />
            </template>
            <template v-if="stepIndex === 4">
              <!-- Not cashing due to constant changes -->
              <ConfigureMachinesStep
                :reservation-time="reservation.ReservationTime"
                @prev="stepIndex = 3"
                :selectedMachines="selectedMachines"
                :amount-of-people="reservation.AmountOfPeople"
                :preloaded-data="
                  generatedTime === null ? undefined : generatedTime.map
                "
                :generated="generatedTime !== null"
                @submit="
                  (value) => {
                    const plan = reservation.Plan
                    reservation.Plan = {
                      ...plan,
                      Machines: value,
                    }

                    stepIndex++
                  }
                "
              />
            </template>
            <KeepAlive>
              <template v-if="stepIndex === 5">
                <TypeStep
                  @prev="stepIndex = 4"
                  @submit="
                    (value) => {
                      const plan = reservation.Plan
                      reservation.Plan = {
                        ...plan,
                        ExerciseCategories: value,
                      }

                      stepIndex++
                    }
                  "
                />
              </template>
            </KeepAlive>
            <template v-if="stepIndex === 6">
              <ReservationSummary :reservation="reservation" />
              <!-- <pre class="mt-2 w-[340px] rounded-md bg-slate-950 p-4"> -->
              <!--     <code class="text-white"> -->
              <!--         {{ JSON.stringify(reservation, null, 4) }} -->
              <!--     </code> -->
              <!-- </pre> -->
              <Button type="submit"> Submit </Button>
            </template>
          </div>
        </form>
      </Stepper>
    </div>
  </SignedIn>
</template>

<style scoped lang="scss"></style>
