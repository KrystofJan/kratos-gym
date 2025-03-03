import { h, ref } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import {
  Account,
  ExerciseCategory,
  Machine,
  Plan,
  PlanService,
} from '@/support'
import { ArrowUpDown /* ChevronDown */ } from 'lucide-vue-next'
import { Checkbox, Button, DataGridActions, toast } from '@/components'

export const values = ref<Plan[]>([])

export const columns: ColumnDef<Plan>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        checked: table.getIsAllPageRowsSelected(),
        'onUpdate:checked': (value: boolean) =>
          table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all',
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        'onUpdate:checked': (value: boolean) => {
          row.toggleSelected(!!value)
          return row
        },
        ariaLabel: 'Select row',
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'PlanId',
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
          h(ArrowUpDown, {
            class: 'opacity-0 group-hover:opacity-100 mr-2 h-4 w-4',
          }),
          h('span', { class: 'group' }, 'Plan Id'),
        ]
      )
    },
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right font-medium' },
        row.getValue('PlanId')
      )
    },
  },
  {
    accessorKey: 'PlanName',
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
          h(ArrowUpDown, {
            class: 'opacity-0 group-hover:opacity-100 mr-2 h-4 w-4',
          }),
          h('span', { class: 'group' }, 'Name'),
        ]
      )
    },
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right font-medium' },
        row.getValue('PlanName')
      )
    },
  },
  {
    accessorKey: 'User',
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
          h(ArrowUpDown, {
            class: 'opacity-0 group-hover:opacity-100 mr-2 h-4 w-4',
          }),
          h('span', { class: 'group' }, 'Author'),
        ]
      )
    },
    cell: ({ row }) => {
      const author: Account = row.getValue('User')
      return h(
        'div',
        { class: 'text-right font-medium' },
        `${author.FirstName[0]}. ${author.LastName}`
      )
    },
  },
  {
    accessorKey: 'Machines',
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
          h(ArrowUpDown, {
            class: 'opacity-0 group-hover:opacity-100 mr-2 h-4 w-4',
          }),
          h('span', { class: 'group' }, 'Machines'),
        ]
      )
    },
    cell: ({ row }) => {
      const machines: Machine[] = row.getValue('Machines')

      let result = 'N/A'
      if (machines.length > 0) {
        result = `${machines[0].MachineName}...`
      }
      return h('div', { class: 'text-right font-medium' }, result)
    },
  },
  {
    accessorKey: 'ExerciseCategories',
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
          h(ArrowUpDown, {
            class: 'opacity-0 group-hover:opacity-100 mr-2 h-4 w-4',
          }),
          h('span', { class: 'group' }, 'Categories'),
        ]
      )
    },
    cell: ({ row }) => {
      const categories: ExerciseCategory[] = row.getValue('ExerciseCategories')

      let result = 'N/A'
      if (categories.length > 0) {
        result = `${categories[0].CategoryName}...`
      }
      return h('div', { class: 'text-right font-medium' }, result)
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const prop: Plan = row.original
      const deleteFunc = async (id: number) => {
        try {
          const data = await new PlanService().Delete(id)
          toast({
            title: 'Successfully deleted plan',
            description: `Reservation id: ${data.DeletedId}`,
          })
          values.value = values.value.filter((x) => x.PlanId !== data.DeletedId)
          return row.index
        } catch (err) {
          toast({
            title: 'Error while deleting data',
            description: h(`${err}`, { class: 'text-red' }),
          })
          return -1
        }
      }

      return h(
        'div',
        { class: 'relative flex justify-end' },
        h(DataGridActions, {
          id: prop.PlanId,
          editTableUrl: '/admin/category/edit',
          deleteFunc,
        })
      )
    },
  },
]

export async function deleteSelected(ids: number[]) {
  for (const id of ids) {
    try {
      const responseData = await new PlanService().Delete(id)
      values.value = values.value.filter(
        (x) => x.PlanId !== responseData.DeletedId
      )
    } catch (err) {
      toast({
        title: 'Error while deleting data',
        description: h(`ADD ERROR`, { class: 'text-red' }),
      })
    }
  }
  toast({
    title: 'Deleted all seleceted rows',
    description: h('deleted rows: ${ids.join(", ").toString()}', { class: '' }),
  })
}
