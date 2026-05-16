from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import anthropic
import yaml

ROOT = Path(__file__).resolve().parents[2]

MODEL_MAP = {
    "claude-opus-4": "claude-opus-4-7",
    "claude-opus-4-7": "claude-opus-4-7",
    "claude-opus-4-6": "claude-opus-4-6",
    "claude-sonnet-4": "claude-sonnet-4-6",
    "claude-sonnet-4-6": "claude-sonnet-4-6",
    "claude-haiku-4-5": "claude-haiku-4-5",
}


def resolve_model(name: str | None) -> str:
    if not name:
        return os.environ.get("AMP_DEFAULT_MODEL", "claude-opus-4-7")
    return MODEL_MAP.get(name, name)


@dataclass
class LoadedAgent:
    slug: str
    config: dict[str, Any]
    system_prompt: str


_client: anthropic.Anthropic | None = None


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        if not os.environ.get("ANTHROPIC_API_KEY"):
            raise RuntimeError(
                "ANTHROPIC_API_KEY is not set. Copy .env.example to .env and fill it in."
            )
        _client = anthropic.Anthropic()
    return _client


def load_agent(slug: str) -> LoadedAgent:
    agent_dir = ROOT / "agents" / slug
    system_prompt = (agent_dir / "system.md").read_text(encoding="utf-8")
    config = yaml.safe_load((agent_dir / "config.yaml").read_text(encoding="utf-8"))
    return LoadedAgent(slug=slug, config=config, system_prompt=system_prompt)


def list_agents() -> list[str]:
    return sorted(p.name for p in (ROOT / "agents").iterdir() if p.is_dir())


def _build_user_message(user_input: str, results: dict[str, str]) -> str:
    if not results:
        return user_input
    upstream = "\n\n".join(
        f"### Upstream agent: {name}\n{output}" for name, output in results.items()
    )
    return f"# User request\n{user_input}\n\n# Upstream agent outputs\n{upstream}"


def run_agent(agent: LoadedAgent, user_input: str, results: dict[str, str]) -> str:
    if agent.config.get("engine") or agent.slug == "image-generator":
        from .tools import generate_render

        prompt = _build_user_message(user_input, results)
        result = generate_render(
            prompt,
            engine=agent.config.get("engine"),
            resolution=agent.config.get("resolution"),
            quality=agent.config.get("quality"),
        )
        import json

        return json.dumps(result, indent=2)

    model = resolve_model(agent.config.get("model"))
    client = _get_client()

    with client.messages.stream(
        model=model,
        max_tokens=16000,
        thinking={"type": "adaptive"},
        system=[
            {
                "type": "text",
                "text": agent.system_prompt,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        messages=[{"role": "user", "content": _build_user_message(user_input, results)}],
    ) as stream:
        message = stream.get_final_message()

    return "\n".join(block.text for block in message.content if block.type == "text")
