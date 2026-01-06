import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'herocalze11@gmail.com';
  const password = 'Milk2026';
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
    },
    create: {
      email,
      password: hashedPassword,
      name: 'Aldrin Reyes (Admin)',
      role: 'ADMIN',
    },
  });
  
  console.log(`User ${user.email} created/updated successfully in AI Studio IDE backend.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
