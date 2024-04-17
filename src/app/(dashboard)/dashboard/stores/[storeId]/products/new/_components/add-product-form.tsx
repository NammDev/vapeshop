'use client'

import * as React from 'react'
import type { FileWithPreview, StoredFile } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { addProduct } from '@/lib/actions/product'
import { type getCategories } from '@/lib/actions/category'
import { type getSubcategories } from '@/lib/actions/sub-category'
import { addProductSchema, type AddProductSchema } from '@/lib/validations/product'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FilesCard } from '@/components/cards/FilesCard'
// import { FileUploader } from '@/components/file-uploader'
import { Icons } from '@/components/app-ui/icons'
import type { OurFileRouter } from '@/app/api/uploadthing/core'
import { generateReactHelpers } from '@uploadthing/react/hooks'
import { isArrayOfFile } from '@/lib/utils'
import { Zoom } from '@/components/app-logic/zoom-image'
import Image from 'next/image'
import { EmptyCard } from '@/components/cards/empty-card'
import { FileDialog } from '../../[productId]/_components/file-dialog'

interface AddProductFormProps {
  storeId: string
  promises: Promise<{
    categories: Awaited<ReturnType<typeof getCategories>>
    subcategories: Awaited<ReturnType<typeof getSubcategories>>
  }>
}

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export function AddProductForm({ storeId, promises }: AddProductFormProps) {
  const { categories, subcategories } = React.use(promises)

  const [loading, setLoading] = React.useState(false)
  const { isUploading, startUpload } = useUploadThing('productImage')
  const [isPending, startTransition] = React.useTransition()
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)

  // const { uploadFiles, progresses, uploadedFiles, isUploading } = useUploadFile('productImage')

  const form = useForm<AddProductSchema>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      inventory: NaN,
      categoryId: '',
      subcategoryId: '',
      images: [],
    },
  })

  function onSubmit(input: AddProductSchema) {
    setLoading(true)
    startTransition(async () => {
      try {
        const images = isArrayOfFile(input.images)
          ? await startUpload(input.images).then((res) => {
              const formattedImages = res?.map((image) => ({
                id: image.key,
                name: image.key.split('_')[1] ?? image.key,
                url: image.url,
              }))
              return formattedImages ?? null
            })
          : null
        await addProduct({
          ...input,
          storeId,
          images: JSON.stringify(images) as unknown as StoredFile[],
        })

        toast.success('Product created successfully.')
        setFiles(null)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    })
  }

  return (
    <Form {...form}>
      <form className='grid w-full max-w-2xl gap-5' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Type product name here.' {...field} />
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
                <Textarea placeholder='Type product description here.' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex flex-col items-start gap-6 sm:flex-row'>
          <FormField
            control={form.control}
            name='categoryId'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Category</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value: typeof field.value) => field.onChange(value)}
                >
                  <FormControl>
                    <SelectTrigger className='capitalize'>
                      <SelectValue placeholder={field.value} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((option) => (
                        <SelectItem key={option.id} value={option.id} className='capitalize'>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='subcategoryId'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Subcategory</FormLabel>
                <Select value={field.value?.toString()} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a subcategory' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {subcategories.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col items-start gap-6 sm:flex-row'>
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Type product price here.'
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='inventory'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Inventory</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    inputMode='numeric'
                    placeholder='Type product inventory here.'
                    value={Number.isNaN(field.value) ? '' : field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='space-y-6'>
          <FormField
            control={form.control}
            name='images'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Images</FormLabel>
                <Select value={field.value?.toString()} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a subcategory' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {subcategories.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem className='flex w-full flex-col gap-1.5'>
            <FormLabel>Images</FormLabel>
            <Card>
              <CardHeader>
                <CardTitle>Uploaded files</CardTitle>
                <CardDescription>View the uploaded files here</CardDescription>
              </CardHeader>
              <CardContent>
                {files?.length ? (
                  <div className='flex items-center gap-2'>
                    {files.map((file, i) => (
                      <Zoom key={i}>
                        <Image
                          src={file.preview}
                          alt={file.name}
                          className='object-cover object-center w-20 h-20 rounded-md shrink-0'
                          width={80}
                          height={80}
                        />
                      </Zoom>
                    ))}
                  </div>
                ) : (
                  <EmptyCard
                    title='No files uploaded'
                    description='Upload some files to see them here'
                    className='w-full'
                  />
                )}
              </CardContent>
            </Card>
            <FormControl>
              <FileDialog
                setValue={form.setValue}
                name='images'
                maxFiles={3}
                maxSize={1024 * 1024 * 4}
                files={files}
                setFiles={setFiles}
                isUploading={isUploading}
                disabled={isUploading}
              />
            </FormControl>
            <UncontrolledFormMessage message={form.formState.errors.images?.message} />
          </FormItem>

          {files && files?.length > 0 ? <FilesCard files={files} /> : null}
        </div>
        <Button
          onClick={() => void form.trigger(['name', 'description', 'price', 'inventory'])}
          className='w-fit'
          disabled={loading}
        >
          {loading && <Icons.spinner className='mr-2 size-4 animate-spin' aria-hidden='true' />}
          Add Product
          <span className='sr-only'>Add Product</span>
        </Button>
      </form>
    </Form>
  )
}
