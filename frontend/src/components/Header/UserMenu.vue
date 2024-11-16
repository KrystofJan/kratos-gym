<script setup lang="ts">
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '../../components/shadcn/ui/dropdown-menu/'
import { Button } from '../../components/shadcn/ui/button/'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '../../components/shadcn/ui/avatar/'

import { SignedOut, SignInButton, SignUpButton, SignedIn, SignOutButton } from 'vue-clerk'
import { currentAccount } from "../../store/accountStore"
import { UserRoleOptions } from '@/support'

</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="relative h-8 w-8 rounded-full">
                <Avatar class="h-8 w-8 bg-tertiary">
                    <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                    <AvatarFallback>
                        <svg xmlns="http://www.w3.org/2000/svg" class="text-foreground" width=16 height=16
                            viewBox="0 0 448 512">
                            <path fill="currentColor"
                                d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
                        </svg>
                    </AvatarFallback>
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56" align="end">
            <SignedIn>
                <DropdownMenuLabel class="font-normal flex">
                    <div class="flex flex-col space-y-1">
                        <p class="text-sm font-medium leading-none">
                            {{ currentAccount.FirstName + " " + currentAccount.LastName }}
                        </p>
                        <p class="text-xs leading-none text-muted-foreground">
                            {{ currentAccount.Email }}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem class="p-0">
                    <router-link to="/profile" class="py-1.5 px-2  w-full h-full">Profile</router-link>
                </DropdownMenuItem>

                <DropdownMenuItem class="p-0">
                    <router-link to="/profile" class="py-1.5 px-2  w-full h-full">Settings</router-link>
                </DropdownMenuItem>
                <DropdownMenuItem class="p-0" v-if="currentAccount.Role === UserRoleOptions.EMPLOYEE">
                    <router-link to="/admin" class="py-1.5 px-2  w-full h-full">Administration</router-link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <SignOutButton class="w-full h-full" />
                </DropdownMenuItem>

            </SignedIn>
            <SignedOut>
                <DropdownMenuItem>
                    <SignInButton class="w-full h-full " />
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <SignUpButton class="w-full h-full" />
                </DropdownMenuItem>
            </SignedOut>

        </DropdownMenuContent>
    </DropdownMenu>
</template>


<style></style>
