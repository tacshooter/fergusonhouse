const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const content = `# The ROI of Intelligence: A Case for Copilot

In the enterprise world, convincing C-level executives to adopt new tools isn't about the 'cool factor'—it’s about cold, hard data. When we set out to prove the value of GitHub Copilot for a large-scale enterprise, we knew that anecdotal evidence wouldn't cut it. We needed a controlled experiment to turn skepticism into strategy.

## The Experiment

We didn't want a 'hello world' test. We wanted real-world friction. We selected five production issues ranked medium-to-high in terms of required effort and assigned them to two groups of experienced engineers. 

The control group attacked the issues using their standard workflow. The experimental group utilized GitHub Copilot—not just for code generation, but to explain the existing codebase, plan the implementation, and perform initial PR reviews.

## The Hard Numbers: Speed & Accuracy

The results were, frankly, staggering. 

- **Velocity:** The Copilot-assisted developers delivered production-ready code in an average of **2 weeks**. The control group averaged just over **4 weeks**. That is a **50% reduction in development time**.
- **Quality:** We tracked the initial acceptance rate of Pull Requests. The AI-assisted developers saw a **40% higher initial acceptance rate** compared to the solo engineers. Even from the outside, the broader team was blossomed by the clarity and quality of the AI-enhanced PRs.

## The Soft Metrics: Developer Joy

Data is important, but developer retention and morale are the backbone of any engineering organization. Our Scrum Master conducted an independent survey grading metrics like happiness, optimism, and frustration.

The 'soft' scores were overwhelmingly higher for those using Copilot. The tool didn't just make them faster; it reduced the cognitive load and frustration associated with navigating complex codebases, leading to a more optimistic and engaged engineering culture.

## Conclusion

By the end of the pilot, we didn't just have a report; we had a mandate. When you can show a 50% time savings combined with a 40% increase in PR quality—all while making your engineers happier—the case for Copilot moves from 'optional' to 'essential.'`;

  const folder = await prisma.folder.findFirst({ where: { name: 'automated-code-gen' } });
  if (!folder) throw new Error('Folder not found');

  const post = await prisma.post.create({
    data: {
      title: 'The ROI of Intelligence: A Case for Copilot',
      slug: 'the-roi-of-intelligence-case-for-copilot',
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
