import type { WeightedItem } from '../types/WeightedList'

// A score from 0-10 representing compatibility
export type CompatibilityScore = number

export type CompatibilityEntry = {
  score: CompatibilityScore
  ratings: number // times this pair has been manually rated
}

// The matrix is keyed by [role1, role2] then [item1, item2]
export type CompatibilityMatrix = {
  [roleKey: string]: {
    [itemKey: string]: CompatibilityEntry
  }
}

// Helper to build a consistent key regardless of argument order
export function rolePairKey(role1: string, role2: string): string {
  return [role1, role2].sort().join('|')
}

export function itemPairKey(a: string, b: string): string {
  return [a, b].sort().join('|')
}

const DEFAULT_SCORE = 5

export function buildCompatibilityMatrix<RoleKey extends string, Item>(
  parts: Record<RoleKey, WeightedItem<Item>[]>,
  getItemKey: (item: Item) => string,
  defaultScore: CompatibilityScore = DEFAULT_SCORE,
  existingMatrix?: CompatibilityMatrix,
): CompatibilityMatrix {
  const roles = Object.keys(parts) as RoleKey[]
  const matrix: CompatibilityMatrix = {}

  for (let i = 0; i < roles.length; i++) {
    for (let j = i + 1; j < roles.length; j++) {
      const role1 = roles[i]
      const role2 = roles[j]
      const rKey = rolePairKey(role1, role2)
      matrix[rKey] = {}

      for (const item1 of parts[role1]) {
        for (const item2 of parts[role2]) {
          const iKey = itemPairKey(
            getItemKey(item1.value),
            getItemKey(item2.value),
          )
          matrix[rKey][iKey] = existingMatrix?.[rKey]?.[iKey] ?? { score: defaultScore, ratings: 0 }
        }
      }
    }
  }

  return matrix
}

export function getPairScore(
  matrix: CompatibilityMatrix,
  role1: string,
  item1: string,
  role2: string,
  item2: string,
  defaultScore: number = DEFAULT_SCORE, // neutral fallback for unlabeled pairs
): CompatibilityScore {
  const roleKey = rolePairKey(role1, role2)
  const ingredientKey = itemPairKey(item1, item2)
  return matrix[roleKey]?.[ingredientKey]?.score ?? defaultScore
}

export type Combo<Item = string> = {
  [role: string]: Item[]
}

export function scoreCombo<Item>(
  matrix: CompatibilityMatrix,
  combo: Combo<Item>,
  getItemKey: (item: Item) => string,
): number {
  const roles = Object.keys(combo)
  const groupScores: number[] = []

  for (let i = 0; i < roles.length; i++) {
    for (let j = i; j < roles.length; j++) {
      const role1 = roles[i]
      const role2 = roles[j]
      const ingredients1 = combo[role1]
      const ingredients2 = combo[role2]

      const pairScores: number[] = []

      for (const ing1 of ingredients1) {
        for (const ing2 of ingredients2) {
          if (getItemKey(ing1) === getItemKey(ing2)) continue // skip self-pairs
          pairScores.push(
            getPairScore(matrix, role1, getItemKey(ing1), role2, getItemKey(ing2)),
          )
        }
      }

      if (pairScores.length > 0) {
        // Average within this role-pair group
        const groupAvg =
          pairScores.reduce((a, b) => a + b, 0) / pairScores.length
        groupScores.push(groupAvg)
      }
    }
  }

  // Average across all role-pair groups
  return groupScores.reduce((a, b) => a + b, 0) / groupScores.length
}

export function weightedSelect<Item>(
  matrix: CompatibilityMatrix,
  currentCombo: Combo<Item>,
  role: string,
  candidates: WeightedItem<Item>[],
  getItemKey: (item: Item) => string,
  temperature: number = 1.0, // higher = more random, lower = more greedy
): Item {
  // Combine item likelihood with compatibility score against the current combo
  const weights = candidates.map((candidate) => {
    const pairScores: number[] = []

    for (const [existingRole, items] of Object.entries(currentCombo)) {
      for (const item of items as Item[]) {
        pairScores.push(
          getPairScore(
            matrix,
            role,
            getItemKey(candidate.value),
            existingRole,
            getItemKey(item),
          ),
        )
      }
    }

    // If no existing items yet, treat all candidates as equally compatible
    const compatScore =
      pairScores.length > 0
        ? pairScores.reduce((a, b) => a + b, 0) / pairScores.length
        : DEFAULT_SCORE

    // Likelihood scales the compatibility-derived probability;
    // equal compat scores degrade to pure likelihood-based selection
    return (candidate.likelihood ?? 1) * Math.exp(compatScore / temperature)
  })

  const totalWeight = weights.reduce((a, b) => a + b, 0)
  const probabilities = weights.map((w) => w / totalWeight)

  // Sample from the weighted distribution
  const rand = Math.random()
  let cumulative = 0
  for (let i = 0; i < candidates.length; i++) {
    cumulative += probabilities[i]
    if (rand <= cumulative) return candidates[i].value
  }

  return candidates[candidates.length - 1].value // fallback
}

export function generateCombo<Item>(
  matrix: CompatibilityMatrix,
  ingredients: { [role: string]: WeightedItem<Item>[] },
  roleOrder: string[],
  countSampler: (role: string, currentCombo: Combo<Item>) => number,
  getItemKey: (item: Item) => string,
): Combo<Item> {
  const combo: Combo<Item> = {}

  for (const role of roleOrder) {
    const count = countSampler(role, combo)
    const candidates = [...ingredients[role]]
    combo[role] = []

    for (let i = 0; i < count; i++) {
      // Remove already selected items from candidates
      const remaining = candidates.filter(
        (c) => !combo[role].some((selected) => getItemKey(selected) === getItemKey(c.value)),
      )
      const selected = weightedSelect(matrix, combo, role, remaining, getItemKey)
      combo[role].push(selected)
    }
  }

  return combo
}

export function rateCombo<Item>(
  matrix: CompatibilityMatrix,
  combo: Combo<Item>,
  getItemKey: (item: Item) => string,
  rating: CompatibilityScore,
): CompatibilityMatrix {
  const result = { ...matrix }
  const roles = Object.keys(combo)

  for (let i = 0; i < roles.length; i++) {
    for (let j = i + 1; j < roles.length; j++) {
      const role1 = roles[i]
      const role2 = roles[j]
      const rKey = rolePairKey(role1, role2)

      if (!result[rKey]) continue

      const updatedGroup = { ...result[rKey] }

      for (const item1 of combo[role1]) {
        for (const item2 of combo[role2]) {
          const iKey = itemPairKey(getItemKey(item1), getItemKey(item2))
          const entry = updatedGroup[iKey]

          if (!entry) continue

          const newRatings = entry.ratings + 1
          updatedGroup[iKey] = {
            score: (entry.score * entry.ratings + rating) / newRatings,
            ratings: newRatings,
          }
        }
      }

      result[rKey] = updatedGroup
    }
  }

  return result
}