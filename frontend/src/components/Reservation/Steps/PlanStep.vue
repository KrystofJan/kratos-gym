<script setup lang="ts">
import { Account } from '@/support';
import { ref, computed } from 'vue';
import Step from '../Step.vue';
import NumberInput from '@/components/Form/NumberInput/NumberInput.vue';
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
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/shadcn/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/shadcn/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-vue-next'

import { Button } from '@/components/shadcn/ui/button'
import { Calendar } from '@/components/shadcn/ui/calendar'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { Input } from '@/components/shadcn/ui/input'
import { AccountService, BuilderText, UserRoleOptions } from '@/support';
import { onMounted } from 'vue';

interface Props {
    setFieldValue: (field: any, value: any) => void
}

const props = defineProps<Props>()

const emit = defineEmits(['next']);

const builderText: BuilderText = {
    heading: 'Pick a name and time for your plan!',
    text: '<p>In this step you need to pick a name for your workout plan along with the date when you want to have make a reservation and amount of people included in your reservation</p>'
};

const trainers = ref<Account[]>([])

const fetchData = async () => {
    try {
        const data = await new AccountService().fetchAccountByRole(UserRoleOptions.TRAINER)
        trainers.value = data
        console.log(data)
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


const selectedTrainer = ref<Account | null>(null);

const selectTrainer = (trainer: Account) => {
    selectedTrainer.value = trainer;
    props.setFieldValue('trainer', trainer);
};

const getFullName = (trainer: Account | null) => {
    return trainer ? `${trainer.FirstName} ${trainer.LastName}` : '';
};
onMounted(async () => {
    await fetchData()
})

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
        <FormField v-slot="{ value }" name="trainer">
            <FormItem>
                <FormLabel>Trainer</FormLabel>
                <Popover>
                    <PopoverTrigger as-child>
                        <FormControl>
                            <Button variant="outline" role="combobox"
                                :class="cn('w-[200px] justify-between', !selectedTrainer ? 'text-muted-foreground' : '')">
                                {{ selectedTrainer ? selectedTrainer.FirstName + ' ' + selectedTrainer.LastName :
                                    'Select trainer...' }}
                                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent class="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search trainer..." />
                            <CommandEmpty>No trainers found.</CommandEmpty>
                            <CommandList>
                                <CommandGroup>
                                    <CommandItem v-for="trainer in trainers" :key="trainer.AccountId"
                                        :value="`${trainer.FirstName} ${trainer.LastName}`"
                                        @select="selectTrainer(trainer)">
                                        <Check
                                            :class="cn('mr-2 h-4 w-4', trainer.AccountId === selectedTrainer?.AccountId ? 'opacity-100' : 'opacity-0')" />
                                        {{ `${trainer.FirstName} ${trainer.LastName}` }}
                                    </CommandItem>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <FormMessage />
            </FormItem>
        </FormField>
    </Step>


</template>

<style lang="scss"></style>
