import {
  GLASS_TYPES,
  type DrinkProps,
  type GlassIconName,
} from '../components/DrinkCell'
import {
  randomTitleParts,
  randomIngredientParts,
  randomAmountParts,
  randomInstructionParts,
} from './randomizerParts'

export type IngredientType =
  | 'spirit'
  | 'mixer'
  | 'flavor'
  | 'mouthfeel'
  | 'garnish'

export function weightedRandom(thresholds: number[]): number {
  const total = thresholds.reduce((sum, t) => sum + t, 0)
  let r = Math.random() * total
  for (let i = 0; i < thresholds.length; i++) {
    r -= thresholds[i]
    if (r <= 0) return i
  }
  return thresholds.length - 1 // fallback for floating point edge cases
}

const randomAmount = () => {
  const randomAmount =
    randomAmountParts.quantity[
      Math.floor(Math.random() * randomAmountParts.quantity.length)
    ]
  const units = ['oz', 'tsp', 'gal']
  const randomUnit = units[weightedRandom([75, 20, 5])]
  return `${randomAmount} ${randomUnit}`
}

function pickRandom<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n)
}

export const generateRandomIngredients = (): string[] => {
  const ingredientsList: string[] = []

  const possibleNumSpirits = [1, 2, 3, 4]
  const numSpirits = possibleNumSpirits[weightedRandom([75, 20, 4, 1])]
  const spirits = pickRandom<string>(
    randomIngredientParts.spirit,
    numSpirits,
  ).map((s) => `${randomAmount()} ${s}`)

  const numMixers = weightedRandom([35, 40, 15, 10])
  const mixers = pickRandom<string>(randomIngredientParts.mixer, numMixers).map(
    (m) => `${randomAmount()} ${m}`,
  )

  const numFlavors = weightedRandom([30, 50, 15, 5])
  const flavors = pickRandom<string>(
    randomIngredientParts.flavor,
    numFlavors,
  ).map((f) => `${randomAmount()} ${f}`)

  const numMouthfeels = weightedRandom([60, 30, 8, 2])
  const mouthfeels = pickRandom<string>(
    randomIngredientParts.mouthfeel,
    numMouthfeels,
  )

  const numGarnishes = weightedRandom([50, 40, 7, 3])
  const garnishes = pickRandom<string>(
    randomIngredientParts.garnish,
    numGarnishes,
  )

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
  const preparations: string[] = pickRandom<string>(
    randomInstructionParts.prepare,
    MAX_PREPARATIONS,
  )
  if (Math.random() < 0.3 && preparations.length > 0) {
    instructions.push(preparations.shift()!)
  }
  if (Math.random() < 0.1 && preparations.length > 0) {
    instructions.push(preparations.shift()!)
  }
  const combineItem =
    randomInstructionParts.combine[
      Math.floor(Math.random() * randomInstructionParts.combine.length)
    ]
  instructions.push(combineItem.text)
  if (Math.random() < 0.15 && preparations.length > 0) {
    instructions.push(preparations.shift()!)
  }
  if (Math.random() < 0.8) {
    const mixPool = combineItem.allowedMix ?? randomInstructionParts.mix
    let mix = mixPool[Math.floor(Math.random() * mixPool.length)]
    if (Math.random() < 0.5) {
      const mix_until =
        randomInstructionParts.mix_until[
          Math.floor(Math.random() * randomInstructionParts.mix_until.length)
        ]
      mix = mix.concat(` ${mix_until}`)
    }
    instructions.push(mix)
  }
  if (Math.random() < 0.1 && preparations.length > 0) {
    instructions.push(preparations.shift()!)
  }
  if (Math.random() < 0.3) {
    instructions.push(
      randomInstructionParts.garnish[
        Math.floor(Math.random() * randomInstructionParts.garnish.length)
      ],
    )
  }
  if (Math.random() < 0.75) {
    instructions.push(
      randomInstructionParts.serve[
        Math.floor(Math.random() * randomInstructionParts.serve.length)
      ],
    )
  }

  return instructions
}

const generateRandomTitle = (): string => {
  let title = ''
  let adjectivePresent = false

  if (Math.random() < 0.2) {
    const adverb =
      randomTitleParts.adverb[
        Math.floor(Math.random() * randomTitleParts.adverb.length)
      ]
    title = title.concat(`${adverb} `)
  }

  if (Math.random() < 0.8 || title.length > 0) {
    const adjective =
      randomTitleParts.adjective[
        Math.floor(Math.random() * randomTitleParts.adjective.length)
      ]
    title = title.concat(`${adjective} `)
    adjectivePresent = true
  }

  const noun =
    randomTitleParts.noun[
      Math.floor(Math.random() * randomTitleParts.noun.length)
    ]
  title = title.concat(noun)

  const secondaryNounThreshold = adjectivePresent ? 0.2 : 0.75
  if (Math.random() < secondaryNounThreshold) {
    const secondary_noun =
      randomTitleParts.secondary_noun[
        Math.floor(Math.random() * randomTitleParts.secondary_noun.length)
      ]
    title = title.concat(` ${secondary_noun}`)
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
  return GLASS_TYPES[Math.floor(Math.random() * GLASS_TYPES.length)]
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
