import * as React from 'react'
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/db'
import { stores } from '@/db/schema'
// import { env } from '@/env.js'
import type { SearchParams } from '@/types'
import { eq } from 'drizzle-orm'
import { DateRangePicker } from '@/components/app-logic/date-range-picker'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { ProductsTable } from '@/components/table/products-table'
import { getProductsTable } from '@/lib/actions/product'
import { getCategories } from '@/lib/actions/category'
import { Button, buttonVariants } from '@/components/ui/button'
import { Icons } from '@/components/app-ui/icons'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  // metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: 'Products',
  description: 'Manage your products',
}

interface ProductsPageProps {
  params: {
    storeId: string
  }
  searchParams: SearchParams
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const storeId = decodeURIComponent(params.storeId)

  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
    columns: {
      id: true,
      name: true,
    },
  })

  if (!store) {
    notFound()
  }

  const productsPromise = getProductsTable(searchParams, storeId)
  const categoriesPromise = getCategories()

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between'>
        <h2 className='text-2xl font-bold tracking-tight'>Products</h2>
        <DateRangePicker align='end' />
      </div>
      <Link
        href={`/dashboard/stores/${encodeURIComponent(storeId)}/products/new`}
        className={cn(
          buttonVariants({
            size: 'sm',
            variant: 'default',
          })
        )}
      >
        Create product
      </Link>
      <React.Suspense fallback={<DataTableSkeleton columnCount={6} />}>
        <ProductsTable
          categoriesPromise={categoriesPromise}
          promise={productsPromise}
          storeId={storeId}
        />
      </React.Suspense>
    </div>
  )
}
