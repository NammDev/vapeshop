import { drizzle } from 'drizzle-orm/postgres-js'
import postgres, { Options } from 'postgres'

import * as schema from './schema'

const client = postgres(process.env.DATABASE_URL || '', {} as Options<{}>)
export const db = drizzle(client, { schema })
