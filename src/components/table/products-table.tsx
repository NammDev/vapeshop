'use client'

import * as React from 'react'
import Link from 'next/link'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

import { deleteProduct, getProductsTable } from '@/lib/actions/product'
import { type getCategories } from '@/lib/actions/category'
import { getErrorMessage } from '@/lib/handle-error'
import { formatDate, formatPrice } from '@/lib/utils'
import { useDataTable } from '@/hooks/use-data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'

interface ProductsTableProps {
  promise: ReturnType<typeof getProductsTable>
  categoriesPromise: ReturnType<typeof getCategories>
  storeId: string
}

type AwaitedProduct = Awaited<ReturnType<typeof getProductsTable>>['data'][0]

export function ProductsTable({ promise, categoriesPromise, storeId }: ProductsTableProps) {
  const { data, pageCount } = React.use(promise)
  const categories = React.use(categoriesPromise)

  const [isPending, startTransition] = React.useTransition()
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([])

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<AwaitedProduct, unknown>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value)
              setSelectedRowIds((prev) =>
                prev.length === data.length ? [] : data.map((row) => row.id)
              )
            }}
            aria-label='Select all'
            className='translate-y-[2px]'
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value)
              setSelectedRowIds((prev) =>
                value ? [...prev, row.original.id] : prev.filter((id) => id !== row.original.id)
              )
            }}
            aria-label='Select row'
            className='translate-y-[2px]'
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
      },
      {
        accessorKey: 'category',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Category' />,
        cell: ({ cell }) => {
          const category = cell.getValue() as string

          const existingCategory = categories.some((categoryData) => categoryData.name === category)

          if (!existingCategory) return null

          return (
            <Badge variant='outline' className='capitalize'>
              {category}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'price',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Price' />,
        cell: ({ cell }) => formatPrice(cell.getValue() as number),
      },
      {
        accessorKey: 'inventory',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Inventory' />,
      },
      {
        accessorKey: 'rating',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Rating' />,
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Created At' />,
        cell: ({ cell }) => formatDate(cell.getValue() as Date),
        enableColumnFilter: false,
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label='Open menu'
                variant='ghost'
                className='flex size-8 p-0 data-[state=open]:bg-muted'
              >
                <DotsHorizontalIcon className='size-4' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[160px]'>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/stores/${storeId}/products/${row.original.id}`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/product/${row.original.id}`}>View</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  startTransition(() => {
                    row.toggleSelected(false)

                    toast.promise(
                      deleteProduct({
                        id: row.original.id,
                        storeId,
                      }),
                      {
                        loading: 'Deleting...',
                        success: () => 'Product deleted successfully.',
                        error: (err: unknown) => getErrorMessage(err),
                      }
                    )
                  })
                }}
                disabled={isPending}
              >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [data, isPending, storeId]
  )

  function deleteSelectedRows() {
    toast.promise(
      Promise.all(
        selectedRowIds.map((id) =>
          deleteProduct({
            id,
            storeId,
          })
        )
      ),
      {
        loading: 'Deleting...',
        success: () => {
          setSelectedRowIds([])
          return 'Products deleted successfully.'
        },
        error: (err: unknown) => {
          setSelectedRowIds([])
          return getErrorMessage(err)
        },
      }
    )
  }

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields: [
      {
        value: 'name',
        label: 'Name',
      },
      {
        value: 'category',
        label: 'Category',
        // options: products.category.enumValues.map((category) => ({
        //   label: `${category.charAt(0).toUpperCase()}${category.slice(1)}`,
        //   value: category,
        // })),
      },
    ],
  })

  return <DataTable table={table} />
}
