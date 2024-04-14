import { type Config } from 'drizzle-kit'
import { dbPrefix } from '@/lib/constants'

export default {
  schema: './src/db/schema/index.ts',
  driver: 'pg',
  out: './drizzle',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || '',
  },
  tablesFilter: [`${dbPrefix}_*`],
} satisfies Config
