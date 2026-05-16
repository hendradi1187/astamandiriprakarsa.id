export interface BudgetBreakdown {
  total_idr: number;
  per_m2_idr: number;
  tier: 'standard' | 'premium' | 'luxury';
  categories: Record<string, number>;
}

const TIER_PRICES: Record<string, number> = {
  standard: 6_500_000,
  premium: 9_500_000,
  luxury: 14_000_000,
};

export function estimateBudget(
  areaM2: number,
  tier: 'standard' | 'premium' | 'luxury' = 'premium',
): BudgetBreakdown {
  const perM2 = TIER_PRICES[tier];
  const total = areaM2 * perM2;
  return {
    total_idr: total,
    per_m2_idr: perM2,
    tier,
    categories: {
      structure: Math.round(total * 0.32),
      finishing: Math.round(total * 0.28),
      mep: Math.round(total * 0.18),
      interior: Math.round(total * 0.14),
      landscape: Math.round(total * 0.08),
    },
  };
}
