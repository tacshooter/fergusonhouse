import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const schedule = [
    { date: new Date("2026-03-06"), topic: "1. Philosophy", status: "PUBLISHED", slug: "openclaw-philosophy-beyond-chatbot", week_no: 1 },
    { date: new Date("2026-03-07"), topic: "2. Anatomy of a Skill", status: "PUBLISHED", slug: "openclaw-anatomy-of-a-skill", week_no: 1 },
    { date: new Date("2026-03-08"), topic: "3. Multilingual Agent: Breaking the Language Barrier", status: "PUBLISHED", slug: "multilingual-agent-breaking-language-barrier", week_no: 1 },
    { date: new Date("2026-03-09"), topic: "4. Community Spotlight: 13,000 Hands and Counting", status: "PUBLISHED", slug: "community-spotlight-13000-hands-and-counting", week_no: 1 },
    { date: new Date("2026-03-10"), topic: "5. Proactive Assistant: Moving Beyond the Prompt", status: "PUBLISHED", slug: "the-proactive-assistant-moving-beyond-the-prompt", week_no: 1 },
    { date: new Date("2026-03-11"), topic: "6. Wishlist", status: "SCHEDULED", slug: "openclaw-wishlist", week_no: 1 },
    { date: new Date("2026-03-12"), topic: "7. A Week with an Immortal", status: "SCHEDULED", slug: "openclaw-week-with-immortal", week_no: 1 },
    // Next Week (Week 2)
    { date: new Date("2026-03-13"), topic: "8. Agentic Security & Trust", status: "SCHEDULED", slug: "agentic-security-trust", week_no: 2 },
    { date: new Date("2026-03-16"), topic: "9. The Multi-Agent Orchestra", status: "SCHEDULED", slug: "multi-agent-orchestra", week_no: 2 },
    { date: new Date("2026-03-17"), topic: "10. OpenClaw in the Enterprise", status: "SCHEDULED", slug: "openclaw-enterprise", week_no: 2 },
    { date: new Date("2026-03-18"), topic: "11. Beyond the Screen: Hardware Integration", status: "SCHEDULED", slug: "hardware-integration", week_no: 2 },
    { date: new Date("2026-03-19"), topic: "12. The Soul of the Machine", status: "SCHEDULED", slug: "soul-of-the-machine", week_no: 2 }
  ];

  for (const item of schedule) {
    // Upsert using a unique key or just find first
    const existing = await prisma.blogSchedule.findFirst({
      where: {
        date: item.date,
        topic: item.topic
      }
    });

    if (existing) {
      await prisma.blogSchedule.update({
        where: { id: existing.id },
        data: item
      });
    } else {
      await prisma.blogSchedule.create({
        data: item
      });
    }
  }

  console.log("Blog schedule seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
