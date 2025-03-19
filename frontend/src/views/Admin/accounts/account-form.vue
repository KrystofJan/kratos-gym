<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { AutoForm, Button, toast } from '@/components'
import {
  AccountService,
  AddressService,
  UserRoleOptions,
  Account,
  roleCharMap,
} from '@/support'

const accountSchema = z.object({
  FirstName: z.string().min(1).max(255),
  LastName: z.string().min(1).max(255),
  Role: z.enum(Object.keys(UserRoleOptions)),
  Email: z.string().email(),
  PhoneNumber: z.string().optional(),
  IsActive: z.boolean(),
  Credits: z.number(),
  Login: z.string(),
  ClerkId: z.string(),
  ProfilePictureUrl: z.string().url().optional(),
  Address: z.object({
    Street: z.string(),
    City: z.string(),
    PostalCode: z.string(),
    Country: z.string(),
    BuildingNumber: z.string(),
    ApartmentNumber: z.string(),
  }),
})

const form = useForm({
  validationSchema: toTypedSchema(accountSchema),
})

const route = useRoute()

const updateAccount = async (values: Record<string, any>) => {
  if (account.value === undefined) {
    toast({ title: 'ERROR', description: 'Could not find accountNorFound' })
    return
  }

  try {
    if (account.value.Address !== undefined) {
      new AddressService().Update(
        values['Address'],
        account.value.Address.AddressId || 0
      )

      toast({
        title: 'Success',
        description: 'Successfully updated accounts address',
      })
    }
  } catch (err) {
    toast({ title: 'Error', description: 'Internal server error' })
    throw err
  }

  values['Role'] = values['Role'].slice(0)[0].toLowerCase()

  try {
    await new AccountService().UpdateAccount(values, account.value.AccountId)
    toast({ title: 'Success', description: 'Successfully updated account' })
  } catch (err) {
    toast({ title: 'Error', description: 'Internal server error' })
    throw err
  }
}

const account = ref<Account | undefined>()

const fetchAccount = async (id: number) => {
  try {
    const data = await new AccountService().FetchOne(id)
    account.value = data
  } catch (err) {
    console.error(err)
  }
}

watch(
  () => route.params.id,
  async (newId, _) => {
    await fetchAccount(Number(newId))
  }
)

onMounted(async () => {
  await fetchAccount(Number(route.params.id))

  if (account.value) {
    form.setFieldValue('FirstName', account.value.FirstName)
    form.setFieldValue('LastName', account.value.LastName)
    form.setFieldValue('Role', roleCharMap.get(account.value.Role))
    form.setFieldValue('Email', account.value.Email)
    form.setFieldValue('PhoneNumber', account.value.PhoneNumber)
    form.setFieldValue('IsActive', Boolean(account.value.IsActive))
    form.setFieldValue('Address', account.value.Address)
    form.setFieldValue('Credits', account.value.Credits)
    form.setFieldValue('Login', account.value.Login)
    form.setFieldValue('ClerkId', account.value.ClerkId)
    form.setFieldValue('ProfilePictureUrl', account.value.ProfilePictureUrl)
  }
})
</script>

<template>
  <AutoForm
    class="w-2/3 space-y-6"
    :form="form"
    :schema="accountSchema"
    @submit="updateAccount"
  >
    <Button type="submit"> Submit </Button>
  </AutoForm>
</template>
