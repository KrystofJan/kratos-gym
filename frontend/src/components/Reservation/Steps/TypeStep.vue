<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Step } from '.'
import { ExerciseCategory, ExerciseCategoryService } from '@/support'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot,
} from 'radix-vue'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@/components'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

const emit = defineEmits(['submit', 'prev'])
const types = ref<ExerciseCategory[]>([])

const fetchData = async () => {
  try {
    const data = await new ExerciseCategoryService().FetchAll({ limit: 100 })
    types.value = data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const schema = toTypedSchema(
  z.object({
    exerciseCategories: z.array(
      z.object({
        CategoryId: z.number(),
        CategoryName: z.string(),
      })
    ),
  })
)

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: schema,
})

const onSubmit = handleSubmit((value) => {
  console.log(value)
  emit('submit', value.exerciseCategories)
})

const prev = () => {
  emit('prev')
}
const builderText = ref({
  heading: 'Select category',
  text: '<p>And finally in this step you need to choose the category for this workout</p>',
})

const modelValue = ref<ExerciseCategory[]>([])
const open = ref(false)
const searchTerm = ref('')

const filteredCategories = computed(() =>
  types.value.filter(
    (i) => !modelValue.value.filter((j) => j.CategoryName === i.CategoryName)[0]
  )
)
onMounted(async () => {
  await fetchData()
})

const removeItem = (item: ExerciseCategory) => {
  modelValue.value = modelValue.value.filter(
    (x) => x.CategoryId !== item.CategoryId
  )
  setFieldValue(`exerciseCategories`, modelValue.value)
}
</script>

<template>
  <Step :builderText="builderText" :builderItemClasses="'BuilderItemGrid'">
    <form class="w-2/3 space-y-6" @submit="onSubmit">
      <FormField name="exerciseCategories">
        <FormItem>
          <FormLabel>Category</FormLabel>
          <FormControl>
            <TagsInput class="px-0 gap-0 w-80" :model-value="modelValue">
              <div class="flex gap-2 flex-wrap items-center px-3">
                <TagsInputItem
                  v-for="item in modelValue"
                  :key="item.CategoryId"
                  :value="item.CategoryName"
                >
                  <TagsInputItemText />
                  <TagsInputItemDelete @click="removeItem(item)" />
                </TagsInputItem>
              </div>

              <ComboboxRoot
                v-model="modelValue"
                v-model:open="open"
                v-model:search-term="searchTerm"
                class="w-full"
              >
                <ComboboxAnchor as-child>
                  <ComboboxInput placeholder="Category..." as-child>
                    <TagsInputInput
                      class="w-full px-3"
                      :class="modelValue.length > 0 ? 'mt-2' : ''"
                      @keydown.enter.prevent
                    />
                  </ComboboxInput>
                </ComboboxAnchor>

                <ComboboxPortal>
                  <ComboboxContent>
                    <CommandList
                      position="popper"
                      class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                    >
                      <CommandEmpty />
                      <CommandGroup>
                        <CommandItem
                          v-for="category in filteredCategories"
                          :key="category.CategoryId"
                          :value="category.CategoryName"
                          @select.prevent="
                            (ev) => {
                              modelValue.push(category)

                              setFieldValue(`exerciseCategories`, modelValue)
                              if (filteredCategories.length === 0) {
                                open = false
                              }
                            }
                          "
                        >
                          {{ category.CategoryName }}
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </ComboboxContent>
                </ComboboxPortal>
              </ComboboxRoot>
            </TagsInput>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="ml-auto flex flex-row gap-2">
        <Button @click="prev"> Prev </Button>

        <Button type="submit"> Next </Button>
      </div>
    </form>
  </Step>
</template>

<style lang="scss"></style>
