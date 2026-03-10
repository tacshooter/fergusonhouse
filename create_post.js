const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  let title = process.argv[2];
  let slug = process.argv[3];
  let content = process.argv[4];
  const folderName = process.argv[5] || 'openclaw';
  let scheduleId = null;

  if (title === '--from-schedule') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const scheduledItem = await prisma.blogSchedule.findFirst({
      where: {
        status: 'SCHEDULED',
        date: { lte: new Date(today.getTime() + 24 * 60 * 60 * 1000) } // Allow for slight drift/early runs
      },
      orderBy: { date: 'asc' }
    });

    if (!scheduledItem) {
      console.log('No scheduled post found for today.');
      return;
    }

    title = scheduledItem.topic;
    slug = scheduledItem.slug;
    scheduleId = scheduledItem.id;
    // content should be provided as the next argument or piped in
    content = process.argv[3]; 

    if (!content) {
      console.error('Usage with --from-schedule: node create_post.js --from-schedule <content>');
      process.exit(1);
    }
  }

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

  // If we have a specific scheduleId from --from-schedule, use it.
  // Otherwise, try to find a matching schedule item by slug.
  if (scheduleId) {
    await prisma.blogSchedule.update({
      where: { id: scheduleId },
      data: { status: 'PUBLISHED' }
    });
    console.log('Updated schedule item status to PUBLISHED (via ID).');
  } else {
    const matchingSchedule = await prisma.blogSchedule.findFirst({
      where: { 
        slug: slug,
        status: { in: ['PENDING', 'SCHEDULED'] }
      }
    });

    if (matchingSchedule) {
      await prisma.blogSchedule.update({
        where: { id: matchingSchedule.id },
        data: { status: 'PUBLISHED' }
      });
      console.log(`Matched and updated schedule item "${slug}" to PUBLISHED.`);
    }
  }

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
