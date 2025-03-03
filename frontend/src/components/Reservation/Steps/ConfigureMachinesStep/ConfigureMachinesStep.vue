<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Ref } from 'vue'
import { ConfigureMachinesStepItem } from '.'
import { RefreshCw } from 'lucide-vue-next'
import { Step } from '..'
import {
  Machine,
  Plan,
  PlanPost,
  PlanService,
  MachineService,
  MachinesInPlanPost,
  TimeSuggestion,
} from '@/support'
import { Button } from '@/components'
import { FieldArray } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { Time } from '@internationalized/date'

const emit = defineEmits(['submit', 'prev'])
interface Props {
  reservationTime?: Date
  selectedMachines: Machine[]
  amountOfPeople?: number
  preloadedData?: Map<number, [Time, Time]>[]
  generated: boolean
}

const timeRecs: Ref<Map<number, TimeSuggestion>> = ref(new Map())

const currentGeneratedIndex = ref(0)
const currentGeneration = computed(() => {
  return props.preloadedData?.[currentGeneratedIndex.value]
})
const props = defineProps<Props>()

const wrongTime = ref<Map<number, boolean>>(new Map())

const sortedSelectedMachines = computed(() => {
  if (
    !props.preloadedData ||
    !props.preloadedData[currentGeneratedIndex.value]
  ) {
    return props.selectedMachines
  }

  const currentGenData = props.preloadedData[currentGeneratedIndex.value]
  return Array.from(currentGenData.keys())
    .map((id) =>
      props.selectedMachines.find((machine) => machine.MachineId === id)
    )
    .filter(Boolean) as Machine[]
})

const builderText = ref({
  heading: 'Now pick time for each machine',
  text: "<p>In this step you need to pick a time and amount of work you'll be doing on this specific machine</p>",
})

const concurrentPlans = ref<Plan[]>([])
const schema = toTypedSchema(
  z.object({
    machinesInPlan: z
      .array(
        z
          .object({
            MachineId: z.number(),
            Reps: z.number().default(6),
            Sets: z.number().default(4),
            StartTime: z.object({
              hour: z.number().min(0).max(24).default(0),
              minute: z.number().min(0).max(59).default(0),
            }),
            EndTime: z.object({
              hour: z.number().min(0).max(24).default(0),
              minute: z.number().min(0).max(59).default(0),
            }),
            CanDisturb: z.boolean().default(false),
          })
          .refine(
            (data) => {
              const startTime = new Time(
                data.StartTime.hour,
                data.StartTime.minute
              )
              const endTime = new Time(data.EndTime.hour, data.EndTime.minute)

              return startTime < endTime
            },
            { message: 'Start time cannot be after End Time' }
          )
      )
      .refine((data) => {
        data.forEach((item, index) => {
          const startTime = new Time(item.StartTime.hour, item.StartTime.minute)
          const endTime = new Time(item.EndTime.hour, item.EndTime.minute)
          wrongTime.value.set(index, startTime >= endTime)
        })

        return true
      })
      .refine(
        async (data) => {
          timeRecs.value.clear()
          for (let i = 0; i < data.length; ++i) {
            const machineId = data[i].MachineId
            const startTime =
              data[i].StartTime.hour * 60 + data[i].StartTime.minute
            const endTime = data[i].EndTime.hour * 60 + data[i].EndTime.minute

            const concurrentMachines: MachinesInPlanPost[] =
              concurrentPlans.value
                .map((plan: PlanPost) => plan.Machines)
                .flat()
                .filter(
                  (machine) =>
                    machine.MachineId === props.selectedMachines[i].MachineId
                )

            // NOTE: Need to skip the time suggestion if the
            //   machine is not in the concurrent machines
            if (
              !concurrentMachines.map((x) => x.MachineId).includes(machineId)
            ) {
              continue
            }
            for (const machine of concurrentMachines) {
              const startMachineTime = machine.StartTime.split(':').map((x) =>
                Number(x)
              )
              const endMachineTime = machine.EndTime.split(':').map((x) =>
                Number(x)
              )
              const machineEndTime = endMachineTime[0] * 60 + endMachineTime[1]
              const machineStartTime =
                startMachineTime[0] * 60 + startMachineTime[1]
              const minEndTime =
                machineEndTime <= endTime ? machineEndTime : endTime
              const maxStartTime =
                machineStartTime >= startTime ? machineStartTime : startTime
              console.log(maxStartTime < minEndTime)
              console.log(maxStartTime)
              console.log(minEndTime)
              console.log(data[i].MachineId)

              if (maxStartTime < minEndTime) {
                const startTimeTime = new Time(
                  data[i].StartTime.hour,
                  data[i].StartTime.minute
                )
                const endTimeTime = new Time(
                  data[i].EndTime.hour,
                  data[i].EndTime.minute
                )
                await suggestTime(machine.MachineId, {
                  desired_date: props.reservationTime ?? new Date(),
                  desired_start_time: startTimeTime,
                  desired_end_time: endTimeTime,
                  amount_of_people: props.amountOfPeople || 1,
                  can_disturb: data[i].CanDisturb,
                })
                return false
              }
            }
          }

          return true
        },
        {
          message: 'Machines colide',
        }
      ),
  })
)

