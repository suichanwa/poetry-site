import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Delete existing data
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.poem.deleteMany();
    await prisma.user.deleteMany();

    // Create test users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const user1 = await prisma.user.create({
      data: {
        name: 'Emily Parker',
        email: 'emily@example.com',
        password: hashedPassword,
      },
    });

    const user2 = await prisma.user.create({
      data: {
        name: 'Liam Walker',
        email: 'liam@example.com',
        password: hashedPassword,
      },
    });

    // Create test poems
    const poem1 = await prisma.poem.create({
      data: {
        title: 'The Beauty of Dawn',
        content: 'The sun rises, painting skies in hues of gold,\nNature awakens, as the day starts to unfold.',
        authorId: user1.id,
      },
    });

    const poem2 = await prisma.poem.create({
      data: {
        title: 'Silent Whispers',
        content: 'In the quiet of the night, dreams come alive,\nWhispering stories of hopes that survive.',
        authorId: user2.id,
      },
    });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });