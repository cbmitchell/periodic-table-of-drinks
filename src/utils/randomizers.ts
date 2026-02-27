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

  const numSpirits = new WeightedList([
    { value: 1, likelihood: 75 },
    { value: 2, likelihood: 20 },
    { value: 3, likelihood: 4 },
    { value: 4, likelihood: 1 },
  ]).randomlySelectItem()
  const spirits = new WeightedList(randomIngredientParts.spirit)
    .randomlySelectNDistinctItems(numSpirits)
    .map((s) => `${randomAmount()} ${s}`)

  const numMixers = new WeightedList([
    { value: 0, likelihood: 35 },
    { value: 1, likelihood: 40 },
    { value: 2, likelihood: 15 },
    { value: 3, likelihood: 10 },
  ]).randomlySelectItem()
  const mixers = new WeightedList(randomIngredientParts.mixer)
    .randomlySelectNDistinctItems(numMixers)
    .map((m) => `${randomAmount()} ${m}`)

  const numFlavors = new WeightedList([
    { value: 0, likelihood: 30 },
    { value: 1, likelihood: 50 },
    { value: 2, likelihood: 15 },
    { value: 3, likelihood: 5 },
  ]).randomlySelectItem()
  const flavors = new WeightedList(randomIngredientParts.flavor)
    .randomlySelectNDistinctItems(numFlavors)
    .map((f) => `${randomAmount()} ${f}`)

  const numMouthfeels = new WeightedList([
    { value: 0, likelihood: 60 },
    { value: 1, likelihood: 30 },
    { value: 2, likelihood: 8 },
    { value: 3, likelihood: 2 },
  ]).randomlySelectItem()
  const mouthfeels = new WeightedList(
    randomIngredientParts.mouthfeel,
  ).randomlySelectNDistinctItems(numMouthfeels)

  const numGarnishes = new WeightedList([
    { value: 0, likelihood: 50 },
    { value: 1, likelihood: 40 },
    { value: 2, likelihood: 7 },
    { value: 3, likelihood: 3 },
  ]).randomlySelectItem()
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

  if (Math.random() < 0.3) {
    const prep = preparations.shift()
    if (prep !== undefined) instructions.push(prep)
  }
  if (Math.random() < 0.07) {
    const prep = preparations.shift()
    if (prep !== undefined) instructions.push(prep)
  }
  const combineItem = WeightedList.from<CombinePart>(
    randomInstructionParts.combine,
  ).randomlySelectItem()
  instructions.push(combineItem.text)
  if (Math.random() < 0.1) {
    const prep = preparations.shift()
    if (prep !== undefined) instructions.push(prep)
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
  if (Math.random() < 0.1) {
    const prep = preparations.shift()
    if (prep !== undefined) instructions.push(prep)
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

  let secondaryNounThreshold = 0.9
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
  const second = str.slice(1).match(/[A-Z]/)?.[0]?.toLowerCase() ?? ''
  return first + second
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
