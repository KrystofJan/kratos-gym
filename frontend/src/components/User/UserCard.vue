<script setup lang="ts">
import { Account, UserRole, UserRoleOptions } from '@/support/types'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/shadcn/ui/card'

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/shadcn/ui/avatar'


const roleDictionary = new Map([
    ["c", "Customer"],
    ["t", "Trainer"],
    ["e", "Employee"],
    ["a", "Author"]
]);

interface Props {
    currentAccount: Account,
    role?: UserRole
}


const props = defineProps<Props>()

const handleRole = () => {
    switch (props.role) {
        case UserRoleOptions.AUTHOR: return roleDictionary.get("a");
        case UserRoleOptions.TRAINER: return roleDictionary.get("t");
        default: return roleDictionary.get(props.currentAccount.Role)
    }
}
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
                <CardDescription>{{ handleRole() }}</CardDescription>
            </div>
        </CardHeader>
        <CardContent v-if="!role">
            <ul>
                <li>Phone: {{ currentAccount.PhoneNumber ?? "-" }}</li>
                <li>Email: {{ currentAccount.Email }}</li>
                <li>Joinded on: {{ currentAccount.CreateDate.split("T")[0] }}</li>
                <li>Last online: {{ currentAccount.LastOnline.split("T")[0] }}</li>
                <li>Credits: {{ currentAccount.Credits }}</li>
                <li v-if="currentAccount.Address">Address:
                    {{ `${currentAccount.Address.Street} ${currentAccount.Address.BuildingNumber}
                    ${currentAccount.Address.City}` }}</li>
            </ul>
        </CardContent>
    </Card>
</template>


<style></style>
