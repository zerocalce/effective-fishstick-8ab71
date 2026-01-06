import { Router } from 'express';
import { prisma } from '../db.js';
import { sandboxService } from '../services/sandboxService.js';
import { deploymentService } from '../services/deploymentService.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Apply authentication to all API routes
router.use(authenticate);

// Project Routes
router.post('/projects', async (req, res) => {
  const { name, description, userId } = req.body;
  try {
    const project = await prisma.project.create({
      data: { name, description, userId },
    });
    res.status(201).json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/projects/:userId', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.params.userId },
      include: { sandboxes: true },
    });
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Sandbox Routes
router.post('/sandboxes', async (req, res) => {
  const { projectId, runtime, cpuLimit, memoryLimit } = req.body;
  try {
    const sandbox = await sandboxService.createSandbox(projectId, {
      runtime,
      cpuLimit,
      memoryLimit,
    });
    res.status(201).json(sandbox);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/sandboxes/:id/execute', async (req, res) => {
  const { code } = req.body;
  try {
    const result = await sandboxService.executeCode(req.params.id, code);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Deployment Routes
router.get('/models', async (req, res) => {
  try {
    const models = await prisma.model.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(models);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/deployments', async (req, res) => {
  try {
    const deployments = await prisma.deployment.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(deployments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/deployments', async (req, res) => {
  const { modelId, platform, resourceType } = req.body;
  try {
    const deployment = await deploymentService.deployModel({
      modelId,
      platform,
      resourceType,
    });
    res.status(201).json(deployment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/deployments/:id', async (req, res) => {
  try {
    await deploymentService.deleteDeployment(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/deployments', async (req, res) => {
  try {
    await deploymentService.clearAllDeployments();
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/deployments/:id/test', async (req, res) => {
  try {
    const result = await deploymentService.testInference(req.params.id, req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/models/:id/export', async (req, res) => {
  const { format } = req.body;
  try {
    const result = await deploymentService.exportModel(req.params.id, format);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
