import { prisma } from '../db.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export interface SandboxConfig {
  runtime: 'python' | 'r' | 'julia';
  cpuLimit: number;
  memoryLimit: string;
}

export class SandboxService {
  async createSandbox(projectId: string, config: SandboxConfig) {
    const sandbox = await prisma.sandbox.create({
      data: {
        projectId,
        runtime: config.runtime,
        status: 'STARTING',
        resourceLimit: JSON.stringify({ cpu: config.cpuLimit, memory: config.memoryLimit }),
      },
    });

    try {
      // In a real cloud environment, this would call Docker/K8s API
      // For this sandbox, we'll simulate the container ID
      const mockContainerId = `sandbox-${sandbox.id}`;
      
      await prisma.sandbox.update({
        where: { id: sandbox.id },
        data: {
          status: 'RUNNING',
          containerId: mockContainerId,
        },
      });

      return { ...sandbox, status: 'RUNNING', containerId: mockContainerId };
    } catch (error) {
      await prisma.sandbox.update({
        where: { id: sandbox.id },
        data: { status: 'FAILED' },
      });
      throw error;
    }
  }

  async executeCode(sandboxId: string, code: string) {
    const sandbox = await prisma.sandbox.findUnique({
      where: { id: sandboxId },
    });

    if (!sandbox || sandbox.status !== 'RUNNING') {
      throw new Error('Sandbox not found or not running');
    }

    // Mock execution for now - in production this would send to the container
    console.log(`Executing ${sandbox.runtime} code in ${sandbox.containerId}: ${code}`);
    
    // Simulate execution result
    return {
      stdout: `Mock output for ${sandbox.runtime} execution`,
      stderr: '',
      executionTime: '120ms',
    };
  }

  async stopSandbox(sandboxId: string) {
    await prisma.sandbox.update({
      where: { id: sandboxId },
      data: { status: 'STOPPED' },
    });
    // In production: stop and remove container
  }
}

export const sandboxService = new SandboxService();
