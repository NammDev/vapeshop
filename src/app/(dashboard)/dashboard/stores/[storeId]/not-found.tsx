import { ErrorCard } from '@/components/cards/error-card'
import { Shell } from '@/components/app-ui/shell'

export default function StoreNotFound() {
  return (
    // <Shell variant='centered' className='max-w-md '>
    // </Shell>
    <ErrorCard
      title='Store not found'
      description='The store may have expired or you may have already updated your store'
      retryLink='/dashboard/stores'
      retryLinkText='Go to Stores'
    />
  )
}
