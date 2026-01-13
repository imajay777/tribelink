/**
 * CommonJS copy of tribe matching helper for simple Node tests.
 */
function scoreAttribute(uVal, tVal, numericMax = 10) {
  if (uVal === undefined || uVal === null) return 0;
  if (tVal === undefined || tVal === null) return 0;
  if (typeof uVal === 'string' && typeof tVal === 'string') {
    return uVal.trim().toLowerCase() === tVal.trim().toLowerCase() ? 1 : 0;
  }
  if (typeof uVal === 'boolean' && typeof tVal === 'boolean') return uVal === tVal ? 1 : 0;
  if (typeof uVal === 'number' && typeof tVal === 'number') {
    const diff = Math.abs(uVal - tVal);
    return Math.max(0, 1 - diff / Math.max(1, numericMax));
  }
  if (Array.isArray(uVal) && Array.isArray(tVal)) {
    const setA = new Set(uVal.map((x) => String(x).toLowerCase()));
    const setB = new Set(tVal.map((x) => String(x).toLowerCase()));
    const intersect = [...setA].filter((x) => setB.has(x)).length;
    const union = new Set([...setA, ...setB]).size || 1;
    return intersect / union;
  }
  return String(uVal).toLowerCase() === String(tVal).toLowerCase() ? 1 : 0;
}

function scoreMatch(userPrefs, tribeAttrs, weights, numericMax = 10) {
  const keys = Object.keys(userPrefs || {});
  if (keys.length === 0) return { score: 0, breakdown: {} };
  let totalWeight = 0;
  let weightedSum = 0;
  const breakdown = {};
  for (const k of keys) {
    const uVal = userPrefs[k];
    const tVal = tribeAttrs && tribeAttrs[k];
    const w = (weights && weights[k]) || 1;
    const s = scoreAttribute(uVal, tVal, numericMax);
    breakdown[k] = s;
    weightedSum += s * w;
    totalWeight += w;
  }
  const score = totalWeight > 0 ? weightedSum / totalWeight : 0;
  return { score: Math.max(0, Math.min(1, score)), breakdown };
}

function recommendTribes(userPrefs, tribes, opts) {
  const topK = (opts && opts.topK) || 5;
  const numericMax = (opts && opts.numericMax) || 10;
  const scored = tribes.map((t) => {
    const { score, breakdown } = scoreMatch(userPrefs, t.attributes || {}, opts && opts.weights, numericMax);
    return { tribe: t, score, breakdown };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

module.exports = { scoreAttribute, scoreMatch, recommendTribes };
