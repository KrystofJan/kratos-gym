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

interface Props {
    machine: Machine,
    setFieldValue: (field: any, value: any) => void,
    index: number
}

const props = defineProps<Props>()
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle class="text-center md:text-left">{{ machine.MachineName }}</CardTitle>
            <CardDescription class="text-center md:text-left">
            </CardDescription>
        </CardHeader>

        <CardContent>

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
                            <FormField v-slot="{ value }" :name="`machinesInPlan[${index}].EndTime.minute`" class="w-4">
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

        </CardContent>

    </Card>
</template>

<style lang="scss"></style>
