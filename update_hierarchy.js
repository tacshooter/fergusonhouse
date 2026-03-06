const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function main() {
  const folders = await prisma.folder.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: {
          posts: {
            select: { id: true, title: true, slug: true }
          }
        }
      },
      posts: {
        select: { id: true, title: true, slug: true }
      }
    }
  });

  const outputPath = path.join(__dirname, 'public', 'hierarchy.json');
  fs.writeFileSync(outputPath, JSON.stringify(folders, null, 2));
  console.log('Updated hierarchy.json at:', outputPath);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
