import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import * as Y from 'yjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@insightats.dev' },
    update: {},
    create: {
      email: 'demo@insightats.dev',
      fullName: 'Demo User',
      passwordHash,
    },
  });

  const ydoc = new Y.Doc();
  const collabState = Y.encodeStateAsUpdate(ydoc);

  const resume = await prisma.resume.create({
    data: {
      ownerId: user.id,
      title: 'Senior Software Engineer Resume',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Jane Doe' }],
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Senior Software Engineer | jane@example.com | +1 555 123 4567' }],
          },
        ],
      },
      collabState,
    },
  });

  await prisma.resumeCollaborator.create({
    data: {
      resumeId: resume.id,
      userId: user.id,
      role: 'owner',
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
