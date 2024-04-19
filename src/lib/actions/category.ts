'use server'

import { unstable_cache as cache } from 'next/cache'
import { db } from '@/db'
import { categories } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

export async function getCategories() {
  return await cache(
    async () => {
      return db
        .selectDistinct({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
        })
        .from(categories)
        .orderBy(desc(categories.name))
    },
    ['categories'],
    {
      revalidate: 3600, // every hour
      tags: ['categories'],
    }
  )()
}

export async function getCategoryByName({ categoryName }: { categoryName: string }) {
  return await cache(
    async () => {
      return db
        .selectDistinct({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
        })
        .from(categories)
        .orderBy(desc(categories.name))
        .where(eq(categories.name, categoryName))
        .then((res) => res[0])
    },
    [`category-${categoryName}`],
    {
      revalidate: 3600, // every hour
      tags: [`category-${categoryName}`],
    }
  )()
}
