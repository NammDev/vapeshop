import { type HandleOAuthCallbackParams } from '@clerk/types'

import { Shell } from '@/components/app-ui/shell'
import { SSOCallback } from '../_componnents/sso-callback'

export interface SSOCallbackPageProps {
  searchParams: HandleOAuthCallbackParams
}

export default function SSOCallbackPage({ searchParams }: SSOCallbackPageProps) {
  return (
    <Shell className='max-w-lg'>
      <SSOCallback searchParams={searchParams} />
    </Shell>
  )
}
