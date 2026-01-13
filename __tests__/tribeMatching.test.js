const assert = require('assert');
const { recommendTribes } = require('../utils/tribeMatching.cjs');

const sampleTribes = [
  { id: 'a', name: 'Run Club', attributes: { activity: 'running', focus: 'fitness' } },
  { id: 'b', name: 'Designers', attributes: { activity: 'design', focus: 'portfolio' } },
  { id: 'c', name: 'Marketers', attributes: { activity: 'marketing', focus: 'growth' } },
];

function runTests() {
  const userPrefs = { activity: 'design', focus: 'portfolio' };
  const recs = recommendTribes(userPrefs, sampleTribes, { topK: 3 });
  assert.ok(Array.isArray(recs), 'recs should be array');
  assert.ok(recs.length >= 1, 'expect at least one rec');
  // top result should be designers
  const top = recs[0];
  console.log('Top recommendation:', top.tribe.name, 'score', top.score);
  assert.strictEqual(top.tribe.name, 'Designers');
  assert.ok(top.score > 0.9, 'expected high score for exact match');
  console.log('All tests passed');
}

if (require.main === module) runTests();
