import { h, ref } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { Account, AccountService, Address } from '@/support'

import { ArrowUpDown } from 'lucide-vue-next'
import { toast, DataGridActions, Checkbox, Button } from '@/components'

export const values = ref<Account[]>([])

export const columns: ColumnDef<Account>[] = [
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
          h(ArrowUpDown, {
            class: 'opacity-0 group-hover:opacity-100 mr-2 h-4 w-4',
          }),
          h('span', { class: 'group' }, 'Account id'),
        ]
      )
    },
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right font-medium' },
        row.getValue('AccountId')
      )
    },
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
          h(ArrowUpDown, {
            class: 'opacity-0 group-hover:opacity-100 mr-2 h-4 w-4',
          }),
          h('span', { class: 'group' }, 'Fist Name'),
        ]
      )
    },
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right font-medium' },
        row.getValue('FirstName')
      )
    },
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
          h(ArrowUpDown, {
            class: 'opacity-0 group-hover:opacity-100 mr-2 h-4 w-4',
          }),
          h('span', { class: 'group' }, 'Last Name'),
        ]
      )
    },
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right font-medium' },
        row.getValue('LastName')
      )
    },
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
          h(ArrowUpDown, {
            class: 'opacity-0 group-hover:opacity-100 mr-2 h-4 w-4',
          }),
          h('span', { class: 'group' }, 'Role'),
        ]
      )
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-right font-medium' }, row.getValue('Role'))
    },
  },
  {
    accessorKey: 'Address',
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
          h('span', { class: 'group' }, 'Address'),
        ]
      )
    },
    cell: ({ row }) => {
      const address: Address = row.getValue('Address')
      return h(
        'div',
        { class: 'text-right font-medium' },
        `${address.Street}-${address.City}`
      )
    },
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
          h(ArrowUpDown, {
            class: 'opacity-0 group-hover:opacity-100 mr-2 h-4 w-4',
          }),
          h('span', { class: 'group' }, 'Email'),
        ]
      )
    },
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right font-medium' },
        row.getValue('Email')
      )
    },
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
          h(ArrowUpDown, {
            class: 'opacity-0 group-hover:opacity-100 mr-2 h-4 w-4',
          }),
          h('span', { class: 'group' }, 'Phone number'),
        ]
      )
    },
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right font-medium' },
        row.getValue('PhoneNumber')
      )
    },
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
          h(ArrowUpDown, {
            class: 'opacity-0 group-hover:opacity-100 mr-2 h-4 w-4',
          }),
          h('span', { class: 'group' }, 'Login'),
        ]
      )
    },
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right font-medium' },
        row.getValue('Login')
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const prop: Account = row.original
      const deleteFunc = async (id: number) => {
        try {
          const data = await new AccountService().Delete(id)
          toast({
            title: 'Successfully deleted machine',
            description: `Reservation id: ${data.DeletedId}`,
          })
          values.value = values.value.filter(
            (x) => x.AccountId !== data.DeletedId
          )
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
        { class: 'relative' },
        h(DataGridActions, {
          id: prop.AccountId,
          editTableUrl: '/admin/account/update/' + prop.AccountId,
          deleteFunc,
        })
      )
    },
  },
]

export async function deleteSelected(ids: number[]) {
  for (const id of ids) {
    try {
      const responseData = await new AccountService().Delete(id)
      values.value = values.value.filter(
        (x) => x.AccountId !== responseData.AccountId
      )

      toast({
        title: 'Deleted all seleceted rows',
        description: h('deleted rows: ${ids.join(", ").toString()}', {
          class: '',
        }),
      })
    } catch (err) {
      toast({
        title: 'Error while deleting data',
        description: h(`ADD ERROR`, { class: 'text-red' }),
      })
    }
  }
}
