import {
  GLASS_TYPES,
  type DrinkProps,
  type GlassIconName,
} from '../components/DrinkCell'
import {
  randomTitleParts,
  randomIngredientParts,
  randomAmountParts,
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

export const randomIngredients = (): string[] => {
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

const randomInstructionParts = {
  prepare: [
    'Prepare yourself',
    'Call a loved one',
    'Stretch',
    'Mentally prepare',
    'Put on latex gloves',
    'Blindfold yourself',
    'Spin until dizzy',
    'Lay down tarp',
    'Open a window',
    'Pull yourself together',
    'Go to your happy place',
    'Ruminate',
    'Ponder',
    'Prepare the sacrifice',
    'Pray',
    'Ensure you are alone',
    'Turn off all the lights',
    'Light a scented candle',
    'Apply eye protection',
    'Write your will',
    'Meditate',
    'Slap it',
    'Imagine a vast ocean',
    'Go take a nap',
    'Have someone assist you',
    'Release your inhibitions',
    'Put on some classical music',
    'Wear safety goggles',
    'Wait 20 minutes',
    'Microwave 2 minutes',
    'Consider next move',
    'Check taste',
    'Take a deep breath',
    'Whisper a secret aloud',
    'Do a gratitude exercise',
    'Lock your doors',
    'Close the blinds',
    'Put on your drinking hat',
    'Recite the incantation',
    'Draw the runes',
    'Perform blood sacrifice',
    'Scroll social media',
    'Play smooth jazz',
    'Take a break',
  ],
  combine: [
    'Build in glass',
    'Build in glass',
    'Combine in blender',
    'Combine in shaker',
    'Build in large cauldron',
  ],
  mix: [
    'Blend',
    'Dry shake',
    'Shake',
    'Stir',
    'Stir with barspoon',
    'Boil',
    'Stir with large wooden spoon',
    'Microwave',
    'Chill',
    'Beat the devil out of it',
  ],
  mix_until: [
    'until dizzy',
    'until wet',
    'until you smell smoke',
    'until clear',
    'until cloudy',
    'until just right',
    'until gasseous',
    'until smooth',
    'until thick',
    'until frothy',
    'until satisfied',
    'until delicious',
    "until you can't anymore",
    'untkl viscous',
    'until done',
    'a few times',
    'for 30 seconds',
    'for 2 minutes',
    'vigorously',
    'violently',
    'well',
    'for a while',
  ],
  garnish: [
    'Issue positive affirmations',
    'Sneeze on it',
    'Top with garnish',
    'Coat rim of glass',
    'Flip upside-down briefly',
    'Light on fire',
    'Decorate',
    'Sign your name on it',
  ],
  serve: [
    'Enjoy',
    'Enjoy',
    'Enjoy',
    'Serve to enemy',
    'Throw in the trash',
    'Appreciate',
    'Do not drink',
    'Do not serve',
    'Dump in the toilet',
    'Serve to close friends',
    'Serve & enjoy',
    'Serve under cloche',
    'Take a photo & post it',
    'Let sit overnight',
    'Drink with caution',
    'Drink at your own risk',
    'Sip slowly',
    'Share with friends',
  ],
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
  instructions.push(
    randomInstructionParts.combine[
      Math.floor(Math.random() * randomInstructionParts.combine.length)
    ],
  )
  if (Math.random() < 0.15 && preparations.length > 0) {
    instructions.push(preparations.shift()!)
  }
  if (Math.random() < 0.8) {
    let mix =
      randomInstructionParts.mix[
        Math.floor(Math.random() * randomInstructionParts.mix.length)
      ]
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

function firstLetters(str: string): string {
  return str
    .split(' ')
    .map((word) => word[0])
    .join('')
}

function twoChars(str: string): string {
  if (str.length === 0) return ''
  const first = str[0].toUpperCase()
  const second = str
    .split('')
    .slice(1)
    .find((c) => /[a-zA-Z0-9]/.test(c))
  return first + (second ? second.toLowerCase() : '')
}

function generateAbbreviation(title: string) {
  return twoChars(firstLetters(title))
}

function randomIcon(): GlassIconName {
  return GLASS_TYPES[Math.floor(Math.random() * GLASS_TYPES.length)]
}

export function generateRandomDrink(): DrinkProps {
  const title = generateRandomTitle()
  return {
    title: title,
    abbreviation: generateAbbreviation(title),
    icon: randomIcon(),
    ingredients: randomIngredients(),
    instructions: generateRandomInstructions(),
  }
}
