const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const content = `# Senior Outcomes from Junior Hands: The AI Mentorship Model

One of the most persistent myths about AI-assisted development is that it's only for the 'elites'—the seniors who already know where the bodies are buried in the codebase. We recently put this to the test at a major enterprise, and the results turned that narrative on its head.

## The Challenge: The Project No One Wanted

We took the least sought-after, most daunting task on the board: upgrading five massive repositories from Python 3.9 to 3.14 for a team that was already chronically overworked. Initial estimates pegged this as a **six-month effort** for a senior developer who knew the systems inside and out.

Instead of a senior, we assigned a junior intern.

## The Method: AI as the Equalizer

The intern had solid baseline Python skills but zero experience with these specific product codebases and very little exposure to generative AI. My role was simple: act as a mentor and 'Copilot trainer.' 

We spent the first two weeks focusing purely on how to use GitHub Copilot as a **pair programmer**. We didn't just teach him to generate code; we taught him how to use the AI to navigate legacy logic, identify breaking changes in the Python version jump, and suggest refactors.

## The Results: 2 Months Ahead of Schedule

The Python upgrade hit production **two months ahead of the original senior-level estimate**. 

The vast majority of the heavy lifting was done by the intern and his AI pair programmer. By offloading the 'detective work' of the upgrade to Copilot, the intern was able to operate at a level of efficiency that bypassed the traditional six-month learning curve.

## The 'Hidden' ROI: Confidence and Context

The most significant result wasn't just the early delivery; it was the state of the intern at the end of the project. Typically, after a massive version upgrade, a junior might feel burnt out or pigeonholed. Instead, this intern emerged with:

- **Deep Context:** He now understood the architecture of five different repositories better than some long-tenured team members.
- **Unearned Confidence:** He was ready to pick up virtually any ticket in the following sprint planning sessions.

## Conclusion

AI doesn't just make seniors faster; it makes juniors **capable**. By pairing a junior developer with a solid mentor and a powerful AI tool, we turned a six-month senior-level grind into a four-month junior-level success story. The mentorship model of the future isn't just about teaching syntax—it's about teaching AI orchestration.`;

  const folder = await prisma.folder.findFirst({ where: { name: 'automated-code-gen' } });
  if (!folder) throw new Error('Folder not found');

  const post = await prisma.post.create({
    data: {
      title: 'Senior Outcomes from Junior Hands: The AI Mentorship Model',
      slug: 'senior-outcomes-junior-hands-ai-mentorship',
      content: content,
      folderId: folder.id,
      published: true
    }
  });
  console.log('Created post:', post.id);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
