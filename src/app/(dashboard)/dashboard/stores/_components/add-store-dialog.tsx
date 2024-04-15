'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

// import { type getProgress } from '@/lib/actions/user'
import { useMediaQuery } from '@/hooks/use-media-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

// import { ManageSubscriptionForm } from '@/components/manage-subscription-form'
import { addStoreSchema } from '@/lib/validations/store'
import { addStore } from '@/lib/actions/store'
import { DynamicTrigger } from './dynamic-trigger'
import { FormFooter } from './form-footer'
import { AddStoreForm } from './add-store-form'

interface AddStoreDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  userId: string
  //   progressPromise: ReturnType<typeof getProgress>
  showTrigger?: boolean
}

// type Progress = Awaited<ReturnType<typeof getProgress>>
export type Progress = {
  storeCount: number
  storeLimit: number
  productCount: number
  productLimit: number
  subscriptionPlan: {
    title: string
  }
}
export type AddStoreInputs = z.infer<typeof addStoreSchema>

export function AddStoreDialog({
  userId,
  //   progressPromise,
  onOpenChange,
  showTrigger = true,
  ...props
}: AddStoreDialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 640px)')

  //   const progress = React.use(progressPromise)
  const progress = {
    storeCount: 0,
    storeLimit: 1,
    productCount: 0,
    productLimit: 100,
    subscriptionPlan: {
      title: 'Standard',
    },
  }

  // react-hook-form
  const form = useForm<AddStoreInputs>({
    resolver: zodResolver(addStoreSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  function onToggle(open: boolean) {
    setOpen(open)
    onOpenChange?.(open)
  }

  async function onSubmit(data: AddStoreInputs) {
    setLoading(true)

    try {
      const { data: store, error } = await addStore({ ...data, userId })

      if (store) {
        router.push(`/dashboard/stores/${store.id}`)
        toast.success('Store created')
        return
      }

      if (error) {
        toast.error(error)
        return
      }
    } finally {
      setLoading(false)
      onToggle(false)
      form.reset()
    }
  }

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (!open) {
            form.reset()
          }
          onToggle(open)
        }}
        {...props}
      >
        <DynamicTrigger progress={progress} isDesktop={isDesktop} showTrigger={showTrigger} />
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Create a new store</DialogTitle>
            <DialogDescription>Create a new store to manage your products</DialogDescription>
          </DialogHeader>
          <AddStoreForm form={form} onSubmit={onSubmit}>
            <DialogFooter className='pt-4'>
              <FormFooter loading={loading} progress={progress} onToggle={onToggle} />
            </DialogFooter>
          </AddStoreForm>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset()
        }
        setOpen(open)
        onOpenChange?.(open)
      }}
      {...props}
    >
      <DynamicTrigger progress={progress} isDesktop={isDesktop} showTrigger={showTrigger} />
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Create a new store</DrawerTitle>
          <DrawerDescription>Create a new store to manage your products</DrawerDescription>
        </DrawerHeader>
        <AddStoreForm form={form} onSubmit={onSubmit} className='px-4'>
          <DrawerFooter className='flex-col-reverse px-0'>
            <FormFooter loading={loading} progress={progress} onToggle={onToggle} />
          </DrawerFooter>
        </AddStoreForm>
      </DrawerContent>
    </Drawer>
  )
}
