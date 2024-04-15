import { Icons } from '@/components/app-ui/icons'
import { Button } from '@/components/ui/button'
import { Progress } from './add-store-dialog'

interface FormFooterProps {
  loading: boolean
  progress: Progress
  onToggle: (open: boolean) => void
}

export function FormFooter({ onToggle, loading, progress }: FormFooterProps) {
  return (
    <>
      <Button type='button' variant='outline' onClick={() => onToggle(false)}>
        Cancel
      </Button>
      <Button
        type='submit'
        disabled={
          loading ||
          progress.storeCount >= progress.storeLimit ||
          progress.productCount >= progress.productLimit
        }
      >
        {loading && <Icons.spinner className='mr-2 size-4 animate-spin' aria-hidden='true' />}
        Add store
      </Button>
    </>
  )
}