const fetchConcurrentPlans = async () => {
  concurrentPlans.value = []
  if (!props.reservationTime) {
    console.error("Didn't select reservation plan")
    return
  }

  for (const machine of props.selectedMachines) {
    try {
      const data = await new PlanService().FetchPlansOnDate({
        machine_id: machine.MachineId,
        date: props.reservationTime,
      })

      data.forEach((element: Plan) => {
        concurrentPlans.value.push(element)
      })
    } catch (err) {
      console.error('error fetching concurrent plans', err)
    }
  }
}

const suggestTime = async (
  id: number,
  vars: {
    desired_date: Date
    desired_start_time: Time
    desired_end_time: Time
    amount_of_people: number
    can_disturb: boolean
  }
) => {
  try {
    const data = await new MachineService().SuggestTime(id, vars)
    console.log(JSON.stringify(data))
    timeRecs.value.set(id, data)
  } catch (error) {
    console.error('Error fetching account:', error)
    timeRecs.value.delete(id)
  }
}

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: schema,
})

const onSubmit = handleSubmit((values) => {
  emit('submit', values.machinesInPlan)
})

const prev = () => {
  emit('prev')
}

const regenerate = () => {
  if (!props.generated || !props.preloadedData) return

  const maxIndex = props.preloadedData.length - 1
  currentGeneratedIndex.value =
    (currentGeneratedIndex.value + 1) % (maxIndex + 1)
}

onMounted(async () => {
  await fetchConcurrentPlans()
})
</script>

<template>
  <Step
    v-if="selectedMachines.length > 0"
    :builderText="builderText"
    builderItemClasses="flex-col"
  >
    <Button
      variant="outline"
      class="ml-auto flex gap-2"
      v-if="preloadedData && generated"
      @click.prevent="regenerate"
    >
      <span>Regenerate</span>
      <RefreshCw />
    </Button>
    <form class="justify-center flex flex-col gap-4" @submit="onSubmit">
      <div
        class="grid grid-cols-2 md:grid-cols-3 grid-auto-columns-1/2 md:grid-auto-columns-1/3 gap-4"
      >
        <FieldArray name="machinesInPlan">
          <div v-for="(machine, index) in sortedSelectedMachines" :key="index">
            <ConfigureMachinesStepItem
              :machine="machine"
              :set-field-value="setFieldValue"
              :index="index"
              :time-recs="timeRecs"
              :wrong-time="wrongTime.get(index) || false"
              :preloaded-data="
                preloadedData
                  ? currentGeneration?.get(machine.MachineId) || [
                      new Time(0, 0),
                      new Time(0, 0),
                    ]
                  : [new Time(0, 0), new Time(0, 0)]
              "
              :generated="generated"
            />
          </div>
          <!-- <FormMessage /> -->
        </FieldArray>
      </div>

      <div class="ml-auto flex flex-row gap-2">
        <Button @click="prev"> Prev </Button>

        <Button type="submit"> Next </Button>
      </div>
    </form>
  </Step>

  <!-- <pre> -->
  <!--     <code> -->
  <!--         {{ timeRecs }} -->
  <!--     </code> -->
  <!-- </pre> -->
</template>

<style lang="scss"></style>
