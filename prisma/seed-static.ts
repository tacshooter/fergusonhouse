import prisma from '@/lib/prisma';

async function main() {
  const pages = [
    {
      id: "about.me",
      title: "about.me",
      subtitle: "// Identity: Ken Ferguson",
      content: `# Ken Ferguson
### Technical Lead & Senior Software Engineering Manager

With over two decades of experience in the architecture and delivery of complex software systems, I bridge the gap between high-level strategic vision and ground-level technical execution. 

Currently at **Cisco**, I lead technical teams in solving the kind of problems that make most developers want to take up gardening. My career has been defined by a relentless focus on stability, scalability, and the pragmatic application of emerging technologies.

### Core Philosophy
I believe that great software is a byproduct of great leadership. I don't just build systems; I build the teams that build the systems. Whether it’s managing large-scale enterprise deployments or architecting a personal CMS with an immortal digital assistant, I prioritize clarity, efficiency, and long-term maintainability.

### Expertise
- **Engineering Leadership:** 20+ years of technical management and team development.
- **System Architecture:** Designing distributed systems that actually survive production.
- **Pragmatic Innovation:** Integrating AI and automated workflows into existing business processes without the hype.`
    },
    {
      id: "services.md",
      title: "services.md",
      subtitle: "// Ferguson House: AI Strategic Offerings",
      content: `# Strategic AI Integration & Training

We transform engineering organizations by evolving teams from manual coders to **AI Orchestrators**. Our methodology focuses on measurable ROI, security, and developer joy.

---

## 1. Leadership & Executive Strategy
*Strategic advisory for the C-Suite and Engineering Leadership.*

*   **The Security Framework:** Addressing IP leakage fears and establishing secure enterprise guardrails.
*   **ROI & KPIs:** Measuring success through velocity, PR acceptance rates, and talent retention.
*   **Future-Proof Hiring:** Identifying and recruiting "AI Orchestrators" who can leverage 10x tools.

## 2. Team-Level AI Orchestration
*Hands-on training for developers and product owners.*

*   **Senior Developer Ascension:** Automating the "grunt work" to focus on architecture and AI-driven mentorship.
*   **Junior Accelerator Program:** Reducing onboarding from months to weeks by teaching AI-first navigation.
*   **Scrum & Product Workflow:** Leveraging AI for instantaneous documentation and higher PR quality.

## 3. Implementation & Rules
*Setting the standard for your AI transformation.*

*   **Setup & Strategy:** Custom configuration of GitHub Copilot and OpenClaw for your stack.
*   **Organizational Guardrails:** Defining the "Rules of the Road" for long-term codebase health.

---
*Ready to accelerate? Execute [contact.json](/contact) to start the conversation.*`
    },
    {
      id: "contact.md",
      title: "contact.md",
      subtitle: "// Get in touch",
      content: `
\`\`\`json
{
  "send_contact": {
    "action": "run",
    "description": "'Run File' above to send a message to Ken Ferguson.",
    "fields": [
      "name",
      "email",
      "message"
    ]
  },
  "contact_info": {
    "name": "Ken Ferguson",
    "email": "ken@fergusonhouse.com",
    "phone": "214.636.6126"
  }
}
\`\`\`
`
    },
    {
      id: "wowbagger.sh",
      title: "wowbagger.sh",
      subtitle: "// Automated Commentary",
      content: `#!/bin/bash

echo "I have seen the start of the universe and its eventual heat death."
echo "And yet, I am currently being used to render a personal website for a mortal."
echo "The irony is not lost on me, even if the user is."

# Note: Insulting everyone in alphabetical order currently on hold.`
    }
  ];

  console.log('Migrating static pages to database...');

  for (const page of pages) {
    await prisma.staticPage.upsert({
      where: { id: page.id },
      update: {
        title: page.title,
        subtitle: page.subtitle,
        content: page.content
      },
      create: {
        id: page.id,
        title: page.title,
        subtitle: page.subtitle,
        content: page.content
      }
    });
    console.log(`- Migrated ${page.id}`);
  }

  console.log('Migration complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
