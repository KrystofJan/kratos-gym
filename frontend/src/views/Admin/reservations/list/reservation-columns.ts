import { h, ref } from 'vue'
import { Button } from '@/components/shadcn/ui/button'
import type {
    ColumnDef,
} from '@tanstack/vue-table'
import { Account, ExerciseCategory, Machine, Reservation } from '@/support'
import { ArrowUpDown, ChevronDown } from 'lucide-vue-next'
import { Checkbox } from '@/components/shadcn/ui/checkbox'
import { DataGridActions } from '@/components/DataGrid'
import { toast } from '@/components/shadcn/ui/toast'
import { Plan } from '@/support'

export const values = ref<Reservation[]>([])

export const columns: ColumnDef<Reservation>[] = [
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
        accessorKey: 'ReservationId',
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
                    h('span', { class: 'group' }, 'Reservation Id'),
                ]
            )
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-right font-medium' }, row.getValue('ReservationId'))
        }
    },
    {
        accessorKey: 'AmountOfPeople',
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
                    h('span', { class: 'group' }, 'AmountOfPeople'),
                ])
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-right font-medium' }, row.getValue('AmountOfPeople'))
        }
    },
    {
        accessorKey: 'ReservationTime',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    class: 'group text-right h-full w-full',
                    onClick: () => {
                        return column.toggleSorting(column.getIsSorted() === 'asc')
                    },
                },
                () => [
                    h(ArrowUpDown, { class: 'opacity-0 group-hover:opacity-100 mr-2 h-4 w-4' }),
                    h('span', { class: 'group' }, 'ReservationTime'),
                ])
        },
        cell: ({ row }) => {
            const category: Date = row.getValue('ReservationTime')

            return h('div', { class: 'text-right font-medium' }, category)
        }
    },
    {
        accessorKey: 'Customer',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    class: 'group text-right h-full w-full',
                    onClick: () => {
                        return column.toggleSorting(column.getIsSorted() === 'asc')
                    },
                },
                () => [
                    h(ArrowUpDown, { class: 'opacity-0 group-hover:opacity-100 mr-2 h-4 w-4' }),
                    h('span', { class: 'group' }, 'ReservationTime'),
                ])
        },
        cell: ({ row }) => {
            const category: Account = row.getValue('Customer')

            return h('div', { class: 'text-right font-medium' }, category.LastName)
        }
    },
    {
        accessorKey: 'Trainer',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    class: 'group text-right h-full w-full',
                    onClick: () => {
                        return column.toggleSorting(column.getIsSorted() === 'asc')
                    },
                },
                () => [
                    h(ArrowUpDown, { class: 'opacity-0 group-hover:opacity-100 mr-2 h-4 w-4' }),
                    h('span', { class: 'group' }, 'ReservationTime'),
                ])
        },
        cell: ({ row }) => {
            const category: Account = row.getValue('Trainer')

            let result = "NA"
            if (category) {
                result = category.LastName
            }
            return h('div', { class: 'text-right font-medium' }, result)
        }
    },
    {
        accessorKey: 'Plan',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    class: 'group text-right h-full w-full',
                    onClick: () => {
                        return column.toggleSorting(column.getIsSorted() === 'asc')
                    },
                },
                () => [
                    h(ArrowUpDown, { class: 'opacity-0 group-hover:opacity-100 mr-2 h-4 w-4' }),
                    h('span', { class: 'group' }, 'ReservationTime'),
                ])
        },
        cell: ({ row }) => {
            const category: Plan | undefined = row.getValue('Plan')

            return h('div', { class: 'text-right font-medium' }, category?.PlanName)
        }
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const prop: Reservation = row.original
            const deleteFunc = async (id: number) => {
                toast({
                    title: 'Cannot delete accounts'
                })
                return -1
            }

            return h('div', { class: 'relative flex justify-end' }, h(DataGridActions, {
                id: prop.ReservationId,
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

