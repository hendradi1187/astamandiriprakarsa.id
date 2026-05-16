import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import type { RunContext, WorkflowDef } from './types.ts';
import { loadAgent, runAgent } from './agent.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function agentSlugFromName(name: string): string {
  return name.replace(/-agent$/, '');
}

export async function loadWorkflow(name = 'architecture-pipeline'): Promise<WorkflowDef> {
  const raw = await fs.readFile(path.join(ROOT, 'workflows', `${name}.yaml`), 'utf-8');
  return YAML.parse(raw) as WorkflowDef;
}

function topologicalOrder(wf: WorkflowDef): string[] {
  const nodes = new Set<string>();
  const edges: Array<[string, string]> = [];
  const inDegree = new Map<string, number>();

  for (const [key, val] of Object.entries(wf.workflow)) {
    if (key === 'start') continue;
    nodes.add(key);
    inDegree.set(key, inDegree.get(key) ?? 0);
    if (typeof val === 'object' && val?.next) {
      for (const next of val.next) {
        nodes.add(next);
        edges.push([key, next]);
        inDegree.set(next, (inDegree.get(next) ?? 0) + 1);
      }
    }
  }

  const queue: string[] = [];
  for (const node of nodes) if ((inDegree.get(node) ?? 0) === 0) queue.push(node);

  const order: string[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);
    for (const [from, to] of edges) {
      if (from !== node) continue;
      inDegree.set(to, (inDegree.get(to) ?? 1) - 1);
      if ((inDegree.get(to) ?? 0) === 0) queue.push(to);
    }
  }

  if (order.length !== nodes.size) {
    throw new Error('Workflow has a cycle');
  }
  return order;
}

export async function runWorkflow(userInput: string, workflowName?: string): Promise<RunContext> {
  const wf = await loadWorkflow(workflowName);
  const order = topologicalOrder(wf);
  const ctx: RunContext = { userInput, results: {} };

  for (const agentName of order) {
    const slug = agentSlugFromName(agentName);
    console.log(`\n→ Running ${slug}...`);
    const agent = await loadAgent(slug);
    const output = await runAgent(agent, ctx);
    ctx.results[slug] = output;
    const preview = output.replace(/\s+/g, ' ').slice(0, 120);
    console.log(`  ✓ ${slug}: ${preview}${output.length > 120 ? '...' : ''}`);
  }

  return ctx;
}
