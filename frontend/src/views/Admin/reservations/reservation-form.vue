<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router'
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import * as z from "zod"
import { AutoForm, Button } from '@/components'
import { ReservationService, Reservation, ReservationPost, FormType } from '@/support'
import {format} from 'date-fns'

const route = useRoute()


const reservationSchema = z.object({
    AmountOfPeople: z.number().min(1).max(5).default(1),
    ReservationTime: z.string().date(),
    PlanId: z.number().min(1),
    CustomerId: z.number().min(1),    
    TrainerId: z.number().min(1).optional(),
});

const form = useForm({
  validationSchema: toTypedSchema(reservationSchema),
})

const updateReservation = async (values: Record<string, any>) => {
    try{ 
        await new ReservationService().Update(values, reservation.value.ReservationId)
    } catch (err) {
        throw err
    }
};

const reservation = ref<Reservation | undefined>()

const handleSubmit = async (values: Record<string, any>) => {
    await updateReservation(values)
}

const fetchReservation = async (id: number) => {
    try {
        console.log(id)
        const data = await new ReservationService().FetchOne(id)
        reservation.value = data
    } catch (err) {
        console.error(err)
    }
}

watch(
    () => route.params.id,
    async (newId, oldId) => {
        await fetchReservation(Number(newId))
    }
)

onMounted(async () => {
    await fetchReservation(Number(route.params.id))

    if (reservation.value) {
        form.setFieldValue('AmountOfPeople', reservation.value.AmountOfPeople)
        form.setFieldValue('ReservationTime', format(reservation.value.ReservationTime, "yyyy-MM-dd"))
        form.setFieldValue('PlanId', reservation.value.Plan.PlanId)
        form.setFieldValue('CustomerId', reservation.value.Customer.AccountId)
        form.setFieldValue('TrainerId', reservation.value.Trainer.AccountId)
    }
});
</script>

<template>
    {{formType}}
        <AutoForm class="w-2/3 space-y-6" :form="form" :schema="reservationSchema" @submit="handleSubmit">
            <Button type="submit">
                Submit
            </Button>
        </AutoForm>
</template>


<style></style>
