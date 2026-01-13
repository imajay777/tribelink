/**
 * Lightweight preference-based tribe matching utilities.
 *
 * Algorithm design goals:
 * - Flexible: accept heterogeneous preference types (string, number, boolean, array).
 * - Interpretable: return normalized scores (0..1) and per-attribute breakdowns.
 * - Fast: pure JS, no deps, easy to run on-device.
 *
 * Usage:
 *  import { recommendTribes } from '@/utils/tribeMatching';
 *  const recs = recommendTribes(userPrefs, tribeProfiles, { topK: 5 });
 */

export type Prefs = Record<string, any>;
export type TribeProfile = {
  id: string;
  name: string;
  attributes: Record<string, any>;
  [key: string]: any;
};

type RecommendOptions = {
  topK?: number;
  weights?: Record<string, number>;
  numericMax?: number; // used when comparing numeric attributes (default 10)
};

function scoreAttribute(uVal: any, tVal: any, numericMax = 10): number {
  if (uVal === undefined || uVal === null) return 0;
  if (tVal === undefined || tVal === null) return 0;

  // strings: exact match (case-insensitive)
  if (typeof uVal === 'string' && typeof tVal === 'string') {
    return uVal.trim().toLowerCase() === tVal.trim().toLowerCase() ? 1 : 0;
  }

  // booleans
  if (typeof uVal === 'boolean' && typeof tVal === 'boolean') {
    return uVal === tVal ? 1 : 0;
  }

  // numbers: closeness
  if (typeof uVal === 'number' && typeof tVal === 'number') {
    const diff = Math.abs(uVal - tVal);
    return Math.max(0, 1 - diff / Math.max(1, numericMax));
  }

  // arrays: Jaccard-style overlap
  if (Array.isArray(uVal) && Array.isArray(tVal)) {
    const setA = new Set(uVal.map((x) => String(x).toLowerCase()));
    const setB = new Set(tVal.map((x) => String(x).toLowerCase()));
    const intersect = [...setA].filter((x) => setB.has(x)).length;
    const union = new Set([...setA, ...setB]).size || 1;
    return intersect / union;
  }

  // mixed types or fallback: strict equality
  return String(uVal).toLowerCase() === String(tVal).toLowerCase() ? 1 : 0;
}

export function scoreMatch(userPrefs: Prefs, tribeAttrs: Record<string, any>, weights?: Record<string, number>, numericMax = 10) {
  const keys = Object.keys(userPrefs || {});
  if (keys.length === 0) return { score: 0, breakdown: {} };

  let totalWeight = 0;
  let weightedSum = 0;
  const breakdown: Record<string, number> = {};

  for (const k of keys) {
    const uVal = userPrefs[k];
    const tVal = tribeAttrs?.[k];
    const w = (weights && weights[k]) || 1;
    const s = scoreAttribute(uVal, tVal, numericMax);
    breakdown[k] = s;
    weightedSum += s * w;
    totalWeight += w;
  }

  const score = totalWeight > 0 ? weightedSum / totalWeight : 0;
  return { score: Math.max(0, Math.min(1, score)), breakdown };
}

export function recommendTribes(userPrefs: Prefs, tribes: TribeProfile[], opts: RecommendOptions = {}) {
  const { topK = 5, weights, numericMax = 10 } = opts;

  const scored = tribes.map((t) => {
    const { score, breakdown } = scoreMatch(userPrefs, t.attributes || {}, weights, numericMax);
    return { tribe: t, score, breakdown };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

export function explainRecommendation(userPrefs: Prefs, tribe: TribeProfile, opts: RecommendOptions = {}) {
  const { score, breakdown } = scoreMatch(userPrefs, tribe.attributes || {}, opts.weights, opts.numericMax);
  return { tribeId: tribe.id, tribeName: tribe.name, score, breakdown };
}
