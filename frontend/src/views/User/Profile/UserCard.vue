<script setup lang="ts">
import { Account } from '../../../support/types'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../../../components/shadcn/ui/card'

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '../../../components/shadcn/ui/avatar'


const roleDictionary = {
    "c": "Customer",
    "t": "Trainer",
    "e": "Employee"
};

interface Props {
    currentAccount: Account
}
const props = defineProps<Props>()
</script>

<template>
    <Card>
        <CardHeader class="grid grid-cols-2 gap-4 content-center">
            <Avatar class="w-32 h-32">
                <AvatarImage :src="currentAccount.ProfilePictureUrl" alt="@radix-vue" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div class="align-middle h-fit w-fit my-auto">
                <CardTitle>
                    {{ `${currentAccount.FirstName} ${currentAccount.LastName}` }}
                </CardTitle>
                <CardDescription>{{ roleDictionary[currentAccount.Role] }}</CardDescription>
            </div>
        </CardHeader>
        <CardContent>
            <ul>
                <li>Phone: {{ currentAccount.PhoneNumber ?? "-" }}</li>
                <li>Email: {{ currentAccount.Email }}</li>
                <li>Joinded on: {{ currentAccount.CreateDate.split("T")[0] }}</li>
                <li>Last online: {{ currentAccount.LastOnline.split("T")[0] }}</li>
                <li>Credits: {{ currentAccount.Credits }}</li>
                <li>Address:
                    {{ `${currentAccount.Address.Street} ${currentAccount.Address.BuildingNumber}
                    ${currentAccount.Address.City}` }}</li>
            </ul>
        </CardContent>
    </Card>
</template>


<style></style>
