<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Check, ChevronsUpDown, GalleryVerticalEnd, Search } from 'lucide-vue-next'
import { Terminal } from 'lucide-vue-next'

// Import components from the custom library
import {} from '@/components/shadcn/ui/breadcrumb'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Label,
    Separator,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from '@/components'

import { SignedIn, SignedOut, useUser } from 'vue-clerk'


import { currentAccount } from "@/store/accountStore"
import { UserRoleOptions } from '@/support'

interface NavLink {
    title: string
    url: string
    items: NavLink[]
    isActive?: boolean
}

interface MainNav {
    navMain: NavLink[]
}

const data = ref<MainNav>({
    navMain: [
        {
            title: 'Home',
            url: '/admin',
            items: [

                { title: 'Dashboard', url: '/dashboard', isActive: true, items: [] },
            ]
        },
        {
            title: 'Machines',
            url: '/admin/machine',
            items: [
                { title: 'Machine list', url: '/list', isActive: false, items: [] },
                { title: 'Add a new machine', url: '/create', isActive: false, items: [] },
            ],
        },
        {
            title: 'Accounts',
            url: '/admin/account',
            items: [
                { title: 'Account list', url: '/list', isActive: false, items: [] },
            ],
        },
        {
            title: 'Exercise Categories',
            url: '/admin/category',
            items: [
                { title: 'Category List', url: '/list', isActive: false, items: [] },
                { title: 'Create a category', url: '/create', isActive: false, items: [] },
            ],
        },
        {
            title: 'Exercise types',
            url: '/admin/type',
            items: [
                { title: 'Exercise type list', url: '/list', isActive: false, items: [] },
                { title: 'Create an exercise type', url: '/create', isActive: false, items: [] },
            ],
        },
        {
            title: 'Plans',
            url: '/admin/plan',
            items: [
                { title: 'Plan list', url: '/list', isActive: false, items: [] },
                { title: 'Plan presets', url: '#', isActive: false, items: [] },
            ],
        },
        {
            title: 'Reservations',
            url: '/admin/reservation',
            items: [
                { title: 'Reservation list', url: '/list', isActive: false, items: [] },
            ],
        },
    ],
})

const search = ref('')
const activeCategory = computed(() => data.value.navMain.find(item => item.items.some(subItem => subItem.isActive)))
const activeLink = computed(() => activeCategory.value?.items.find(item => item.isActive) || {})

// Update switchLink to reset all isActive flags and set the clicked link to active
const switchLink = (link: NavLink) => {
    data.value.navMain.forEach(category => {
        category.items.forEach(item => {
            item.isActive = item === link
        })
    })
}

</script>

<template>

    <SignedOut>
        <Alert>
            <Terminal class="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                You need to be logged in !
            </AlertDescription>
        </Alert>
        <div class="ErrorMessage ErrorMessage--notLogedIn MarginedComponent">
        </div>
    </SignedOut>

    <SignedIn>
        <SidebarProvider v-if="currentAccount && currentAccount.Role === UserRoleOptions.EMPLOYEE">
            <Sidebar>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <h1 class="font-semibold p-2">Administration</h1>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup v-for="item in data.navMain" :key="item.title">
                        <SidebarGroupLabel>{{ item.title }}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem v-for="subItem in item.items" :key="subItem.title">
                                    <SidebarMenuButton :class="{ 'text-slate-50': subItem.isActive }" as-child>
                                        <router-link :to="item.url + subItem.url" @click="switchLink(subItem)">
                                            {{ subItem.title }}
                                        </router-link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarRail />
            </Sidebar>

            <SidebarInset>
                <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger class="-ml-1" />
                    <Separator orientation="vertical" class="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem class="hidden md:block">
                                <router-link :to="'/admin'" as-child>
                                    <BreadcrumbLink>Administration</BreadcrumbLink>
                                </router-link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator class="hidden md:block" />
                            <BreadcrumbItem class="hidden md:block">
                                <BreadcrumbLink>
                                    {{ activeCategory?.title || 'Category' }}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator class="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{{ activeLink?.title || 'Link' }}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                <router-view />
            </SidebarInset>
        </SidebarProvider>
        <Alert v-else>
            <Terminal class="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                You need to be an employee
            </AlertDescription>
        </Alert>
        <div class="ErrorMessage ErrorMessage--notLogedIn MarginedComponent">
        </div>

    </SignedIn>
</template>
