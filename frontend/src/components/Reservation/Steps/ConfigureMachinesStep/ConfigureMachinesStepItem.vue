<script setup lang="ts">
import { watch, computed, onMounted } from 'vue'
import { Time } from '@internationalized/date'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Checkbox,
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components'

import { Machine, TimeSuggestion } from '@/support'

interface Props {
  machine: Machine
  setFieldValue: (field: any, value: any) => void
  timeRecs: Map<number, TimeSuggestion>
  preloadedData: [Time, Time]
  generated: boolean
  wrongTime: boolean
  index: number
}

const props = defineProps<Props>()

const collision = computed(() => {
  for (const x of props.timeRecs.values()) {
    if (x.Previous.isColiding || x.Next.isColiding) {
      return true
    }
  }
  return false
})

const setPrevTime = (time: TimeSuggestion | undefined) => {
  if (!time) {
    throw new Error('Cannot set undefined prev time')
  }
  props.setFieldValue(
    `machinesInPlan.${props.index}.StartTime.hour`,
    time.Previous.time[0].hour
  )
  props.setFieldValue(
    `machinesInPlan.${props.index}.StartTime.minute`,
    time.Previous.time[0].minute
  )
  props.setFieldValue(
    `machinesInPlan.${props.index}.EndTime.hour`,
    time.Previous.time[1].hour
  )
  props.setFieldValue(
    `machinesInPlan.${props.index}.EndTime.minute`,
    time.Previous.time[1].minute
  )
}

const setNextTime = (time: TimeSuggestion | undefined) => {
  if (!time) {
    throw new Error('Cannot set undefined next time')
  }
  props.setFieldValue(
    `machinesInPlan.${props.index}.StartTime.hour`,
    time.Next.time[0].hour
  )
  props.setFieldValue(
    `machinesInPlan.${props.index}.StartTime.minute`,
    time.Next.time[0].minute
  )
  props.setFieldValue(
    `machinesInPlan.${props.index}.EndTime.hour`,
    time.Next.time[1].hour
  )
  props.setFieldValue(
    `machinesInPlan.${props.index}.EndTime.minute`,
    time.Next.time[1].minute
  )
}

const reactivePreloadedData = computed(() => props.preloadedData)

// Watch for changes in preloadedData and update form values
watch(
  reactivePreloadedData,
  (newPreloadedData) => {
    console.log('watching')
    if (!newPreloadedData || !props.generated) return

    props.setFieldValue(
      `machinesInPlan.${props.index}.MachineId`,
      props.machine.MachineId
    )

    props.setFieldValue(
      `machinesInPlan.${props.index}.StartTime.hour`,
      newPreloadedData[0].hour || 0
    )
    props.setFieldValue(
      `machinesInPlan.${props.index}.StartTime.minute`,
      newPreloadedData[0].minute || 0
    )
    props.setFieldValue(
      `machinesInPlan.${props.index}.EndTime.hour`,
      newPreloadedData[1].hour || 0
    )
    props.setFieldValue(
      `machinesInPlan.${props.index}.EndTime.minute`,
      newPreloadedData[1].minute || 0
    )
  },
  { immediate: true }
)

function formatNextTime(time: TimeSuggestion | undefined): string {
  if (!time) {
    return ''
  }

  const nextHours = time.Next.time[0].hour.toString().padStart(2, '0')
  const nextMinutes = time.Next.time[0].minute.toString().padStart(2, '0')
  const nextHoursTwo = time.Next.time[1].hour.toString().padStart(2, '0')
  const nextMinutesTwo = time.Next.time[1].minute.toString().padStart(2, '0')

  return `${nextHours}:${nextMinutes} - ${nextHoursTwo}:${nextMinutesTwo}`
}

