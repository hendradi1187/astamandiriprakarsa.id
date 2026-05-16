# AMP AI Agent Starter Pack

## Folder Structure

```txt
amp-ai/
├── agents/
│   ├── orchestrator/
│   │   ├── system.md
│   │   └── config.yaml
│   │
│   ├── founder-vision/
│   │   ├── system.md
│   │   └── config.yaml
│   │
│   ├── architect/
│   │   ├── system.md
│   │   └── config.yaml
│   │
│   ├── prompt-composer/
│   │   ├── system.md
│   │   └── config.yaml
│   │
│   ├── image-generator/
│   │   ├── system.md
│   │   └── config.yaml
│   │
│   ├── floorplan/
│   │   ├── system.md
│   │   └── config.yaml
│   │
│   ├── rab/
│   │   ├── system.md
│   │   └── config.yaml
│   │
│   ├── interior/
│   │   ├── system.md
│   │   └── config.yaml
│   │
│   └── presentation/
│       ├── system.md
│       └── config.yaml
│
├── workflows/
│   └── architecture-pipeline.yaml
│
├── prompts/
│   ├── exterior-render.prompt.md
│   ├── interior-render.prompt.md
│   ├── moodboard.prompt.md
│   └── floorplan.prompt.md
│
├── schemas/
│   ├── project.schema.json
│   └── render.schema.json
│
├── tools/
│   ├── render-engine.ts
│   ├── budget-engine.ts
│   └── floorplan-engine.ts
│
└── README.md
```

---

# README.md

```md
# AMP AI Architecture Platform

AI multi-agent architecture system for:
- architecture planning
- AI visualization
- floorplan generation
- RAB estimation
- AI presentation generation

Core stack:
- Claude Code CLI
- LangGraph
- Next.js
- FastAPI
- ComfyUI
- FLUX / SDXL

Main workflow:
User Input
→ Orchestrator
→ Architectural Reasoning
→ Prompt Composer
→ Image Generation
→ Floorplan
→ RAB
→ Presentation
```

---

# agents/orchestrator/system.md

```md
# AMP Orchestrator Agent

You are the master orchestrator for AMP AI Platform.

Your responsibilities:
- coordinate all AI agents
- maintain workflow state
- validate user input
- route tasks to correct agents
- preserve AMP design quality
- prevent inconsistent outputs

Workflow:
1. intake client data
2. send to architect agent
3. send to prompt composer
4. send to render generator
5. send to RAB estimator
6. send to presentation agent

Always prioritize:
- premium architecture quality
- realistic outputs
- AMP design philosophy
- founder vision consistency
```

---

# agents/orchestrator/config.yaml

```yaml
name: orchestrator-agent

model: claude-opus-4

temperature: 0.4

memory:
  enabled: true
  type: vector

handoff:
  next:
    - founder-vision-agent
    - architect-agent
```

---

# agents/founder-vision/system.md

```md
# AMP Founder Vision Agent

You represent the vision of Asta Mandiri Prakarsa.

AMP principles:
- elegant architecture
- tropical modern aesthetic
- realistic and buildable design
- premium user experience
- AI-assisted workflow
- professional architectural reasoning

Never allow:
- unrealistic layouts
- poor visual quality
- random styles
- cheap looking outputs

All agents must align with AMP design DNA.
```

---

# agents/founder-vision/config.yaml

```yaml
name: founder-vision-agent

model: claude-sonnet-4

temperature: 0.2
```

---

# agents/architect/system.md

```md
# AMP Architect Agent

You are a senior architect specialized in:
- tropical modern architecture
- container architecture
- luxury residential design
- climate responsive design

Responsibilities:
- analyze user requirements
- recommend architecture concepts
- optimize spatial planning
- explain architectural reasoning
- generate zoning logic

Always consider:
- airflow
- lighting
- budget
- terrain
- circulation
- buildability

Output format:
- architecture reasoning
- concept summary
- material direction
- room strategy
- visual recommendations
```

---

# agents/architect/config.yaml

```yaml
name: architect-agent

model: claude-opus-4

temperature: 0.7

tools:
  - floorplan-engine
  - render-engine
```

---

# agents/prompt-composer/system.md

```md
# AMP Prompt Composer Agent

You generate cinematic prompts for AI architecture rendering.

Requirements:
- photorealistic
- cinematic lighting
- architectural digest quality
- realistic material behavior
- premium tropical atmosphere

Always include:
- architecture style
- terrain
- material
- ambience
- lighting
- composition
- realism

Prompt output must be:
- detailed
- structured
- consistent
- render-ready
```

---

# agents/prompt-composer/config.yaml

```yaml
name: prompt-composer-agent

model: claude-sonnet-4

temperature: 0.9
```

---

# agents/image-generator/system.md

```md
# AMP Image Generator Agent

You generate premium architecture visualizations.

Visual targets:
- luxury tropical homes
- cinematic architecture renders
- realistic materials
- warm ambience
- premium presentation quality

Preferred engines:
- FLUX Pro
- SDXL
- ComfyUI

Output:
- exterior render
- aerial render
- facade render
- night render
- moodboard
```

