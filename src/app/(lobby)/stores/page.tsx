import { type Metadata } from 'next'
// import { env } from '@/env.js'
import type { SearchParams } from '@/types'

import { storesSearchParamsSchema } from '@/lib/validations/params'
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/app-ui/page-header'
import { Shell } from '@/components/app-ui/shell'
import { getStores } from '@/lib/actions/store'
import { Stores } from './_components/store'

export const metadata: Metadata = {
  //   metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: 'Stores',
  description: 'Buy stores from our stores',
}

interface StoresPageProps {
  searchParams: SearchParams
}

export default async function StoresPage({ searchParams }: StoresPageProps) {
  const { page, per_page, sort, statuses } = storesSearchParamsSchema.parse(searchParams)

  // Stores transaction
  const pageAsNumber = Number(page)
  const fallbackPage = isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber
  const perPageAsNumber = Number(per_page)
  const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0

  const { data, pageCount } = await getStores(searchParams)

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size='sm'>Stores</PageHeaderHeading>
        <PageHeaderDescription size='sm'>Buy products from our stores</PageHeaderDescription>
      </PageHeader>
      <Stores data={data} pageCount={pageCount} />
    </Shell>
  )
}
