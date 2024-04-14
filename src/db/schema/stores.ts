import { varchar } from 'drizzle-orm/pg-core'
import { pgTable } from '../utils'
import { generateId } from '@/lib/utils'

export const stores = pgTable('stores', {
  id: varchar('id', { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(), // prefix_ (if ocd kicks in) + nanoid (16)
  userId: varchar('user_id', { length: 36 }), // uuid v4
  name: varchar('name').notNull(),
})

export type Store = typeof stores.$inferSelect
