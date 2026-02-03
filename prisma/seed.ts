import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const blog = await prisma.folder.create({
    data: {
      name: 'blog',
      children: {
        create: [
          { name: 'projects' },
          { name: 'conventions' },
          { name: 'automated-code-gen' },
        ]
      }
    }
  })
  console.log('Database seeded with initial folders.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
