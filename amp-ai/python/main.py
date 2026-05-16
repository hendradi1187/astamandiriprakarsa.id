from __future__ import annotations

import argparse
import sys

from dotenv import load_dotenv

load_dotenv()

from runtime import list_agents, load_agent, run_agent, run_pipeline


def main() -> int:
    parser = argparse.ArgumentParser(prog="amp-ai", description="AMP AI Python runtime")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("list", help="list available agents")

    p_agent = sub.add_parser("agent", help="run a single agent")
    p_agent.add_argument("--agent", required=True, help="agent slug, e.g. architect")
    p_agent.add_argument("--input", required=True, help="user input text")

    p_pipe = sub.add_parser("pipeline", help="run full LangGraph workflow")
    p_pipe.add_argument("--input", required=True, help="user input text")
    p_pipe.add_argument("--workflow", default="architecture-pipeline")

    args = parser.parse_args()

    if args.command == "list":
        print("Available agents:")
        for a in list_agents():
            print(f"  - {a}")
        return 0

    if args.command == "agent":
        agent = load_agent(args.agent)
        output = run_agent(agent, args.input, {})
        print("\n" + output)
        return 0

    if args.command == "pipeline":
        results = run_pipeline(args.input, args.workflow)
        print("\n=== Final outputs ===")
        for slug, output in results.items():
            print(f"\n--- {slug} ---\n{output}")
        return 0

    parser.print_help()
    return 1


if __name__ == "__main__":
    sys.exit(main())
