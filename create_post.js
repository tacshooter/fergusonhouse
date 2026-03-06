const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const title = process.argv[2];
  const slug = process.argv[3];
  const content = process.argv[4];
  const folderName = process.argv[5] || 'openclaw';

  if (!title || !slug || !content) {
    console.error('Usage: node create_post.js <title> <slug> <content> [folderName]');
    process.exit(1);
  }

  const folder = await prisma.folder.findFirst({ where: { name: folderName } });
  if (!folder) {
    console.error(`Folder "${folderName}" not found.`);
    process.exit(1);
  }

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      folderId: folder.id,
      published: true
    }
  });

  console.log('Created post:', post.id);

  // Update hierarchy.json
  try {
    const { execSync } = require('child_process');
    execSync('node update_hierarchy.js', { cwd: __dirname });
    console.log('Updated hierarchy cache.');
  } catch (e) {
    console.error('Failed to update hierarchy cache:', e.message);
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
