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
import { Products } from '@/components/app-logic/products'
import { getCategories } from '@/lib/actions/category'
import { getSubcategoriesByCategory } from '@/lib/actions/sub-category'

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

  const categoryData = await getCategories()
  const categoryId = categoryData[0]?.id || '' // Ensure categoryId is always a string
  const subCategoryData = await getSubcategoriesByCategory({ categoryId })

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size='sm'>Products</PageHeaderHeading>
        <PageHeaderDescription size='sm'>Buy products from our stores</PageHeaderDescription>
      </PageHeader>
      <Products
        products={productData}
        pageCount={productPageCount}
        // categories={Object.values(products.category.enumValues)}
        // category={categoryData[0]}
        categories={categoryData}
        // subcategories={subCategoryData}
        stores={storeData}
        storePageCount={storePageCount}
      />
    </Shell>
  )
}
