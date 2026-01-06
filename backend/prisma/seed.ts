import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding deployment data...');

  // 1. Find or create a user
  const user = await prisma.user.upsert({
    where: { email: 'math-smite-lance@duck.com' },
    update: {},
    create: {
      email: 'math-smite-lance@duck.com',
      name: 'Studio Admin',
      password: 'lance@duck.com', // In a real app, this would be hashed
    },
  });

  // 2. Create a project
  const project = await prisma.project.create({
    data: {
      name: 'MNIST Classification',
      description: 'Handwritten digit recognition model.',
      userId: user.id,
    },
  });

  // 3. Create a model
  const model = await prisma.model.create({
    data: {
      name: 'MNIST-v1',
      version: '1.0.4',
      framework: 'PyTorch',
      path: '/models/mnist_v1.pt',
      metrics: JSON.stringify({ accuracy: 0.985, loss: 0.02 }),
      projectId: project.id,
    },
  });

  // 4. Create a deployment
  const deployment = await prisma.deployment.create({
    data: {
      modelId: model.id,
      status: 'ACTIVE',
      endpoint: 'https://api.ai-studio.io/v1/models/mnist-v1-8f2e4a1b',
      platform: 'AWS Lambda',
      resourceType: 'GPU-Small',
    },
  });

  console.log('Seed completed successfully!');
  console.log('Created Project:', project.name);
  console.log('Created Model:', model.name);
  console.log('Created Deployment:', deployment.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
