import { NextResponse } from 'next/server';

export async function GET() {
  const schedule = [
    { date: "2026-03-06", topic: "1. Philosophy", status: "Published", slug: "openclaw-philosophy-beyond-chatbot" },
    { date: "2026-03-07", topic: "2. Anatomy of a Skill", status: "Scheduled", slug: "openclaw-anatomy-of-a-skill" },
    { date: "2026-03-08", topic: "3. Multilingual Agent", status: "Scheduled", slug: "openclaw-multilingual-agent" },
    { date: "2026-03-09", topic: "4. Community Spotlight", status: "Scheduled", slug: "openclaw-community-spotlight" },
    { date: "2026-03-10", topic: "5. Proactive Assistant", status: "Scheduled", slug: "openclaw-proactive-assistant" },
    { date: "2026-03-11", topic: "6. Wishlist", status: "Scheduled", slug: "openclaw-wishlist" },
    { date: "2026-03-12", topic: "7. A Week with an Immortal", status: "Scheduled", slug: "openclaw-week-with-immortal" }
  ];

  return NextResponse.json(schedule);
}
