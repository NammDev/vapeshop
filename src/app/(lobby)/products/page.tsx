import { type Metadata } from 'next'
// import { env } from '@/env.js'
import type { SearchParams } from '@/types'
import { unstable_noStore as noStore } from 'next/cache'

import { getProducts } from '@/lib/actions/product'
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/app-ui/page-header'
import { Shell } from '@/components/app-ui/shell'
import { Products } from '@/components/app-logic/products'
import { productsSearchParamsSchema } from '@/lib/validations/params'
import { getStores } from '@/lib/actions/store'

export const metadata: Metadata = {
  //   metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: 'Products',
  description: 'Buy products from our stores',
}

interface ProductsPageProps {
  searchParams: SearchParams
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const {
    page,
    per_page,
    sort,
    categories,
    subcategories,
    price_range,
    store_ids,
    store_page,
    active,
  } = productsSearchParamsSchema.parse(searchParams)

  // Products transaction
  const pageAsNumber = Number(page)
  const fallbackPage = isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber
  const perPageAsNumber = Number(per_page)
  // Number of items per page
  const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber
  // Number of items to skip
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0

  noStore()
  const productsTransaction = await getProducts({
    limit,
    offset,
    sort,
    categories,
    subcategories,
    price_range,
    store_ids,
    active,
  })

  const pageCount = Math.ceil(productsTransaction?.count / limit)

  // Stores transaction
  const storesPageAsNumber = Number(store_page)
  const fallbackStoresPage =
    isNaN(storesPageAsNumber) || storesPageAsNumber < 1 ? 1 : storesPageAsNumber
  const storesLimit = 40
  const storesOffset = fallbackStoresPage > 0 ? (fallbackStoresPage - 1) * storesLimit : 0

  noStore()
  const storesTransaction = await getStores({
    limit: storesLimit,
    offset: storesOffset,
    sort: 'productCount.desc',
  })

  const storePageCount = Math.ceil(storesTransaction.count / storesLimit)

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size='sm'>Products</PageHeaderHeading>
        <PageHeaderDescription size='sm'>Buy products from our stores</PageHeaderDescription>
      </PageHeader>{' '}
      <Products
        products={productsTransaction.items}
        pageCount={pageCount}
        categories={Object.values(products.category.enumValues)}
        stores={storesTransaction.items}
        storePageCount={storePageCount}
      />
      {/* <AlertCard /> */}
    </Shell>
  )
}
