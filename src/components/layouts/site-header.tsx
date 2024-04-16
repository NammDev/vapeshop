import type { User } from '@clerk/nextjs/server'

import { siteConfig } from '@/config/site'
import { MainNav } from './main-nav'
import { MobileNav } from './mobile-nav'
import { AuthDropdown } from './auth-dropdown'
import { CartSheet } from '@/components/checkout/cart-sheet'
import { ProductsCommandMenu } from './product-command-menu'

interface SiteHeaderProps {
  user: User | null
}

export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background'>
      <div className='container flex h-16 items-center'>
        <MainNav items={siteConfig.mainNav} />
        <MobileNav items={siteConfig.mainNav} />
        <div className='flex flex-1 items-center justify-end space-x-4'>
          <nav className='flex items-center space-x-2'>
            <ProductsCommandMenu />
            <CartSheet />
            <AuthDropdown user={user} />
          </nav>
        </div>
      </div>
    </header>
  )
}
