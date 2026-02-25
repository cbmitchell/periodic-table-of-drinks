import {
  type DrinkProps,
  GLASS_TYPES,
  type GlassIconName,
} from '../types/drink'
import { WeightedList } from '../types/WeightedList'
import {
  type CombinePart,
  randomAmountParts,
  randomIngredientParts,
  randomInstructionParts,
  randomTitleParts,
} from './randomizerParts'

function weightedRandom(thresholds: number[]): number {
  const total = thresholds.reduce((sum, t) => sum + t, 0)
  let r = Math.random() * total
  for (let i = 0; i < thresholds.length; i++) {
    r -= thresholds[i]
    if (r <= 0) return i
  }
  return thresholds.length - 1 // fallback for floating point edge cases
}

const randomAmount = () => {
  const quantity = new WeightedList(
    randomAmountParts.quantity,
  ).randomlySelectItem()
  const randomUnit = new WeightedList(
    randomAmountParts.unit,
  ).randomlySelectItem()
  return `${quantity} ${randomUnit}`
}

export const generateRandomIngredients = (): string[] => {
  const ingredientsList: string[] = []

  const possibleNumSpirits = [1, 2, 3, 4]
  const numSpirits = possibleNumSpirits[weightedRandom([75, 20, 4, 1])]
  const spirits = new WeightedList(randomIngredientParts.spirit)
    .randomlySelectNDistinctItems(numSpirits)
    .map((s) => `${randomAmount()} ${s}`)

  const numMixers = weightedRandom([35, 40, 15, 10])
  const mixers = new WeightedList(randomIngredientParts.mixer)
    .randomlySelectNDistinctItems(numMixers)
    .map((m) => `${randomAmount()} ${m}`)

  const numFlavors = weightedRandom([30, 50, 15, 5])
  const flavors = new WeightedList(randomIngredientParts.flavor)
    .randomlySelectNDistinctItems(numFlavors)
    .map((f) => `${randomAmount()} ${f}`)

  const numMouthfeels = weightedRandom([60, 30, 8, 2])
  const mouthfeels = new WeightedList(
    randomIngredientParts.mouthfeel,
  ).randomlySelectNDistinctItems(numMouthfeels)

  const numGarnishes = weightedRandom([50, 40, 7, 3])
  const garnishes = new WeightedList(
    randomIngredientParts.garnish,
  ).randomlySelectNDistinctItems(numGarnishes)

  ingredientsList.push(...spirits)
  ingredientsList.push(...mixers)
  ingredientsList.push(...flavors)
  ingredientsList.push(...mouthfeels)
  ingredientsList.push(...garnishes)

  return ingredientsList
}

const generateRandomInstructions = (): string[] => {
  const instructions: string[] = []
  const MAX_PREPARATIONS = 4
  const preparations = new WeightedList(
    randomInstructionParts.prepare,
  ).randomlySelectNDistinctItems(MAX_PREPARATIONS)

  if (Math.random() < 0.3 && preparations.length > 0) {
    instructions.push(preparations.shift()!)
  }
  if (Math.random() < 0.07 && preparations.length > 0) {
    instructions.push(preparations.shift()!)
  }
  const combineItem = WeightedList.from<CombinePart>(
    randomInstructionParts.combine,
  ).randomlySelectItem()
  instructions.push(combineItem.text)
  if (Math.random() < 0.1 && preparations.length > 0) {
    instructions.push(preparations.shift()!)
  }
  if (Math.random() < 0.8) {
    const mixPool = combineItem.allowedMix ?? randomInstructionParts.mix
    let mix = WeightedList.from(mixPool).randomlySelectItem()
    if (Math.random() < 0.7) {
      const mix_until = new WeightedList(
        randomInstructionParts.mix_until,
      ).randomlySelectItem()
      mix = mix.concat(` ${mix_until}`)
    }
    instructions.push(mix)
  }
  if (Math.random() < 0.1 && preparations.length > 0) {
    instructions.push(preparations.shift()!)
  }
  if (Math.random() < 0.3) {
    instructions.push(
      new WeightedList(randomInstructionParts.garnish).randomlySelectItem(),
    )
  }
  if (Math.random() < 0.75) {
    instructions.push(
      new WeightedList(randomInstructionParts.serve).randomlySelectItem(),
    )
  }

  return instructions
}

const generateRandomTitle = (): string => {
  let title = ''
  let adverbPresent = false
  let adjectivePresent = false

  if (Math.random() < 0.2) {
    title = title.concat(
      `${new WeightedList(randomTitleParts.adverb).randomlySelectItem()} `,
    )
    adverbPresent = true
  }

  if (Math.random() < 0.7 || title.length > 0) {
    title = title.concat(
      `${new WeightedList(randomTitleParts.adjective).randomlySelectItem()} `,
    )
    adjectivePresent = true
  }

  title = title.concat(
    new WeightedList(randomTitleParts.noun).randomlySelectItem(),
  )

  let secondaryNounThreshold = 0.85
  if (adverbPresent) {
    secondaryNounThreshold = 0.1
  } else if (adjectivePresent) {
    secondaryNounThreshold = 0.25
  }
  if (Math.random() < secondaryNounThreshold) {
    title = title.concat(
      ` ${new WeightedList(randomTitleParts.secondary_noun).randomlySelectItem()}`,
    )
  }

  return title
}

// Helper function for generateAbbreviation
function firstLetters(str: string): string {
  return str
    .split(' ')
    .map((word) => word[0])
    .join('')
}

// Helper function for generateAbbreviation
function twoChars(str: string): string {
  if (str.length === 0) return ''
  const first = str[0].toUpperCase()
  const second = str
    .split('')
    .slice(1)
    .find((c) => /[A-Z]/.test(c))
  return first + (second ? second.toLowerCase() : '')
}

function generateAbbreviation(title: string) {
  return twoChars(firstLetters(title))
}

function generateRandomIcon(): GlassIconName {
  return WeightedList.from(GLASS_TYPES).randomlySelectItem()
}

export function generateRandomDrink(): DrinkProps {
  const title = generateRandomTitle()
  return {
    title: title,
    abbreviation: generateAbbreviation(title),
    icon: generateRandomIcon(),
    ingredients: generateRandomIngredients(),
    instructions: generateRandomInstructions(),
  }
}
