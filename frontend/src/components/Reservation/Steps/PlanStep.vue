<script setup lang="ts">
import { ref } from 'vue';
import Step from '../Step.vue';
import NumberInput from '@/components/Form/NumberInput/NumberInput.vue';
import { reservation } from '@/store/ReservationStore';
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/shadcn/ui/popover'

import { Button } from '@/components/shadcn/ui/button'
import { Calendar } from '@/components/shadcn/ui/calendar'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { Input } from '@/components/shadcn/ui/input'
import { TypedSchema } from 'vee-validate';

interface Props {
    setFieldValue: (field: any, value: any) => void
}

const props = defineProps<Props>()

const emit = defineEmits(['next']);

const builderText = ref({
    heading: 'Pick a name and time for your plan!',
    text: '<p>In this step you need to pick a name for your workout plan along with the date when you want to have make a reservation and amount of people included in your reservation</p>'
});

const showButton = ref(true);

const clickHandle = () => {
    emit('next');
    showButton.value = false;
}

</script>

<template>
    <Step :builderText="builderText">

        <FormField v-slot="{ componentField }" name="planName">
            <FormItem>
                <FormLabel>Plan name</FormLabel>
                <FormControl>
                    <Input type="text" placeholder="Training123" v-bind="componentField" />
                </FormControl>
                <FormDescription>
                    This will be the name of your plan
                </FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ value }" name="amountOfPeople">
            <FormItem>
                <FormLabel>Amount of people</FormLabel>
                <NumberField class="gap-2" :min="1" :max="11" :model-value="value" @update:model-value="(v) => {
                    if (v) {
                        setFieldValue('amountOfPeople', v)
                    }
                    else {
                        setFieldValue('amountOfPeople', undefined)
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
                <FormDescription>
                    This will be the amount of people in the reservation
                </FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField, value }" name="arrivalDate">
            <FormItem class="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                    <PopoverTrigger as-child>
                        <FormControl>
                            <Button variant="outline" :class="cn(
                                'w-[240px] ps-3 text-start font-normal',
                                !value && 'text-muted-foreground',
                            )">
                                <span>{{ value ? format(value, "PPP") : "Pick a date" }}</span>
                                <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent class="p-0">
                        <!-- TODO: Make this work -->
                        <Calendar v-bind="componentField" />
                    </PopoverContent>
                </Popover>
                <FormDescription>
                    Date of arival
                </FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>
    </Step>


</template>

<style lang="scss"></style>
