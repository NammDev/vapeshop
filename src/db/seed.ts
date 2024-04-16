import {
  seedCategories,
  seedCozyProducts,
  seedProducts,
  seedSubcategories,
} from '@/lib/actions/seedData'

async function runSeed() {
  console.log('⏳ Running seed...')

  const start = Date.now()

  await seedCategories()

  await seedSubcategories()

  await seedProducts({ storeId: 'dGnDy3iemggcAbCE' })

  await seedCozyProducts({ storeId: 'dGnDy3iemggcAbCE' })

  const end = Date.now()

  console.log(`✅ Seed completed in ${end - start}ms`)

  process.exit(0)
}

runSeed().catch((err) => {
  console.error('❌ Seed failed')
  console.error(err)
  process.exit(1)
})
