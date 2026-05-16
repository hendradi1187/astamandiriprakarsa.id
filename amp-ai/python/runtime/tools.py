from __future__ import annotations

import base64
from typing import Any


def generate_render(
    prompt: str,
    *,
    engine: str | None = None,
    resolution: str | None = None,
    quality: str | None = None,
) -> dict[str, Any]:
    engine = engine or "flux-pro"
    resolution = resolution or "1536x1024"
    quality = quality or "ultra"
    digest = base64.urlsafe_b64encode(prompt.encode("utf-8")).decode("ascii")[:12]
    return {
        "success": True,
        "engine": engine,
        "resolution": resolution,
        "quality": quality,
        "prompt": prompt,
        "image_url": f"/renders/mock-{digest}.png",
        "mock": True,
    }


TIER_PRICES = {
    "standard": 6_500_000,
    "premium": 9_500_000,
    "luxury": 14_000_000,
}


def estimate_budget(area_m2: float, tier: str = "premium") -> dict[str, Any]:
    per_m2 = TIER_PRICES[tier]
    total = area_m2 * per_m2
    return {
        "total_idr": total,
        "per_m2_idr": per_m2,
        "tier": tier,
        "categories": {
            "structure": round(total * 0.32),
            "finishing": round(total * 0.28),
            "mep": round(total * 0.18),
            "interior": round(total * 0.14),
            "landscape": round(total * 0.08),
        },
    }


def generate_floorplan(
    *,
    floors: int = 2,
    bedrooms: int = 3,
    **_: Any,
) -> dict[str, Any]:
    layout = []
    for f in range(1, floors + 1):
        if f == 1:
            layout.append(
                {
                    "floor": 1,
                    "rooms": ["foyer", "living", "dining", "kitchen", "powder", "service"],
                }
            )
        else:
            count = -(-bedrooms // max(floors - 1, 1))
            rooms = ["master suite"] + [f"bedroom {i + 2}" for i in range(count - 1)] + ["family lounge"]
            layout.append({"floor": f, "rooms": rooms})

    return {
        "zoning": ["public-front", "private-rear", "service-side"],
        "layout": layout,
        "mock": True,
    }
