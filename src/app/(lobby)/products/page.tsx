import { type Metadata } from 'next'
// import { env } from '@/env.js'
import type { SearchParams } from '@/types'
import { getProducts } from '@/lib/actions/product'
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/app-ui/page-header'
import { Shell } from '@/components/app-ui/shell'
import { getStores } from '@/lib/actions/store'

export const metadata: Metadata = {
  // metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: 'Products',
  description: 'Buy products from our stores',
}

interface ProductsPageProps {
  searchParams: SearchParams
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [
    { data: productData, pageCount: productPageCount },
    { data: storeData, pageCount: storePageCount },
  ] = await Promise.all([getProducts(searchParams), getStores(searchParams)])

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size='sm'>Products</PageHeaderHeading>
        <PageHeaderDescription size='sm'>Buy products from our stores</PageHeaderDescription>
      </PageHeader>
    </Shell>
  )
}
