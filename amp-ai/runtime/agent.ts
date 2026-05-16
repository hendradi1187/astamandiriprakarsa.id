import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import YAML from 'yaml';
import type { AgentConfig, LoadedAgent, RunContext } from './types.ts';
import { resolveModel } from './model-map.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set. Copy .env.example to .env and fill it in.');
    }
    client = new Anthropic();
  }
  return client;
}

export async function loadAgent(slug: string): Promise<LoadedAgent> {
  const dir = path.join(ROOT, 'agents', slug);
  const [systemPrompt, configRaw] = await Promise.all([
    fs.readFile(path.join(dir, 'system.md'), 'utf-8'),
    fs.readFile(path.join(dir, 'config.yaml'), 'utf-8'),
  ]);
  const config = YAML.parse(configRaw) as AgentConfig;
  return { slug, config, systemPrompt };
}

export async function listAgents(): Promise<string[]> {
  const dir = path.join(ROOT, 'agents');
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

function buildUserMessage(ctx: RunContext): string {
  if (Object.keys(ctx.results).length === 0) return ctx.userInput;
  const upstream = Object.entries(ctx.results)
    .map(([name, out]) => `### Upstream agent: ${name}\n${out}`)
    .join('\n\n');
  return `# User request\n${ctx.userInput}\n\n# Upstream agent outputs\n${upstream}`;
}

export async function runAgent(agent: LoadedAgent, ctx: RunContext): Promise<string> {
  if (agent.config.engine || agent.slug === 'image-generator') {
    const { generateRender } = await import('../tools/render-engine.ts');
    const promptText = buildUserMessage(ctx);
    const result = await generateRender(promptText, {
      engine: agent.config.engine,
      resolution: agent.config.resolution,
      quality: agent.config.quality,
    });
    return JSON.stringify(result, null, 2);
  }

  const model = resolveModel(agent.config.model);
  const stream = await getClient().messages.stream({
    model,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    system: [
      {
        type: 'text',
        text: agent.systemPrompt,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: buildUserMessage(ctx) }],
  });

  const message = await stream.finalMessage();
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
}
