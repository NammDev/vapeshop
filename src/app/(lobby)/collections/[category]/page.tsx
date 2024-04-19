import type { Metadata } from 'next'

import { toTitleCase } from '@/lib/utils'
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/app-ui/page-header'
import { Products } from '@/components/app-logic/products'
import { Shell } from '@/components/app-ui/shell'
import { getProducts } from '@/lib/actions/product'
import { getStores } from '@/lib/actions/store'
import { getCategoryByName } from '@/lib/actions/category'
import { getSubcategoriesByCategory } from '@/lib/actions/sub-category'

interface CategoryPageProps {
  params: {
    category: string
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  return {
    // metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: toTitleCase(params.category),
    description: `Buy products from the ${params.category} category`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = params

  const modifiedSearchParams = {
    ...searchParams,
    categories: `${category}`,
  }

  const [
    { data: productData, pageCount: productPageCount },
    { data: storeData, pageCount: storePageCount },
  ] = await Promise.all([getProducts(modifiedSearchParams), getStores(modifiedSearchParams)])

  const categoryData = await getCategoryByName({ categoryName: category })
  const categoryId = categoryData?.id || ''
  const subCategoryData = await getSubcategoriesByCategory({ categoryId: categoryId })

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size='sm'>{toTitleCase(category)}</PageHeaderHeading>
        <PageHeaderDescription size='sm'>
          {`Buy ${category} from the best stores`}
        </PageHeaderDescription>
      </PageHeader>
      <Products
        products={productData}
        pageCount={productPageCount}
        category={categoryData}
        subcategories={subCategoryData}
        stores={storeData}
        storePageCount={storePageCount}
      />
    </Shell>
  )
}
