'use server'

import { unstable_cache as cache } from 'next/cache'
import { db } from '@/db'
import { subcategories } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getSubcategories() {
  return await cache(
    async () => {
      return db
        .selectDistinct({
          id: subcategories.id,
          name: subcategories.name,
          slug: subcategories.slug,
          description: subcategories.description,
        })
        .from(subcategories)
    },
    ['subcategories'],
    {
      revalidate: 3600, // every hour
      tags: ['subcategories'],
    }
  )()
}

export async function getSubcategoriesByCategory({ categoryId }: { categoryId: string }) {
  return await cache(
    async () => {
      return db
        .selectDistinct({
          id: subcategories.id,
          name: subcategories.name,
          slug: subcategories.slug,
          description: subcategories.description,
        })
        .from(subcategories)
        .where(eq(subcategories.id, categoryId))
    },
    [`subcategories-${categoryId}`],
    {
      revalidate: 3600, // every hour
      tags: [`subcategories-${categoryId}`],
    }
  )()
}
