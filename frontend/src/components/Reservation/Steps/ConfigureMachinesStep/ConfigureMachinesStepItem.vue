<script setup lang="ts">
import { Machine } from '@/support';
import { TypedSchema } from 'vee-validate';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/shadcn/'
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/shadcn/ui/form'

import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
} from '@/components/shadcn/ui/number-field'
import { TimeSuggestion } from '@/support';

interface Props {
    machine: Machine,
    setFieldValue: (field: any, value: any) => void,
    timeRecs: Map<number, TimeSuggestion>,
    index: number,
}

const props = defineProps<Props>()


const setPrevTime = (time: TimeSuggestion) => {
    props.setFieldValue(`machinesInPlan.${props.index}.StartTime.hour`, time.Previous[0].hour)
    props.setFieldValue(`machinesInPlan.${props.index}.StartTime.minute`, time.Previous[0].minute)
    props.setFieldValue(`machinesInPlan.${props.index}.EndTime.hour`, time.Previous[1].hour)
    props.setFieldValue(`machinesInPlan.${props.index}.EndTime.minute`, time.Previous[1].minute)
}

const setNextTime = (time: TimeSuggestion) => {
    props.setFieldValue(`machinesInPlan.${props.index}.StartTime.hour`, time.Next[0].hour)
    props.setFieldValue(`machinesInPlan.${props.index}.StartTime.minute`, time.Next[0].minute)
    props.setFieldValue(`machinesInPlan.${props.index}.EndTime.hour`, time.Next[1].hour)
    props.setFieldValue(`machinesInPlan.${props.index}.EndTime.minute`, time.Next[1].minute)
}

function formatNextTime(time: TimeSuggestion | undefined): string {
    if (!time) {
        return ""
    }

    const nextHours = time.Next[0].hour.toString().padStart(2, "0");
    const nextMinutes = time.Next[0].minute.toString().padStart(2, "0");
    const nextHoursTwo = time.Next[1].hour.toString().padStart(2, "0");
    const nextMinutesTwo = time.Next[1].minute.toString().padStart(2, "0");

    return `${nextHours}:${nextMinutes} - ${nextHoursTwo}:${nextMinutesTwo}`;
}

function formatPrevTime(time: TimeSuggestion | undefined): string {
    if (!time) {
        return ""
    }
    const prevHours = time.Previous[0].hour.toString().padStart(2, "0");
    const prevMinutes = time.Previous[0].minute.toString().padStart(2, "0");
    const prevHoursTwo = time.Previous[1].hour.toString().padStart(2, "0");
    const prevMinutesTwo = time.Previous[1].minute.toString().padStart(2, "0");

    return `${prevHours}:${prevMinutes} - ${prevHoursTwo}:${prevMinutesTwo}`;
}

