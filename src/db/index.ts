import { drizzle } from 'drizzle-orm/postgres-js'
import postgres, { Options } from 'postgres'

import * as schema from './schema'

const client = postgres('postgresql://postgres:namkhanh@localhost:5432/vapeshop')
export const db = drizzle(client, { schema })
