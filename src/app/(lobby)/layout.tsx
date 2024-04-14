import { currentUser } from '@clerk/nextjs'
import { PropsWithChildren } from 'react'

import { SiteFooter } from '@/components/layouts/site-footer'
import { SiteHeader } from '@/components/layouts/site-header'

export default async function LobyLayout({ children }: PropsWithChildren) {
  const user = await currentUser()
  console.log(user)

  return (
    <div className='relative flex min-h-screen flex-col'>
      <SiteHeader user={user} />
      <main className='flex-1'>{children}</main>
      <SiteFooter />
    </div>
  )
}
