import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/db'
import { products, stores } from '@/db/schema'
// import { env } from '@/env.mjs'
import { eq } from 'drizzle-orm'

import { Separator } from '@/components/ui/separator'
import { Shell } from '@/components/app-ui/shell'
import { Breadcrumbs } from '@/components/app-ui/breadcrumbs'

interface StorePageProps {
  params: {
    storeId: string
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

async function getStoreFromParams(params: StorePageProps['params']) {
  const storeId = params.storeId
  return await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
  })
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const store = await getStoreFromParams(params)

  if (!store) {
    return {}
  }

  return {
    // metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: store.name,
    description: store.description,
  }
}

export default async function StorePage({ params, searchParams }: StorePageProps) {
  const store = await getStoreFromParams(params)

  if (!store) {
    notFound()
  }

  return (
    <Shell>
      <Breadcrumbs
        segments={[
          {
            title: 'Stores',
            href: '/stores',
          },
          {
            title: store.name,
            href: `/store/${store.id}`,
          },
        ]}
      />
      <div className='flex flex-col gap-8 md:flex-row md:gap-16'>
        <div className='flex w-full flex-col gap-4'>
          <div className='space-y-2'>
            <h2 className='line-clamp-1 text-2xl font-bold'>{store.name}</h2>
            <p className='text-base text-muted-foreground'>{store.description}</p>
          </div>
          <Separator className='my-1.5' />
          {/* <Products
            products={productsTransaction.items}
            pageCount={pageCount}
            // categories={Object.values(products.category.enumValues)}
            stores={storesTransaction.items}
            storePageCount={storePageCount}
          /> */}
        </div>
      </div>
    </Shell>
  )
}
