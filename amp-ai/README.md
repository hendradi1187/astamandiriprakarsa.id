# AMP AI Architecture Platform

AI multi-agent architecture system for:
- architecture planning
- AI visualization
- floorplan generation
- RAB estimation
- AI presentation generation

## Stack

- **Agents (declarative)**: `agents/<slug>/system.md` + `config.yaml`
- **TypeScript runtime**: `runtime/`, entry via `cli.ts` — for Next.js / Node.js integration
- **Python runtime**: `python/runtime/`, entry via `python/main.py` — uses LangGraph for the pipeline
- **Tools**: TypeScript stubs in `tools/`, Python equivalents in `python/runtime/tools.py`
- **Workflows**: `workflows/*.yaml`

Image generation (FLUX / SDXL / ComfyUI) is **mocked** in both runtimes — wire real backends into `tools/render-engine.ts` and `python/runtime/tools.py` when ready.

## Setup

### 1. Get an Anthropic API key

```bash
cp .env.example .env
# edit .env and set ANTHROPIC_API_KEY=sk-ant-...
```

### 2a. TypeScript runtime (recommended for Next.js integration)

```bash
npm install

# list agents
npm run list

# run a single agent
npm run agent -- --agent architect --input "2-floor tropical house in Bali, 300m2 land, 2.5B IDR budget"

# run the full pipeline (orchestrator → founder-vision → architect → ...)
npm run pipeline -- --input "Luxury container villa, 500m2 land, modern tropical"
```

### 2b. Python runtime (LangGraph)

```bash
cd python
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt

# list agents
python main.py list

# run a single agent
python main.py agent --agent architect --input "2-floor tropical house in Bali"

# run full LangGraph pipeline
python main.py pipeline --input "Luxury container villa, 500m2 land"
```

The Python runtime reads the same `.env` from the project root.

## Architecture

```
User Input
   ↓
Orchestrator → Founder Vision → Architect
                                   ↓
                       ┌───────────┼───────────┐
                       ↓           ↓           ↓
                  Prompt Composer  Floorplan   RAB
                       ↓           ↓           ↓
                  Image Generator  ↓           ↓
                       └───────────┼───────────┘
                                   ↓
                              Presentation
```

Both runtimes follow the topological order defined in `workflows/architecture-pipeline.yaml`. The TS runtime uses a hand-rolled DAG walker; the Python runtime compiles it to a LangGraph `StateGraph`.

## Customizing agents

- Edit `agents/<slug>/system.md` to change the agent's persona / instructions
- Edit `agents/<slug>/config.yaml` to change model, temperature, or tools
- Model names in configs (`claude-opus-4`, `claude-sonnet-4`) are mapped to real IDs (`claude-opus-4-7`, `claude-sonnet-4-6`) by both runtimes — see `runtime/model-map.ts` and `python/runtime/agent.py`

## Adding a new agent

1. Create `agents/<new-slug>/system.md` and `config.yaml`
2. Add it to `workflows/architecture-pipeline.yaml` with its upstream/downstream edges
3. No code change needed — both runtimes pick it up automatically

## Replacing the image-gen mock

The `image-generator` agent is detected by its `engine:` field and routed to `tools/render-engine.ts` / `python/runtime/tools.py` instead of the LLM. Replace `generateRender` with a call to ComfyUI (`http://127.0.0.1:8188/prompt`), Replicate, or Fal.ai.

## Prompt caching

System prompts are sent with `cache_control: {type: "ephemeral"}` so reruns hit the cache (~10× cheaper input tokens). Cache hits show up in `usage.cache_read_input_tokens` on each response.
