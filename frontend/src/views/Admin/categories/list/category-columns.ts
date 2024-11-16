import { h, ref } from 'vue'
import { Button } from '@/components/shadcn/ui/button'
import type {
    ColumnDef,
} from '@tanstack/vue-table'
import { Account } from '@/support'

import { ArrowUpDown, ChevronDown } from 'lucide-vue-next'
import { Checkbox } from '@/components/shadcn/ui/checkbox'
import { DataGridActions } from '@/components/DataGrid'
import { AccountService } from '@/support/services/account.service'
import { toast } from '@/components/shadcn/ui/toast'

export const values = ref<Account[]>([])

export const columns: ColumnDef<Account>[] = [
    {
        id: 'select',
        header: ({ table }) => h(Checkbox, {
            'checked': table.getIsAllPageRowsSelected(),
            'onUpdate:checked': (value: boolean) => table.toggleAllPageRowsSelected(!!value),
            'ariaLabel': 'Select all',
        }),
        cell: ({ row }) => h(Checkbox, {
            'checked': row.getIsSelected(),
            'onUpdate:checked': (value: boolean) => {
                row.toggleSelected(!!value)
                return row
            },
            'ariaLabel': 'Select row',
        }),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'CategoryId',
        header: ({ column }) => {
            return h(
                Button,
                {
                    class: 'group text-right',
                    variant: 'ghost',
                    onClick: () => {
                        return column.toggleSorting(column.getIsSorted() === 'asc')
                    },
                },
                () => [
                    h(ArrowUpDown, { class: 'opacity-0 group-hover:opacity-100 mr-2 h-4 w-4' }),
                    h('span', { class: 'group' }, 'Category Id'),
                ]
            )
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-right font-medium' }, row.getValue('CategoryId'))
        }
    },
    {
        accessorKey: 'CategoryName',
        header: ({ column }) => {
            return h(
                Button,
                {
                    class: 'group text-right',
                    variant: 'ghost',
                    onClick: () => {
                        return column.toggleSorting(column.getIsSorted() === 'asc')
                    },
                },
                () => [
                    h(ArrowUpDown, { class: 'opacity-0 group-hover:opacity-100 mr-2 h-4 w-4' }),
                    h('span', { class: 'group' }, 'Name'),
                ])
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-right font-medium' }, row.getValue('CategoryName'))
        }
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const prop: Account = row.original
            const deleteFunc = async (id: number) => {
                toast({
                    title: 'Cannot delete accounts'
                })
                return -1
            }

            return h('div', { class: 'relative flex justify-end' }, h(DataGridActions, {
                id: prop.AccountId,
                editTableUrl: '/admin/category/edit',
                deleteFunc,
            }))
        },
    },
]

export async function deleteSelected(ids: number[]) {
    toast({
        title: 'Cannot delete accounts'
    })
}