function formatPrevTime(time: TimeSuggestion | undefined): string {
  if (!time) {
    return ''
  }
  const prevHours = time.Previous.time[0].hour.toString().padStart(2, '0')
  const prevMinutes = time.Previous.time[0].minute.toString().padStart(2, '0')
  const prevHoursTwo = time.Previous.time[1].hour.toString().padStart(2, '0')
  const prevMinutesTwo = time.Previous.time[1].minute
    .toString()
    .padStart(2, '0')

  return `${prevHours}:${prevMinutes} - ${prevHoursTwo}:${prevMinutesTwo}`
}

onMounted(() => {
  props.setFieldValue(
    `machinesInPlan.${props.index}.MachineId`,
    props.machine.MachineId
  )

  props.setFieldValue(
    `machinesInPlan.${props.index}.StartTime.hour`,
    props.preloadedData[0].hour || 0
  )
  props.setFieldValue(
    `machinesInPlan.${props.index}.StartTime.minute`,
    props.preloadedData[0].minute || 0
  )
  props.setFieldValue(
    `machinesInPlan.${props.index}.EndTime.hour`,
    props.preloadedData[1].hour || 0
  )
  props.setFieldValue(
    `machinesInPlan.${props.index}.EndTime.minute`,
    props.preloadedData[1].minute || 0
  )
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-center md:text-left">{{
        machine.MachineName
      }}</CardTitle>
      <CardDescription class="text-center md:text-left"> </CardDescription>
    </CardHeader>

    <CardContent>
      <FormField :name="`machinesInPlan[${index}]`">
        <FormItem>
          <FormField v-slot="{ value }" :name="`machinesInPlan[${index}].Reps`">
            <FormItem>
              <FormLabel>Reps</FormLabel>
              <NumberField
                class="gap-2"
                :min="1"
                :max="20"
                :default-value="6"
                :model-value="value"
                @update:model-value="
                  (v) => {
                    if (v) {
                      setFieldValue(`machinesInPlan[${index}].Reps`, v)
                    } else {
                      setFieldValue(`machinesInPlan[${index}].Reps`, undefined)
                    }
                  }
                "
              >
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <FormControl>
                    <NumberFieldInput />
                  </FormControl>
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>
              <FormDescription
                >Amount of repetitions in the set</FormDescription
              >
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ value }" :name="`machinesInPlan[${index}].Sets`">
            <FormItem>
              <FormLabel>Sets</FormLabel>
              <NumberField
                class="gap-2"
                :min="1"
                :max="15"
                :default-value="4"
                :model-value="value"
                @update:model-value="
                  (v) => {
                    if (v) {
                      setFieldValue(`machinesInPlan[${index}].Sets`, v)
                    } else {
                      setFieldValue(`machinesInPlan[${index}].Sets`, undefined)
                    }
                  }
                "
              >
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <FormControl>
                    <NumberFieldInput />
                  </FormControl>
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ value, handleChange }"
            type="checkbox"
            :name="`machinesInPlan[${index}].CanDisturb`"
          >
            <FormItem class="flex flex-row items-start gap-x-3 space-y-0 py-4">
              <FormControl>
                <Checkbox :checked="value" @update:checked="handleChange" />
              </FormControl>
              <FormLabel>Can you be disturbed?</FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>
          <div class="flex gap-8">
            <!-- make a field form group -->
            <FormField :name="`machinesInPlan[${index}].StartTime`">
              <FormItem>
                <FormLabel> Start Time </FormLabel>
                <div class="flex items-center gap-1">
                  <FormField
                    v-slot="{ value }"
                    :name="`machinesInPlan[${index}].StartTime.hour`"
                  >
                    <FormItem class="w-12">
                      <NumberField
                        :min="0"
                        :max="23"
                        :default-value="0"
                        :model-value="value"
                        @update:model-value="
                          (v) => {
                            if (v) {
                              setFieldValue(
                                `machinesInPlan[${index}].StartTime.hour`,
                                v
                              )
                            } else {
                              setFieldValue(
                                `machinesInPlan[${index}].StartTime.hour`,
                                undefined
                              )
                            }
                          }
                        "
                      >
                        <NumberFieldContent>
                          <FormControl>
                            <NumberFieldInput />
                          </FormControl>
                        </NumberFieldContent>
                      </NumberField>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <span class="text-xl">:</span>
                  <FormField
                    v-slot="{ value }"
                    :name="`machinesInPlan[${index}].StartTime.minute`"
                    class="w-4"
                  >
                    <FormItem class="w-12">
                      <NumberField
                        :min="0"
                        :max="59"
                        :default-value="0"
                        :model-value="value"
                        @update:model-value="
                          (v) => {
                            if (v) {
                              setFieldValue(
                                `machinesInPlan[${index}].StartTime.minute`,
                                v
                              )
                            } else {
                              setFieldValue(
                                `machinesInPlan[${index}].StartTime.minute`,
                                undefined
                              )
                            }
                          }
                        "
                      >
                        <NumberFieldContent>
                          <FormControl>
                            <NumberFieldInput />
                          </FormControl>
                        </NumberFieldContent>
                      </NumberField>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
              </FormItem>
            </FormField>

            <FormField :name="`machinesInPlan[${index}].EndTime`">
              <FormItem>
                <FormLabel> EndTime </FormLabel>
                <div class="flex items-center gap-1">
                  <FormField
                    v-slot="{ value }"
                    :name="`machinesInPlan[${index}].EndTime.hour`"
                  >
                    <FormItem class="w-12">
                      <NumberField
                        :min="0"
                        :max="23"
                        :default-value="0"
                        :model-value="value"
                        @update:model-value="
                          (v) => {
                            if (v) {
                              setFieldValue(
                                `machinesInPlan[${index}].EndTime.hour`,
                                v
                              )
                            } else {
                              setFieldValue(
                                `machinesInPlan[${index}].EndTime.hour`,
                                undefined
                              )
                            }
                          }
                        "
                      >
                        <NumberFieldContent>
                          <FormControl>
                            <NumberFieldInput />
                          </FormControl>
                        </NumberFieldContent>
                      </NumberField>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <span class="text-xl">:</span>
                  <FormField
                    v-slot="{ value }"
                    :name="`machinesInPlan[${index}].EndTime.minute`"
                    class="w-4"
                  >
                    <FormItem class="w-12">
                      <NumberField
                        :min="0"
                        :max="59"
                        :default-value="0"
                        :model-value="value"
                        @update:model-value="
                          (v) => {
                            if (v) {
                              setFieldValue(
                                `machinesInPlan[${index}].EndTime.minute`,
                                v
                              )
                            } else {
                              setFieldValue(
                                `machinesInPlan[${index}].EndTime.minute`,
                                0
                              )
                            }
                          }
                        "
                      >
                        <NumberFieldContent>
                          <FormControl>
                            <NumberFieldInput />
                          </FormControl>
                        </NumberFieldContent>
                      </NumberField>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
              </FormItem>
            </FormField>
          </div>
        </FormItem>
      </FormField>
    </CardContent>

    <CardFooter>
      <div class="h-16">
        <div v-if="timeRecs.get(machine.MachineId) !== undefined">
          <template v-if="!collision">
            <p class="text-red-200">
              Machine is occupied at this time, here are the free closest times
            </p>
            <a
              class="mr-4 time-link"
              @click.prevent="setPrevTime(timeRecs.get(machine.MachineId))"
              href="#"
            >
              {{ formatPrevTime(timeRecs.get(machine.MachineId)) }}
            </a>

            <a
              class="time-link"
              @click.prevent="setNextTime(timeRecs.get(machine.MachineId))"
              href="#"
            >
              {{ formatNextTime(timeRecs.get(machine.MachineId)) }}
            </a>
          </template>
          <template v-else>
            <span class="text-orange-200">
              Selected time is coliding with another one
            </span>
          </template>
        </div>
        <div v-else-if="wrongTime">
          <p class="text-red-200">
            Starting time needs to be before Ending time
          </p>
        </div>
      </div>
    </CardFooter>
  </Card>
</template>

<style lang="scss"></style>
