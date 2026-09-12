// Karya smart matching engine.
// Kept isolated from UI so it can later be replaced by a real
// recommendation service without touching component code.

const matchingWeights = {
  location: 0.35,
  skill: 0.3,
  availability: 0.15,
  rating: 0.1,
  price: 0.1,
};

/** Normalize a value between 0 and 1 given a max reference. */
function normalize(value, max) {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(1, value / max));
}

/** Closer distance -> higher score. Caps benefit beyond 15km. */
function locationScore(distanceKm) {
  return 1 - normalize(distanceKm, 15);
}

/** Fraction of requested skills the worker actually has. */
function skillScore(workerSkills = [], requestedSkill) {
  if (!requestedSkill) return 0.5;
  const needle = requestedSkill.toLowerCase();
  const hit = workerSkills.some(
    (s) => s.toLowerCase().includes(needle) || needle.includes(s.toLowerCase())
  );
  return hit ? 1 : 0.25;
}

/** Simple heuristic: workers marked available "today"/flexible score higher. */
function availabilityScore(availability = "") {
  const a = availability.toLowerCase();
  if (a.includes("sun")) return 1;
  if (a.includes("sat")) return 0.85;
  if (a.includes("seasonal")) return 0.4;
  return 0.65;
}

function ratingScore(rating = 0) {
  return normalize(rating, 5);
}

/** Lower price relative to the customer's budget scores higher. */
function priceScore(price, budget) {
  if (!budget) return 0.6;
  if (price <= budget) return 1;
  const overBy = (price - budget) / budget;
  return Math.max(0, 1 - overBy);
}

/**
 * Ranks workers against a service request.
 * request: { skill, budget, distanceOverride }
 */
export function rankWorkers(workerList, request = {}) {
  const scored = workerList.map((worker) => {
    const breakdown = {
      location: locationScore(worker.distanceKm),
      skill: skillScore(worker.skills, request.skill),
      availability: availabilityScore(worker.availability),
      rating: ratingScore(worker.rating),
      price: priceScore(worker.price, request.budget),
    };

    const matchScore =
      breakdown.location * matchingWeights.location +
      breakdown.skill * matchingWeights.skill +
      breakdown.availability * matchingWeights.availability +
      breakdown.rating * matchingWeights.rating +
      breakdown.price * matchingWeights.price;

    return {
      ...worker,
      matchScore,
      matchPercent: Math.round(matchScore * 100),
      breakdown,
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore);
}
