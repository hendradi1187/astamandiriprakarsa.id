#!/usr/bin/env node
import 'dotenv/config';
import { listAgents, loadAgent, runAgent } from './runtime/agent.ts';
import { runWorkflow } from './runtime/workflow.ts';

function parseArgs(argv: string[]): { command: string; rest: Record<string, string> } {
  const [, , command, ...rest] = argv;
  const args: Record<string, string> = {};
  for (let i = 0; i < rest.length; i++) {
    const token = rest[i];
    if (token.startsWith('--')) {
      const key = token.slice(2);
      const next = rest[i + 1];
      if (!next || next.startsWith('--')) {
        args[key] = 'true';
      } else {
        args[key] = next;
        i++;
      }
    }
  }
  return { command: command ?? 'help', rest: args };
}

const HELP = `
AMP AI CLI

Usage:
  npm run list                                    list available agents
  npm run agent -- --agent <slug> --input "..."   run a single agent
  npm run pipeline -- --input "..."               run full workflow

Examples:
  npm run agent -- --agent architect --input "2-floor tropical house in Bali, budget 2.5B IDR"
  npm run pipeline -- --input "Luxury container villa on 500m2 land"
`;

async function main() {
  const { command, rest } = parseArgs(process.argv);

  if (command === 'list') {
    const agents = await listAgents();
    console.log('Available agents:');
    for (const a of agents) console.log(`  - ${a}`);
    return;
  }

  if (command === 'agent') {
    const slug = rest.agent;
    const input = rest.input;
    if (!slug || !input) {
      console.error('Usage: npm run agent -- --agent <slug> --input "..."');
      process.exit(1);
    }
    const agent = await loadAgent(slug);
    const output = await runAgent(agent, { userInput: input, results: {} });
    console.log('\n' + output);
    return;
  }

  if (command === 'pipeline') {
    const input = rest.input;
    if (!input) {
      console.error('Usage: npm run pipeline -- --input "..."');
      process.exit(1);
    }
    const ctx = await runWorkflow(input, rest.workflow);
    console.log('\n=== Final outputs ===');
    for (const [slug, output] of Object.entries(ctx.results)) {
      console.log(`\n--- ${slug} ---\n${output}`);
    }
    return;
  }

  console.log(HELP);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
