import type { Metadata } from 'next'
import { toTitleCase, unslugify } from '@/lib/utils'
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/app-ui/page-header'
import { Products } from '@/components/app-logic/products'
import { Shell } from '@/components/app-ui/shell'
import { getProducts } from '@/lib/actions/product'
import { getStores } from '@/lib/actions/store'

interface SubcategoryPageProps {
  params: {
    category: string
    subcategory: string
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export function generateMetadata({ params }: SubcategoryPageProps): Metadata {
  const subcategory = unslugify(params.subcategory)

  return {
    // metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: toTitleCase(subcategory),
    description: `Buy the best ${subcategory}`,
  }
}

export default async function SubcategoryPage({ params, searchParams }: SubcategoryPageProps) {
  const { category, subcategory } = params

  const [
    { data: productData, pageCount: productPageCount },
    { data: storeData, pageCount: storePageCount },
  ] = await Promise.all([getProducts(searchParams), getStores(searchParams)])

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size='sm'>{toTitleCase(unslugify(subcategory))}</PageHeaderHeading>
        <PageHeaderDescription size='sm'>
          {`Buy the best ${unslugify(subcategory)}`}
        </PageHeaderDescription>
      </PageHeader>
      <Products
        products={productData}
        pageCount={productPageCount}
        // categories={category}
        stores={storeData}
        storePageCount={storePageCount}
      />
    </Shell>
  )
}
