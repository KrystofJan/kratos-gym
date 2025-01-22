<script setup lang="ts">
import { ref, onMounted, computed, watch, h } from 'vue';
import { 
    Machine,
} from '@/support';
import { GripHorizontal } from 'lucide-vue-next';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Checkbox,
    Button,
    toast,
    Step,
} from '@/components'
import { toTypedSchema } from '@vee-validate/zod';
import { useField } from 'vee-validate';
import { z } from 'zod';
import { useForm } from 'vee-validate'
import draggable from 'vuedraggable'

const formSchema = toTypedSchema(z.object({
  generate: z.boolean(),
  canDisturb: z.boolean(),
  continuous: z.boolean()
}))

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})
interface Props {
    selectedMachines: Machine[],
}

const props = defineProps<Props>();

const newSelectedMachines = ref<Machine[]>([])

const emit = defineEmits(['submit', 'prev']);

const builderText = ref({
    heading: 'Pick your machines',
    text: '<p>In this step you need to choose between our available machines</p>'
});

const onSubmit = handleSubmit(
    values => {
        emit('submit', newSelectedMachines.value)
    }
);

const prev = () => {
    emit('prev')
}

onMounted(() => {
    newSelectedMachines.value = props.selectedMachines
})

</script>

<template>
    <Step :builderText="builderText">
        <form class="w-full flex flex-col gap-4" @submit.prevent="onSubmit">
            <div class="flex flex-row justify-center gap-16 w-full">
                <draggable 
                  v-model="newSelectedMachines" 
                  group="people" 
                  @start="drag=true" 
                  @end="drag=false" 
                  item-key="id"
                  class="flex gap-2 flex-col w-1/3"
                  >
                  <template #item="{element}">
                    <div class="flex justify-between h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-grab focus:grabbing">
                        <span>
                            {{element.MachineName}}
                        </span>
                        <GripHorizontal />
                    </div>
                   </template>
                </draggable>
                <KeepAlive>
                <div class="w-1/3 flex flex-col gap-4">
                    <FormField v-slot="{ value, handleChange }" type="checkbox" name="generate">
                      <FormItem v-auto-animate class="grid grid-cols-2 -order-1 w-full items-center gap-2 space-y-0">
                        <FormLabel>Should we generate times for you?</FormLabel>
                        <FormControl>
                          <Checkbox :checked="value" @update:checked="handleChange" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ value, handleChange }" type="checkbox" name="canDisturb">
                      <FormItem v-auto-animate class="grid grid-cols-2 -order-1 w-full items-center gap-2 space-y-0">
                        <FormLabel>Can someone join you?</FormLabel>
                        <FormControl>
                          <Checkbox :checked="value" @update:checked="handleChange" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ value, handleChange }" type="checkbox" name="continuous">
                      <FormItem v-auto-animate class="grid grid-cols-2 -order-1 w-full items-center gap-2 space-y-0">
                        <FormLabel>Can there be gaps between your exercises? TODO: Add maximum gap length</FormLabel>
                        <FormControl>
                          <Checkbox :checked="value" @update:checked="handleChange" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                </div>
                </KeepAlive>
            </div>
            <div class="ml-auto flex flex-row gap-2">
                <Button @click="prev">
                    Prev
                </Button>

                <Button type="submit">
                    Next
                </Button>
            </div>
        </form>
    </Step>
</template>

