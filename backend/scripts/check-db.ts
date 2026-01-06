import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Models ---');
  const models = await prisma.model.findMany();
  models.forEach(m => console.log(`${m.id} | ${m.name}`));

  console.log('\n--- Deployments ---');
  const deployments = await prisma.deployment.findMany({
    include: { model: true }
  });
  deployments.forEach(d => console.log(`${d.id} | ${d.model.name} | ${d.endpoint}`));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
