import Image from 'next/image'
import type { FileWithPreview, StoredFile } from '@/types'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { EmptyCard } from '@/components/cards/empty-card'

interface FilesCardProps {
  files: FileWithPreview[]
}

export function FilesCard({ files }: FilesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded files</CardTitle>
        <CardDescription>View the uploaded files here</CardDescription>
      </CardHeader>
      <CardContent>
        {files.length > 0 ? (
          <ScrollArea className='w-[50rem] pb-4 '>
            <div className='flex w-max space-x-2.5'>
              {files.map((file) => (
                <div key={file.path} className='relative aspect-video w-64'>
                  <Image
                    src={file.preview}
                    alt={file.name}
                    fill
                    sizes='(min-width: 640px) 640px, 100vw'
                    loading='lazy'
                    className='rounded-md object-cover'
                  />
                </div>
              ))}
            </div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        ) : (
          <EmptyCard
            title='No files uploaded'
            description='Upload some files to see them here'
            className='w-full'
          />
        )}
      </CardContent>
    </Card>
  )
}
