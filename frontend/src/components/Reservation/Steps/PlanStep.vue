<script setup lang="ts">
import { onMounted, h, ref, computed } from 'vue';
import { z } from 'zod';
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod';
import { parse, format } from 'date-fns';
import { cn } from '@/lib/utils'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import {
    NumberInput,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
    Button,
    Calendar,
    Input,
    toast,
    Step,
} from '@/components'

import { 
    Check,
    ChevronsUpDown 
} from 'lucide-vue-next'

import { 
    CalendarDate, 
    DateFormatter, 
    getLocalTimeZone, 
    parseDate, 
    today 
} from '@internationalized/date'

import { 
    AccountService, 
    BuilderText, 
    UserRoleOptions,
    Account,
} from '@/support';

const emit = defineEmits(['submit']);

const builderText: BuilderText = {
    heading: 'Pick a name and time for your plan!',
    text: '<p>In this step you need to pick a name for your workout plan along with the date when you want to have make a reservation and amount of people included in your reservation</p>'
};

const trainers = ref<Account[]>([])

const schema = toTypedSchema(z.object({
    planName: z.string().min(5).max(50),
    amountOfPeople: z.number().min(1).max(5).default(1),
    arrivalDate: z.string().date(),
    trainer: z.object({
        AccountId: z.number(),
        FirstName: z.string(),
        LastName: z.string(),
    }).optional(),
}));


const { handleSubmit, setFieldValue, values } = useForm({
    validationSchema: schema,
})


const val = computed({
    get: () => values.arrivalDate ? parseDate(values.arrivalDate) : undefined,
    set: (value: CalendarDate) => {
        console.log(value)
        return parse(
            `${value.year}-${value.month}-${value.day}`,
            "yyyy-MM-dd",
            new Date()
        ).toString()
    }
})


const fetchData = async () => {
    try {
        const data = await new AccountService().fetchAccountByRole(UserRoleOptions.TRAINER)
        trainers.value = data
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


const selectedTrainer = ref<Account | null>(null);

const selectTrainer = (trainer: Account) => {
    selectedTrainer.value = trainer;
    setFieldValue('trainer', trainer);
};

const getFullName = (trainer: Account | null) => {
    return trainer ? `${trainer.FirstName} ${trainer.LastName}` : '';
};

const onSubmit = handleSubmit(
    values => { // TODO:
        emit('submit', values)
    }
)

onMounted(async () => {
    await fetchData()
})
const placeholder = ref()

</script>

<template>
    <Step :builderText="builderText">
        <form class="w-2/3 space-y-6 justify-center flex flex-col" @submit="onSubmit">
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

            <FormField name="arrivalDate">
                <FormItem class="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                        <PopoverTrigger as-child>
                            <FormControl>
                                <Button variant="outline" :class="cn(
                                    'w-[240px] ps-3 text-start font-normal',
                                    !val && 'text-muted-foreground',
                                )">
                                    <span>{{ val ? format(val.toString(), "PPP") : "Pick a date" }}</span>
                                    <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent class="p-0">
                            <!-- TODO: Make this work -->
                            <Calendar v-model:placeholder="placeholder" v-model="val"
                                :min-value="today(getLocalTimeZone())" @update:model-value="(v) => {
                                    if (v) {
                                        setFieldValue('arrivalDate', v.toString())
                                    }
                                    else {
                                        setFieldValue('arrivalDate', undefined)
                                    }
                                }" />
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
            <Button type="submit">
                Next
            </Button>
        </form>
    </Step>


</template>

<style lang="scss"></style>
