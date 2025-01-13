import { h, ref } from 'vue'
import type {
    ColumnDef,
} from '@tanstack/vue-table'
import { ArrowUpDown } from 'lucide-vue-next'
import {
    toast,
    Button,
    Checkbox,
    DataGridActions
} from '@/components'

import { ExerciseCategory, ExerciseType } from '@/support'

export const values = ref<ExerciseType[]>([])

export const columns: ColumnDef<ExerciseType>[] = [
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
        accessorKey: 'ExerciseTypeId',
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
                    h('span', { class: 'group' }, 'ExerciseType Id'),
                ]
            )
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-right font-medium' }, row.getValue('ExerciseTypeId'))
        }
    },
    {
        accessorKey: 'ExerciseTypeName',
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
            return h('div', { class: 'text-right font-medium' }, row.getValue('TypeName'))
        }
    },
    {
        accessorKey: 'Category',
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
                    h('span', { class: 'group' }, 'Category'),
                ])
        },
        cell: ({ row }) => {
            const category: ExerciseCategory = row.getValue('Category')

            return h('div', { class: 'text-right font-medium' }, category.CategoryName)
        }
    },
    {
        accessorKey: 'BodyPart',
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
                    h('span', { class: 'group' }, 'BodyPart'),
                ])
        },
        cell: ({ row }) => {
            const bodyPart: string = row.getValue('Machines')

            return h('div', { class: 'text-right font-medium' }, bodyPart)
        }
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const prop: ExerciseType = row.original
            const deleteFunc = async (id: number) => {
                toast({
                    title: 'Cannot delete accounts'
                })
                return -1
            }

            return h('div', { class: 'relative flex justify-end' }, h(DataGridActions, {
                id: prop.ExerciseTypeId,
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

