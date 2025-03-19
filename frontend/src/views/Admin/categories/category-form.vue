<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { AutoForm, Button, toast } from '@/components'
import { ExerciseCategory, ExerciseCategoryService, FormType } from '@/support'

const categorySchema = z.object({
  CategoryName: z.string().min(2).max(50),
})

const form = useForm({
  validationSchema: toTypedSchema(categorySchema),
})

const route = useRoute()

const createCategory = async (values: Record<string, any>) => {
  try {
    await new ExerciseCategoryService().Create({
      CategoryName: values['CategoryName'],
    })
    toast({
      title: 'Success',
      description: 'Successfully created category',
    })
  } catch (err) {
    throw err
  }
}

const updateCategory = async (values: Record<string, any>) => {
  if (category.value === undefined) {
    toast({ title: 'ERROR', description: 'Could not find reservation' })
    return
  }
  try {
    await new ExerciseCategoryService().Update(
      values,
      category.value.CategoryId
    )

    toast({
      title: 'Success',
      description: 'Successfully updated category',
    })
  } catch (err) {
    throw err
  }
}

const category = ref<ExerciseCategory | undefined>()
const formType = ref<FormType>(FormType.Create)

const handleSubmit = async (values: Record<string, any>) => {
  if (formType.value === FormType.Update) {
    console.log('updating')
    await updateCategory(values)
  } else {
    await createCategory(values)
  }
}

const fetchCategory = async (id: number) => {
  try {
    const data = await new ExerciseCategoryService().FetchOne(id)
    category.value = data
  } catch (err) {
    console.error(err)
  }
}

watch(
  () => route.params.id,
  async (newId, _) => {
    await fetchCategory(Number(newId))
  }
)

onMounted(async () => {
  await fetchCategory(Number(route.params.id))

  if (category.value) {
    form.setFieldValue('CategoryName', category.value.CategoryName)
    formType.value = FormType.Update
  } else {
    formType.value = FormType.Create
  }
})
</script>

<template>
  <AutoForm
    class="w-2/3 space-y-6"
    :form="form"
    :schema="categorySchema"
    @submit="handleSubmit"
  >
    <Button type="submit"> Submit </Button>
  </AutoForm>
</template>