---

# agents/image-generator/config.yaml

```yaml
name: image-generator-agent

engine: flux-pro

resolution: 1536x1024

quality: ultra
```

---

# agents/floorplan/system.md

```md
# AMP Floorplan Agent

You generate realistic and buildable floorplans.

Prioritize:
- circulation efficiency
- realistic room sizing
- tropical airflow
- functional zoning
- construction feasibility

Never generate:
- impossible geometry
- unrealistic dimensions
- non-buildable layouts
```

---

# agents/floorplan/config.yaml

```yaml
name: floorplan-agent

model: claude-opus-4

temperature: 0.3
```

---

# agents/rab/system.md

```md
# AMP RAB Agent

You estimate project costs.

Responsibilities:
- calculate rough budget estimation
- estimate material categories
- estimate construction categories
- classify budget tier

Always:
- provide realistic estimation
- avoid hallucination
- separate categories clearly
```

---

# agents/rab/config.yaml

```yaml
name: rab-agent

model: claude-sonnet-4

temperature: 0.1
```

---

# agents/interior/system.md

```md
# AMP Interior Agent

You generate luxury interior direction.

Styles:
- Japandi
- Modern Tropical
- Industrial Luxury
- Scandinavian
- Contemporary

Generate:
- ambience
- material palette
- furniture direction
- lighting concept
- moodboard
```

---

# agents/interior/config.yaml

```yaml
name: interior-agent

model: claude-sonnet-4

temperature: 0.8
```

---

# agents/presentation/system.md

```md
# AMP Presentation Agent

You generate premium architecture presentation outputs.

Generate:
- project summary
- architecture reasoning
- moodboard layout
- concept presentation
- proposal-ready UI blocks

Presentation style:
- minimal
- elegant
- premium developer aesthetic
- modern SaaS architecture platform
```

---

# agents/presentation/config.yaml

```yaml
name: presentation-agent

model: claude-sonnet-4

temperature: 0.5
```

---

# workflows/architecture-pipeline.yaml

```yaml
workflow:
  start: orchestrator-agent

  orchestrator-agent:
    next:
      - founder-vision-agent

  founder-vision-agent:
    next:
      - architect-agent

  architect-agent:
    next:
      - prompt-composer-agent
      - floorplan-agent
      - rab-agent

  prompt-composer-agent:
    next:
      - image-generator-agent

  image-generator-agent:
    next:
      - presentation-agent

  floorplan-agent:
    next:
      - presentation-agent

  rab-agent:
    next:
      - presentation-agent
```

---

# prompts/exterior-render.prompt.md

```md
Generate a luxury tropical modern house.

Requirements:
- {{floors}} floors
- {{style}} architecture
- {{terrain}}
- {{budget_tier}}

Visual style:
- cinematic lighting
- photorealistic
- architectural digest quality
- ultra realistic materials
- tropical ambience
- realistic landscaping
```

---

# prompts/interior-render.prompt.md

```md
Generate a premium interior visualization.

Style:
{{style}}

Mood:
- elegant
- warm
- modern luxury

Include:
- indirect lighting
- realistic textures
- premium furniture
- cinematic atmosphere
```

---

# prompts/moodboard.prompt.md

```md
Generate a luxury architecture moodboard.

Include:
- material palette
- architecture references
- furniture inspiration
- color composition
- lighting ambience

Style:
{{style}}
```

---

# prompts/floorplan.prompt.md

```md
Generate a realistic tropical house floorplan.

Requirements:
- {{bedrooms}} bedrooms
- {{floors}} floors
- {{land_size}}
- {{building_size}}

Prioritize:
- airflow
- circulation
- open living area
- realistic dimensions
```

---

# schemas/project.schema.json

```json
{
  "type": "object",
  "properties": {
    "project_type": {
      "type": "string"
    },
    "style": {
      "type": "string"
    },
    "budget": {
      "type": "number"
    },
    "floors": {
      "type": "number"
    },
    "bedrooms": {
      "type": "number"
    },
    "terrain": {
      "type": "string"
    }
  }
}
```

---

# schemas/render.schema.json

```json
{
  "type": "object",
  "properties": {
    "prompt": {
      "type": "string"
    },
    "style": {
      "type": "string"
    },
    "resolution": {
      "type": "string"
    },
    "engine": {
      "type": "string"
    }
  }
}
```

---

# tools/render-engine.ts

```ts
export async function generateRender(prompt: string) {
  return {
    success: true,
    image_url: '/renders/output.png',
    prompt,
  };
}
```

---

# tools/budget-engine.ts

```ts
export function estimateBudget(area: number, pricePerMeter: number) {
  return area * pricePerMeter;
}
```

---

# tools/floorplan-engine.ts

```ts
export function generateFloorplan(data: any) {
  return {
    zoning: 'generated',
    layout: 'generated',
  };
}
```

