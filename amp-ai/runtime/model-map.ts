const MODEL_MAP: Record<string, string> = {
  'claude-opus-4': 'claude-opus-4-7',
  'claude-opus-4-7': 'claude-opus-4-7',
  'claude-opus-4-6': 'claude-opus-4-6',
  'claude-sonnet-4': 'claude-sonnet-4-6',
  'claude-sonnet-4-6': 'claude-sonnet-4-6',
  'claude-haiku-4-5': 'claude-haiku-4-5',
};

export function resolveModel(name: string | undefined): string {
  if (!name) return process.env.AMP_DEFAULT_MODEL ?? 'claude-opus-4-7';
  return MODEL_MAP[name] ?? name;
}
