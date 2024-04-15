import { UsageCard } from '@/components/cards/usage-card'
import { Button } from '@/components/ui/button'
import { DialogTrigger } from '@/components/ui/dialog'
import { DrawerTrigger } from '@/components/ui/drawer'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Progress } from './add-store-dialog'

interface DynamicTriggerProps {
  progress: Progress
  isDesktop: boolean
  showTrigger?: boolean
}

export function DynamicTrigger({ progress, showTrigger, isDesktop }: DynamicTriggerProps) {
  if (!showTrigger) return null

  const { storeLimit, storeCount, productLimit, productCount, subscriptionPlan } = progress

  const storeLimitReached = storeCount >= storeLimit
  const productLimitReached = productCount >= productLimit

  if (storeLimitReached || productLimitReached) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button className='cursor-not-allowed opacity-50 hover:bg-primary'>Create store</Button>
        </HoverCardTrigger>
        <HoverCardContent className='space-y-4 sm:w-80' align='end' sideOffset={8}>
          {storeLimitReached ? (
            <div className='space-y-3'>
              <div className='text-sm text-muted-foreground'>
                You&apos;ve reached the limit of <span className='font-bold'>{storeLimit}</span>{' '}
                stores for the <span className='font-bold'>{subscriptionPlan?.title}</span> plan.
              </div>
              <UsageCard title='Stores' count={storeCount} limit={storeLimit} />
            </div>
          ) : null}
          {productLimitReached ? (
            <div className='space-y-3'>
              <div className='text-sm text-muted-foreground'>
                You&apos;ve reached the limit of <span className='font-bold'>{productLimit}</span>{' '}
                products for the <span className='font-bold'>{subscriptionPlan?.title}</span> plan.
              </div>
              <UsageCard title='Products' count={productCount} limit={productLimit} />
            </div>
          ) : null}
          {/* {subscriptionPlan ? (
              <ManageSubscriptionForm
                stripePriceId={subscriptionPlan.stripePriceId}
                stripeCustomerId={subscriptionPlan.stripeCustomerId}
                stripeSubscriptionId={subscriptionPlan.stripeSubscriptionId}
                isSubscribed={subscriptionPlan.isSubscribed ?? false}
                isCurrentPlan={subscriptionPlan.title === 'Standard'}
              />
            ) : null} */}
        </HoverCardContent>
      </HoverCard>
    )
  }

  if (isDesktop) {
    return (
      <DialogTrigger asChild>
        <Button>Create store</Button>
      </DialogTrigger>
    )
  }

  return (
    <DrawerTrigger asChild>
      <Button>Create store</Button>
    </DrawerTrigger>
  )
}
