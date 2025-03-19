<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { AutoForm, Button, toast } from '@/components'
import { MachineService, Machine, FormType } from '@/support'

const route = useRoute()

const machineSchema = z.object({
  MachineName: z.string().min(2).max(50).describe('Name'),
  MaxWeight: z.number().min(0).max(500).describe('Max weight'),
  MinWeight: z.number().min(0).max(500),
  MaxPeople: z.number().min(1).max(6),
  AvgTimeTaken: z.number().min(0).max(900),
})

const form = useForm({
  validationSchema: toTypedSchema(machineSchema),
})

const createMachine = async (values: Record<string, any>) => {
  try {
    await new MachineService().CreateMachine(values as Machine)
    toast({
      title: 'Success',
      description: 'Successfully created machine',
    })
  } catch (err) {
    throw err
  }
}

const updateMachine = async (values: Record<string, any>) => {
  if (machine.value === undefined) {
    toast({ title: 'ERROR', description: 'Could not find reservation' })
    return
  }
  try {
    await new MachineService().UpdateMachine(values, machine.value.MachineId)

    toast({
      title: 'Success',
      description: 'Successfully updated machine',
    })
  } catch (err) {
    throw err
  }
}

const machine = ref<Machine | undefined>()
const formType = ref<FormType>(FormType.Create)

const handleSubmit = async (values: Record<string, any>) => {
  if (formType.value === FormType.Update) {
    console.log('updating')
    await updateMachine(values)
  } else {
    await createMachine(values)
  }
}

const fetchMachine = async (id: number) => {
  try {
    console.log(id)
    const data = await new MachineService().FetchMachine(id)
    machine.value = data
  } catch (err) {
    console.error(err)
  }
}

watch(
  () => route.params.id,
  async (newId, _) => {
    await fetchMachine(Number(newId))
  }
)

onMounted(async () => {
  await fetchMachine(Number(route.params.id))

  if (machine.value) {
    form.setFieldValue('MachineName', machine.value.MachineName)
    form.setFieldValue('MaxWeight', machine.value.MaxWeight)
    form.setFieldValue('MinWeight', machine.value.MinWeight)
    form.setFieldValue('MaxPeople', machine.value.MaxPeople)
    form.setFieldValue('AvgTimeTaken', machine.value.AvgTimeTaken)
    formType.value = FormType.Update
  } else {
    formType.value = FormType.Create
  }
})
</script>

<template>
  {{ formType }}
  <AutoForm
    class="w-2/3 space-y-6"
    :form="form"
    :schema="machineSchema"
    @submit="handleSubmit"
  >
    <Button type="submit"> Submit </Button>
  </AutoForm>
</template>

<style></style>
