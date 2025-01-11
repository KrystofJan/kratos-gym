import { h, ref } from 'vue'
import type {
    ColumnDef,
} from '@tanstack/vue-table'
import { Account } from '@/support'

import { ArrowUpDown } from 'lucide-vue-next'
import {
    toast,
    DataGridActions,
    Checkbox,
    Button,
} from '@/components'

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
        accessorKey: 'AccountId',
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
                    h('span', { class: 'group' }, 'Account id'),
                ]
            )
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-right font-medium' }, row.getValue('AccountId'))
        }
    },
    {
        accessorKey: 'FirstName',
        header: ({ column }) => {
            return h(
                Button,
                {
                    class: 'group text-left',
                    variant: 'ghost',
                    onClick: () => {
                        return column.toggleSorting(column.getIsSorted() === 'asc')
                    },
                },
                () => [
                    h(ArrowUpDown, { class: 'opacity-0 group-hover:opacity-100 mr-2 h-4 w-4' }),
                    h('span', { class: 'group' }, 'Fist Name'),
                ]
            )
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-right font-medium' }, row.getValue('FistName'))
        }
    },
    {
        accessorKey: 'LastName',
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
                    h('span', { class: 'group' }, 'Last Name'),
                ]
            )
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-right font-medium' }, row.getValue('LastName'))
        }
    },
    {
        accessorKey: 'Role',
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
                    h('span', { class: 'group' }, 'Role'),
                ]
            )
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-right font-medium' }, row.getValue('Role'))
        }
    },
    {
        accessorKey: 'AvgTimeTaken',
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
                    h('span', { class: 'group' }, 'Average time'),
                ]
            )
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-right font-medium' }, row.getValue('AvgTimeTaken'))
        }
    },
    {
        accessorKey: 'Email',
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
                    h('span', { class: 'group' }, 'Email'),
                ]
            )
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-right font-medium' }, row.getValue('Email'))
        }
    },
    {
        accessorKey: 'PhoneNumber',
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
                    h('span', { class: 'group' }, 'Phone number'),
                ]
            )
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-right font-medium' }, row.getValue('PhoneNumber'))
        }
    },
    {
        accessorKey: 'Login',
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
                    h('span', { class: 'group' }, 'Login'),
                ]
            )
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-right font-medium' }, row.getValue('Login'))
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

            return h('div', { class: 'relative' }, h(DataGridActions, {
                id: prop.AccountId,
                editTableUrl: '/admin/account/edit',
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

