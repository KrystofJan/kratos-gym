import { h, ref } from 'vue'
import { Button } from '@/components/shadcn/ui/button'
import type {
    ColumnDef,
} from '@tanstack/vue-table'
import { ExerciseType, Machine } from '@/support'

import { ArrowUpDown, ChevronDown } from 'lucide-vue-next'
import { Checkbox } from '@/components/shadcn/ui/checkbox'
import { DataGridActions } from '@/components/DataGrid'
import { MachineService } from '@/support/services/machine.service'
import { toast } from '@/components/shadcn/ui/toast'

export const values = ref<Machine[]>([])

export const columns: ColumnDef<Machine>[] = [
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
        accessorKey: 'MachineId',
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
                    h('span', { class: 'group' }, 'Machine id'),
                ]
            )
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-right font-medium' }, row.getValue('MachineId'))
        }
    },
    {
        accessorKey: 'MachineName',
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
                    h('span', { class: 'group' }, 'Name'),
                ]
            )
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-right font-medium' }, row.getValue('MachineName'))
        }
    },
    {
        accessorKey: 'MaxWeight',
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
                    h('span', { class: 'group' }, 'Maximum weight'),
                ]
            )
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-right font-medium' }, row.getValue('MaxWeight'))
        }
    },
    {
        accessorKey: 'MinWeight',
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
                    h('span', { class: 'group' }, 'Minimum weight'),
                ]
            )
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-right font-medium' }, row.getValue('MinWeight'))
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
        accessorKey: 'PopularityScore',
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
                    h('span', { class: 'group' }, 'Popularity score'),
                ]
            )
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-right font-medium' }, row.getValue('PopularityScore'))
        }
    },
    {
        accessorKey: 'ExerciseTypes',
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
                    h('span', { class: 'group' }, 'Exercise types'),
                ]
            )
        },
        cell: ({ row }) => {
            const value: ExerciseType[] = row.getValue('ExerciseTypes')
            let result = "N/A"
            if (value.length > 0) {
                result = value[0].TypeName
            }
            return h('div', { class: 'text-right font-medium' }, result)
        }
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const prop: Machine = row.original
            const deleteFunc = async (id: number) => {
                try {
                    const data = await new MachineService().DeleteMachine(id)
                    toast({
                        title: 'Successfully deleted machine',
                        description: `Reservation id: ${data.DeletedId}`
                    })
                    values.value = values.value.filter(x => x.MachineId !== data.DeletedId)
                    return row.index
                } catch (err) {
                    toast({
                        title: 'Error while deleting data',
                        description: h(`${err}`, { class: "text-red" })
                    })
                    return -1
                }
            }

            return h('div', { class: 'relative' }, h(DataGridActions, {
                id: prop.MachineId,
                deleteFunc,
            }
            ))
        },
    },
]

export async function deleteSelected(ids: number[]) {
    for (const id of ids) {
        try {
            const responseData = await new MachineService().DeleteMachine(id)
            values.value = values.value.filter(x => x.MachineId !== responseData.DeletedId)
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