</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle class="text-center md:text-left">{{ machine.MachineName }}</CardTitle>
            <CardDescription class="text-center md:text-left">
            </CardDescription>
        </CardHeader>

        <CardContent>
            <FormField v-slot="{ value }" :name="`machinesInPlan[${index}]`">
                <FormItem>
                    <FormField v-slot="{ value }" :name="`machinesInPlan[${index}].Reps`">
                        <FormItem>
                            <FormLabel>Reps</FormLabel>
                            <NumberField class="gap-2" :min="1" :max="20" :default-value="6" :model-value="value"
                                @update:model-value="(v) => {
                                    if (v) {
                                        setFieldValue(`machinesInPlan[${index}].Reps`, v)
                                    }
                                    else {
                                        setFieldValue(`machinesInPlan[${index}].Reps`, undefined)
                                    }
                                }">
                                <NumberFieldContent>
                                    <NumberFieldDecrement />
                                    <FormControl>
                                        <NumberFieldInput />
                                    </FormControl>
                                    <NumberFieldIncrement />
                                </NumberFieldContent>
                            </NumberField>
                            <FormDescription>Amount of repetitions in the set</FormDescription>
                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <FormField v-slot="{ value }" :name="`machinesInPlan[${index}].Sets`">
                        <FormItem>
                            <FormLabel>Sets</FormLabel>
                            <NumberField class="gap-2" :min="1" :max="15" :default-value="4" :model-value="value"
                                @update:model-value="(v) => {
                                    if (v) {
                                        setFieldValue(`machinesInPlan[${index}].Sets`, v)
                                    }
                                    else {
                                        setFieldValue(`machinesInPlan[${index}].Sets`, undefined)
                                    }
                                }">
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


                    <div class="flex gap-8">
                        <!-- make a field form group -->
                        <FormField v-slot="{ value }" :name="`machinesInPlan[${index}].StartTime`">
                            <FormItem>
                                <FormLabel>
                                    Start Time
                                </FormLabel>
                                <div class="flex items-center gap-1">
                                    <FormField v-slot="{ value }" :name="`machinesInPlan[${index}].StartTime.hour`">
                                        <FormItem class="w-12">
                                            <NumberField :min="0" :max="23" :default-value="0" :model-value="value"
                                                @update:model-value="(v) => {
                                                    if (v) {
                                                        setFieldValue(`machinesInPlan[${index}].StartTime.hour`, v)
                                                    }
                                                    else {
                                                        setFieldValue(`machinesInPlan[${index}].StartTime.hour`, undefined)
                                                    }
                                                }">
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
                                    <FormField v-slot="{ value }" :name="`machinesInPlan[${index}].StartTime.minute`"
                                        class="w-4">
                                        <FormItem class="w-12">
                                            <NumberField :min="0" :max="59" :default-value="0" :model-value="value"
                                                @update:model-value="(v) => {
                                                    if (v) {
                                                        setFieldValue(`machinesInPlan[${index}].StartTime.minute`, v)
                                                    }
                                                    else {
                                                        setFieldValue(`machinesInPlan[${index}].StartTime.minute`, undefined)
                                                    }
                                                }">
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

                        <FormField v-slot="{ value }" :name="`machinesInPlan[${index}].EndTime`">
                            <FormItem>
                                <FormLabel>
                                    EndTime
                                </FormLabel>
                                <div class="flex items-center gap-1">
                                    <FormField v-slot="{ value }" :name="`machinesInPlan[${index}].EndTime.hour`">
                                        <FormItem class="w-12">
                                            <NumberField :min="0" :max="23" :default-value="0" :model-value="value"
                                                @update:model-value="(v) => {
                                                    if (v) {
                                                        setFieldValue(`machinesInPlan[${index}].EndTime.hour`, v)
                                                    }
                                                    else {
                                                        setFieldValue(`machinesInPlan[${index}].EndTime.hour`, undefined)
                                                    }
                                                }">
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
                                    <FormField v-slot="{ value }" :name="`machinesInPlan[${index}].EndTime.minute`"
                                        class="w-4">
                                        <FormItem class="w-12">
                                            <NumberField :min="0" :max="59" :default-value="0" :model-value="value"
                                                @update:model-value="(v) => {
                                                    if (v) {
                                                        setFieldValue(`machinesInPlan[${index}].EndTime.minute`, v)
                                                    }
                                                    else {
                                                        setFieldValue(`machinesInPlan[${index}].EndTime.minute`, undefined)
                                                    }
                                                }">
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

                    <Formssage />

                </FormItem>
            </FormField>

        </CardContent>

        <CardFooter>
            <div :class="{ 'opacity-0': timeRecs.get(machine.MachineId) === undefined }">
                <p>Machine is occupid at this time, here are the free closest times</p>
                <a class="mr-4 time-link" @click.prevent="setPrevTime(timeRecs.get(machine.MachineId))" href="#">
                    {{ formatPrevTime(timeRecs.get(machine.MachineId)) }}
                </a>

                <a class="time-link" @click.prevent="setNextTime(timeRecs.get(machine.MachineId))" href="#">
                    {{ formatNextTime(timeRecs.get(machine.MachineId)) }}
                </a>
            </div>
        </CardFooter>
    </Card>
</template>

<style lang="scss"></style>
