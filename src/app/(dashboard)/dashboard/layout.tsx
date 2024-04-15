import { redirect } from 'next/navigation'

// import { getStoresByUserId } from '@/lib/actions/store'
// import {  getProgress } from '@/lib/actions/user'
import { SiteFooter } from '@/components/layouts/site-footer'
import { SidebarProvider } from './_components/sidebar-provider'
import { DashboardHeader } from './_components/dashboard-header'
import { getCacheduser } from '@/lib/actions/user'
import { DashboardSidebar } from './_components/dashboard-sidebar'

// import { DashboardSidebarSheet } from './_components/dashboard-sidebar-sheet'
// import { StoreSwitcher } from './_components/store-switcher'

export default async function DashboardLayout({ children }: React.PropsWithChildren) {
  const user = await getCacheduser()

  if (!user) {
    redirect('/signin')
  }

  //   const storesPromise = getStoresByUserId({ userId: user.id })
  //   const progressPromise = getProgress({ userId: user.id })

  return (
    <SidebarProvider>
      <div className='flex min-h-screen flex-col'>
        <DashboardHeader user={user}>
          Mobile
          {/* <DashboardSidebarSheet className='lg:hidden'>
            <DashboardSidebar className='pl-4'>
              <StoreSwitcher
                userId={user.id}
                storesPromise={storesPromise}
                progressPromise={progressPromise}
              />
            </DashboardSidebar>
          </DashboardSidebarSheet> */}
        </DashboardHeader>
        <div className='container flex-1 items-start lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10'>
          <DashboardSidebar
            // the top-16 class is used for the dashboard-header of h-16, added extra 0.1rem to fix the sticky layout shift issue
            className="top-[calc(theme('spacing.16')_+_0.1rem)] z-30 hidden border-r lg:sticky lg:block"
          >
            {/* <StoreSwitcher
              userId={user.id}
              storesPromise={storesPromise}
              progressPromise={progressPromise}
            /> */}
            Store Switcher
          </DashboardSidebar>
          <main className='flex w-full flex-col overflow-hidden'>{children}</main>
        </div>
        <SiteFooter />
      </div>
    </SidebarProvider>
  )
}
