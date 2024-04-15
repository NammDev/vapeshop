'use client'

import { Icons } from '@/components/app-ui/icons'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { deleteStore, updateStore } from '@/lib/actions/store'
import { updateStoreSchema } from '@/lib/validations/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type UpdateStoreInputs = z.infer<typeof updateStoreSchema>

export function UpdateStoreForm({
  store,
}: {
  store: { name: string; description: string | null; id: string }
}) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [del, setDel] = useState(false)

  // react-hook-form
  const form = useForm<UpdateStoreInputs>({
    resolver: zodResolver(updateStoreSchema),
    defaultValues: {
      name: store.name,
      description: store.description ?? '',
    },
  })

  async function onSubmit(data: UpdateStoreInputs) {
    setLoading(true)
    try {
      const { data: storeUpdate, error } = await updateStore(data, store?.id ?? '')

      if (storeUpdate) {
        router.push(`/dashboard/stores/${storeUpdate.id}`)
        toast.success('Store Updated')
        return
      }

      if (error) {
        toast.error(error)
        return
      }
    } finally {
      form.reset()
      setLoading(false)
    }
  }

  async function onDelete() {
    setDel(true)
    try {
      const { data, error } = await deleteStore(store.id)

      if (data) {
        router.push(`/dashboard/stores`)
        toast.success('Store Deleted')
        return
      }

      if (error) {
        toast.error(error)
        return
      }
    } finally {
      form.reset()
      setLoading(false)
    }
    setDel(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid w-full max-w-xl gap-5'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Type store name here.' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder='Type store description here.' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex flex-col gap-2 xs:flex-row'>
          <Button type='submit' disabled={loading}>
            {loading && <Icons.spinner className='mr-2 size-4 animate-spin' aria-hidden='true' />}
            Update store
          </Button>
          <Button type='button' onClick={onDelete} variant='destructive' disabled={del}>
            {del && <Icons.spinner className='mr-2 size-4 animate-spin' aria-hidden='true' />}
            Delete store
          </Button>
        </div>
      </form>
    </Form>
  )
}
