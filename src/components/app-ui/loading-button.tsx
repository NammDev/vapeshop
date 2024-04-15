'use client'

import * as React from 'react'
import { useFormStatus } from 'react-dom'

import { cn } from '@/lib/utils'
import { useMounted } from '@/hooks/use-mounted'
import { Button, buttonVariants, type ButtonProps } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Icons } from '@/components/app-ui/icons'

interface LoadingButtonProps extends ButtonProps {
  action: string
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, className, variant, size, action, ...props }, ref) => {
    const { pending } = useFormStatus()
    const [del, setDel] = React.useState(false)
    const [update, setUpdate] = React.useState(false)
    const mounted = useMounted()

    if (!mounted)
      return (
        <Skeleton
          className={cn(
            buttonVariants({ variant, size, className }),
            'bg-muted text-muted-foreground'
          )}
        >
          {children}
        </Skeleton>
      )

    return (
      <Button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={pending}
        {...props}
        onClick={() => {
          if (action === 'update') {
            setUpdate(true)
          } else {
            setDel(true)
          }
        }}
      >
        {del && pending && (
          <Icons.spinner className='mr-2 size-4 animate-spin' aria-hidden='true' />
        )}
        {update && pending && (
          <Icons.spinner className='mr-2 size-4 animate-spin' aria-hidden='true' />
        )}
        {children}
      </Button>
    )
  }
)
LoadingButton.displayName = 'LoadingButton'

export { LoadingButton }
