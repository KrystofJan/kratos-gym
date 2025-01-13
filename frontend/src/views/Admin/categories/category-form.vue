<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { toTypedSchema } from "@vee-validate/zod"
import * as z from "zod"
import { AutoForm, Button } from '@/components'
import { ExerciseCategoryService } from '@/support'

const categorySchema = z.object({
    Name: z.string().min(2).max(50)
});

const createCategory = async (values: Record<string, any>) => {
    try{ 
        await new ExerciseCategoryService().CreateExerciseCategory({ CategoryName: values["Name"] })
    } catch (err) {
        throw err
    }
};

</script>

<template>
        <AutoForm class="w-2/3 space-y-6" :schema="categorySchema" @submit="createCategory">
            <Button type="submit">
                Submit
            </Button>
        </AutoForm>
</template>


<style></style>
