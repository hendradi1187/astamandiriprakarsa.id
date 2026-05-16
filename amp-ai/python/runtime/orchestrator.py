from __future__ import annotations

from pathlib import Path
from typing import Annotated, Any, TypedDict

import yaml
from langgraph.graph import END, START, StateGraph

from .agent import load_agent, run_agent

ROOT = Path(__file__).resolve().parents[2]


class PipelineState(TypedDict):
    user_input: str
    results: dict[str, str]


def _merge_results(a: dict[str, str], b: dict[str, str]) -> dict[str, str]:
    return {**a, **b}


class _AnnotatedState(TypedDict):
    user_input: str
    results: Annotated[dict[str, str], _merge_results]


def _agent_slug(name: str) -> str:
    return name.removesuffix("-agent")


def _make_node(slug: str):
    def node(state: _AnnotatedState) -> dict[str, Any]:
        print(f"\n→ Running {slug}...")
        agent = load_agent(slug)
        output = run_agent(agent, state["user_input"], state.get("results", {}))
        preview = " ".join(output.split())[:120]
        print(f"  ✓ {slug}: {preview}{'...' if len(output) > 120 else ''}")
        return {"results": {slug: output}}

    return node


def build_graph(workflow_name: str = "architecture-pipeline"):
    wf_path = ROOT / "workflows" / f"{workflow_name}.yaml"
    wf = yaml.safe_load(wf_path.read_text(encoding="utf-8"))["workflow"]

    graph = StateGraph(_AnnotatedState)

    agent_names = [k for k in wf.keys() if k != "start"]
    for name in agent_names:
        graph.add_node(_agent_slug(name), _make_node(_agent_slug(name)))

    start_slug = _agent_slug(wf["start"])
    graph.add_edge(START, start_slug)

    for name, conf in wf.items():
        if name == "start" or not isinstance(conf, dict):
            continue
        nexts = conf.get("next") or []
        from_slug = _agent_slug(name)
        if not nexts:
            graph.add_edge(from_slug, END)
        else:
            for nxt in nexts:
                graph.add_edge(from_slug, _agent_slug(nxt))

    return graph.compile()


def run_pipeline(user_input: str, workflow_name: str = "architecture-pipeline") -> dict[str, str]:
    app = build_graph(workflow_name)
    final = app.invoke({"user_input": user_input, "results": {}})
    return final["results"]
