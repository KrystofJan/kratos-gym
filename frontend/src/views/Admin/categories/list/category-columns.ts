import { h, ref } from 'vue'
import type {
    ColumnDef,
} from '@tanstack/vue-table'
import { ArrowUpDown } from 'lucide-vue-next'
import { Account, ExerciseCategory, ExerciseCategoryService } from '@/support'
import {
    toast,
    Button,
    Checkbox,
    DataGridActions,
} from '@/components'

export const values = ref<ExerciseCategory[]>([])

export const columns: ColumnDef<ExerciseCategory>[] = [
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
            const prop: ExerciseCategory = row.original
            const deleteFunc = async (id: number) => {
                try {
                    const data = await new ExerciseCategoryService().Delete(id)
                    toast({
                        title: 'Successfully deleted machine',
                        description: `Reservation id: ${data.DeletedId}`
                    })
                    values.value = values.value.filter(x => x.CategoryId !== data.DeletedId)
                    return row.index
                } catch (err) {
                    toast({
                        title: 'Error while deleting data',
                        description: h(`${err}`, { class: "text-red" })
                    })
                    return -1
                }
            }

            return h('div', { class: 'relative flex justify-end' }, h(DataGridActions, {
                id: prop.CategoryId,
                editTableUrl: '/admin/category/update/' + prop.CategoryId,
                deleteFunc,
            }))
        },
    },
]

export async function deleteSelected(ids: number[]) {
    for (const id of ids) {
        try {
            const responseData = await new ExerciseCategoryService().Delete(id)
            values.value = values.value.filter(x => x.CategoryId !== responseData.DeletedId)
        } catch (err) {
            toast({
                title: 'Error while deleting data',
                description: h(`ADD ERROR`, { class: "text-red" })
            })
        }
    }
    toast({
        title: 'Deleted all seleceted rows',
        description: h('deleted rows: ${ids.join(", ").toString()}', { class: "" })
    })
}

