<script setup lang="ts">
import { Button } from '@/components/shadcn/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/shadcn/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-vue-next'
const props = defineProps<{
    id: number,
    deleteFunc: (id: number) => Promise<number>
}>()

const emit = defineEmits<{
    deleting: [rowIndex: number];
}>()

function copy(id: number) {
    navigator.clipboard.writeText(id.toString())
}


async function deleteEmit(id: number) {
    const result = await props.deleteFunc(id)
    if (result >= 0) {
        emit('deleting', result)
    }
}
</script>

<template>
    <DropdownMenu id="asdasd">
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="w-8 h-8 p-0">
                <span class="sr-only">Open menu</span>
                <MoreHorizontal class="w-4 h-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem @click="copy(id)">
                Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="deleteEmit(id)">Delete</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
