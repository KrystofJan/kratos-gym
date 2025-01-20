<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router'
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import * as z from "zod"
import { AutoForm, Button } from '@/components'
import { FormType, ExerciseType, ExerciseTypeService } from '@/support'

const route = useRoute()


const typeSchema = z.object({
    TypeName: z.string().min(2).max(50).describe("Name"),
    CategoryId: z.number().min(1).describe("Category id"),
    BodyPart: z.string().min(2).max(50),
});

const form = useForm({
  validationSchema: toTypedSchema(typeSchema),
})

const createExerciseType = async (values: Record<string, any>) => {
    try{ 
        await new ExerciseTypeService().Create(values)
    } catch (err) {
        throw err
    }
};


const updateExerciseType = async (values: Record<string, any>) => {
    try{ 
        await new ExerciseTypeService().Update(values, type.value.ExerciseTypeId)
    } catch (err) {
        throw err
    }
};


const type = ref<ExerciseType | undefined>()
const formType = ref<FormType>(FormType.Create)

const handleSubmit = async (values: Record<string, any>) => {
    if (formType.value === FormType.Update) {
        console.log("updating")
        await updateExerciseType(values)
    } else {
        await createExerciseType(values)
    }
}

const fetchExerciseType = async (id: number) => {
    try {
        console.log(id)
        const data = await new ExerciseTypeService().FetchOne(id)
        type.value = data
    } catch (err) {
        console.error(err)
    }
}

watch(
    () => route.params.id,
    async (newId, oldId) => {
        await fetchExerciseType(Number(newId))
    }
)

onMounted(async () => {
    await fetchExerciseType(Number(route.params.id))


    if (type.value) {
        form.setFieldValue('TypeName', type.value.TypeName)
        form.setFieldValue('CategoryId', type.value.Category.CategoryId)
        form.setFieldValue('BodyPart', type.value.BodyPart)
        formType.value = FormType.Update 
    } else {
        formType.value = FormType.Create
    }
});
</script>

<template>
    {{formType}}
        <AutoForm class="w-2/3 space-y-6" :form="form" :schema="typeSchema" @submit="handleSubmit">
            <Button type="submit">
                Submit
            </Button>
        </AutoForm>
</template>


<style></style>
