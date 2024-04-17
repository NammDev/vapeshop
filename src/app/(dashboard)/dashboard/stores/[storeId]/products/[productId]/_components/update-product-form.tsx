'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { type Product } from '@/db/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { deleteProduct, updateProduct } from '@/lib/actions/product'
import { type getCategories } from '@/lib/actions/category'
import { type getSubcategories } from '@/lib/actions/sub-category'
import { getErrorMessage } from '@/lib/handle-error'
import { updateProductSchema, type UpdateProductSchema } from '@/lib/validations/product'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Icons } from '@/components/app-ui/icons'
import { Zoom } from '@/components/app-logic/zoom-image'
import Image from 'next/image'
import { FileWithPreview } from '@/types'
import { FileDialog } from './file-dialog'
import type { OurFileRouter } from '@/app/api/uploadthing/core'
import { generateReactHelpers } from '@uploadthing/react/hooks'
import { isArrayOfFile } from '@/lib/utils'
import { EmptyCard } from '@/components/cards/empty-card'

interface UpdateProductFormProps {
  product: Product
  promises: Promise<{
    categories: Awaited<ReturnType<typeof getCategories>>
    subcategories: Awaited<ReturnType<typeof getSubcategories>>
  }>
}
const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export function UpdateProductForm({ product, promises }: UpdateProductFormProps) {
  const router = useRouter()

  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)
  const { categories, subcategories } = React.use(promises)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const { isUploading, startUpload } = useUploadThing('productImage')
  const [isPending, startTransition] = React.useTransition()

  // const { uploadFiles, progresses, uploadedFiles, isUploading } = useUploadFile('productImage', {
  //   defaultUploadedFiles: product.images ?? [],
  // })

  React.useEffect(() => {
    if (product.images && product.images.length > 0) {
      setFiles(
        product.images.map((image) => {
          const file = new File([], image.name, {
            type: 'image',
          })
          const fileWithPreview = Object.assign(file, {
            preview: image.url,
          })

          return fileWithPreview
        })
      )
    }
  }, [product])

  const form = useForm<UpdateProductSchema>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      id: product.id,
      name: product.name,
      description: product.description ?? '',
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId,
      price: product.price,
      inventory: product.inventory,
    },
  })

  async function onSubmit(input: UpdateProductSchema) {
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
        console.log('vao day ko ta')
        await updateProduct({
          ...input,
          storeId: product.storeId,
          id: product.id,
        })

        toast.success('Product updated successfully.')
        setFiles(null)
      } catch (err) {
        console.log(err)
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
            <FormItem className='w-full'>
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
                <Textarea placeholder='Type product description here.' rows={6} {...field} />
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
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value: typeof field.value) => field.onChange(value)}
                    defaultValue={product.categoryId}
                  >
                    <SelectTrigger className='capitalize'>
                      <SelectValue placeholder={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
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
                <FormControl>
                  <Select value={field.value?.toString()} onValueChange={field.onChange}>
                    <SelectTrigger className='capitalize'>
                      <SelectValue placeholder={field.value} />
                    </SelectTrigger>
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col items-start gap-6 sm:flex-row'>
          <FormItem className='w-full'>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input
                type='number'
                inputMode='numeric'
                placeholder='Type product price here.'
                {...form.register('price')}
                defaultValue={product.price}
              />
            </FormControl>
            <UncontrolledFormMessage message={form.formState.errors.price?.message} />
          </FormItem>
          <FormItem className='w-full'>
            <FormLabel>Inventory</FormLabel>
            <FormControl>
              <Input
                type='number'
                inputMode='numeric'
                placeholder='Type product inventory here.'
                {...form.register('inventory', {
                  valueAsNumber: true,
                })}
                defaultValue={product.inventory}
              />
            </FormControl>
            <UncontrolledFormMessage message={form.formState.errors.inventory?.message} />
          </FormItem>
        </div>

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

        {/* <FormField
          control={form.control}
          name='images'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-1.5'>
              <FormLabel>Images</FormLabel>
              {uploadedFiles?.length ? (
                <div className='flex items-center gap-2'>
                  {uploadedFiles.map((file, i) => (
                    <Zoom key={i}>
                      <Image
                        src={file.url}
                        alt={file.name}
                        className='object-cover object-center w-20 h-20 rounded-md shrink-0'
                        width={80}
                        height={80}
                      />
                    </Zoom>
                  ))}
                </div>
              ) : null}
              <FormControl>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant='outline'>Upload files</Button>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-xl'>
                    <DialogHeader>
                      <DialogTitle>Upload files</DialogTitle>
                      <DialogDescription>
                        Drag and drop your files here or click to browse.
                      </DialogDescription>
                    </DialogHeader>
                    <FileUploader
                      value={field.value ?? []}
                      onValueChange={field.onChange}
                      maxFiles={4}
                      maxSize={4 * 1024 * 1024}
                      progresses={progresses}
                      disabled={isUploading}
                    />
                  </DialogContent>
                </Dialog>
              </FormControl>
              <UncontrolledFormMessage message={form.formState.errors.images?.message} />
            </FormItem>
          )}
        /> */}

        <div className='flex space-x-2'>
          <Button type='submit' disabled={isDeleting || isUploading || isPending}>
            {isUploading && (
              <Icons.spinner className='mr-2 size-4 animate-spin' aria-hidden='true' />
            )}
            Update Product
            <span className='sr-only'>Update product</span>
          </Button>
          <Button
            variant='destructive'
            onClick={() => {
              setIsDeleting(true)

              toast.promise(
                deleteProduct({
                  storeId: product.storeId,
                  id: product.id,
                }),
                {
                  loading: 'Deleting product...',
                  success: () => {
                    void form.trigger(['name', 'price', 'inventory'])
                    router.push(`/dashboard/stores/${product.storeId}/products`)
                    setIsDeleting(false)
                    return 'Product deleted'
                  },
                  error: (err) => {
                    setIsDeleting(false)
                    return getErrorMessage(err)
                  },
                }
              )
            }}
            disabled={isDeleting}
          >
            {isDeleting && (
              <Icons.spinner className='mr-2 size-4 animate-spin' aria-hidden='true' />
            )}
            Delete Product
            <span className='sr-only'>Delete product</span>
          </Button>
        </div>
      </form>
    </Form>
  )
}
