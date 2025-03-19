<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Time } from '@internationalized/date'
import { Machine, PlanGenerator, PlanGeneratorService } from '@/support'
import { GripHorizontal } from 'lucide-vue-next'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Checkbox,
  Button,
  Step,
  NumberField,
  NumberFieldContent,
  NumberFieldInput,
  toast,
} from '@/components'
import { toTypedSchema } from '@vee-validate/zod'
import { useField } from 'vee-validate'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import draggable from 'vuedraggable'

interface Props {
  selectedMachines: Machine[]
  amountOfPeople: number
  reservationDate: Date
}

const props = defineProps<Props>()

const formSchema = toTypedSchema(
  z.object({
    generate: z.boolean().default(false),
    time: z
      .object({
        hour: z.number().min(0).max(24).default(0),
        minute: z.number().min(0).max(59).default(0),
      })
      .optional(),
    collisions: z.boolean().default(false),
    continuous: z.boolean().default(false),
  })
)

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: formSchema,
})

const newSelectedMachines = ref<Machine[]>([])

const emit = defineEmits(['submit', 'prev', 'generated'])

const builderText = ref({
  heading: 'Pick your machines',
  text: '<p>In this step you need to choose between our available machines</p>',
})

const onSubmit = handleSubmit(async (values) => {
  if (!values.generate) {
    emit('submit', newSelectedMachines.value)
    return
  }
  const planGeneratorConfig: PlanGenerator = {
    time: new Time(values.time?.hour, values.time?.minute),
    collisions: values.collisions,
    continuous: values.continuous,
    machine_ids: newSelectedMachines.value.map((x) => x.MachineId),
    amount_of_people: props.amountOfPeople,
    reservation_date: props.reservationDate,
  }

  try {
    const [map, data] = await new PlanGeneratorService().Generate(
      planGeneratorConfig
    )

    emit('generated', { data, map })
  } catch (err) {
    toast({
      title: 'Error',
      description: (err as Error).message,
    })
  }
})

const prev = () => {
  emit('prev')
}

onMounted(() => {
  newSelectedMachines.value = props.selectedMachines
})

const { value: isDisabled } = useField('generate')
</script>

<template>
  <Step :builderText="builderText">
    <form class="w-full flex flex-col gap-4" @submit.prevent="onSubmit">
      <div class="flex flex-row justify-center gap-16 w-full">
        <draggable
          v-model="newSelectedMachines"
          group="people"
          @start="drag = true"
          @end="drag = false"
          enabled="false"
          item-key="id"
          v-if="!isDisabled"
          class="flex gap-2 flex-col w-1/3"
        >
          <template #item="{ element }">
            <div
              class="flex justify-between h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-grab focus:cursor-grabbing"
            >
              <span>
                {{ element.MachineName }}
              </span>
              <GripHorizontal />
            </div>
          </template>
        </draggable>

        <div
          v-else
          class="flex gap-2 flex-col w-1/3 opacity-50 cursor-not-allowed"
        >
          <template v-for="element in newSelectedMachines">
            <div
              class="flex justify-between h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <span>
                {{ element.MachineName }}
              </span>
              <GripHorizontal />
            </div>
          </template>
        </div>

        <KeepAlive>
          <div class="w-1/3 flex flex-col gap-4">
            <FormField
              v-slot="{ value, handleChange }"
              type="checkbox"
              name="generate"
            >
              <FormItem
                v-auto-animate
                class="grid grid-cols-2 -order-1 w-full items-center gap-2 space-y-0"
              >
                <FormLabel>Should we generate times for you?</FormLabel>
                <FormControl>
                  <Checkbox :checked="value" @update:checked="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="time" v-if="isDisabled">
              <FormItem>
                <FormLabel>Start time</FormLabel>
                <div class="flex items-center gap-1">
                  <FormField v-slot="{ value }" name="time.hour">
                    <FormItem class="w-12">
                      <NumberField
                        :min="0"
                        :max="23"
                        :default-value="0"
                        :model-value="value"
                        @update:model-value="
                          (v?: number) => {
                            if (v) {
                              setFieldValue(`time.hour`, v)
                            } else {
                              setFieldValue(`time.hour`, undefined)
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
                  <FormField v-slot="{ value }" name="time.minute">
                    <FormItem class="w-12">
                      <NumberField
                        :min="0"
                        :max="60"
                        :default-value="0"
                        :model-value="value"
                        @update:model-value="
                          (v?: number) => {
                            if (v) {
                              setFieldValue(`time.minute`, v)
                            } else {
                              setFieldValue(`time.minute`, undefined)
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

            <FormField
              v-slot="{ value, handleChange }"
              type="checkbox"
              name="collisions"
              v-if="isDisabled"
            >
              <FormItem
                v-auto-animate
                class="grid grid-cols-2 -order-1 w-full items-center gap-2 space-y-0"
              >
                <FormLabel>Can someone join you?</FormLabel>
                <FormControl>
                  <Checkbox :checked="value" @update:checked="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- <FormField -->
            <!--   v-slot="{ value, handleChange }" -->
            <!--   type="checkbox" -->
            <!--   name="continuous" -->
            <!--   v-if="isDisabled" -->
            <!-- > -->
            <!--   <FormItem -->
            <!--     v-auto-animate -->
            <!--     class="grid grid-cols-2 -order-1 w-full items-center gap-2 space-y-0" -->
            <!--   > -->
            <!--     <FormLabel -->
            <!--       >Can there be gaps between your exercises? TODO: Add maximum -->
            <!--       gap length -->
            <!--     </FormLabel> -->
            <!--     <FormControl> -->
            <!--       <Checkbox :checked="value" @update:checked="handleChange" /> -->
            <!--     </FormControl> -->
            <!--     <FormMessage /> -->
            <!--   </FormItem> -->
            <!-- </FormField> -->
          </div>
        </KeepAlive>
      </div>
      <div class="ml-auto flex flex-row gap-2">
        <Button @click="prev"> Prev </Button>

        <Button type="submit"> Next </Button>
      </div>
    </form>
  </Step>
</template>
