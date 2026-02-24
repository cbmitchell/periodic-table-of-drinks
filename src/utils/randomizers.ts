import {
  GLASS_TYPES,
  type DrinkProps,
  type GlassIconName,
} from '../components/DrinkCell'

type IngredientType = 'spirit' | 'mixer' | 'flavor' | 'mouthfeel' | 'garnish'

export function weightedRandom(thresholds: number[]): number {
  const total = thresholds.reduce((sum, t) => sum + t, 0)
  let r = Math.random() * total
  for (let i = 0; i < thresholds.length; i++) {
    r -= thresholds[i]
    if (r <= 0) return i
  }
  return thresholds.length - 1 // fallback for floating point edge cases
}

type NamePart = 'adverb' | 'adjective' | 'noun' | 'secondary_noun'
const dummyTitleParts: Record<NamePart, string[]> = {
  adverb: [
    'Extremely',
    'Dangerously',
    'Accidentally',
    'Unapologetically',
    'Slightly',
    'Mostly',
    "Pete's",
    "Grandma's",
    'Undeniably',
    'Eternally',
    'Completely',
    'Regretably',
    'Technically',
    'Incredibly',
    'Unusually',
    'Happily',
    'Sadly',
    'Supposedly',
    'Allegedly',
    'Entirely',
    'Almost',
    'Kinda',
    'Really',
    'Painfully',
    'Powerfully',
    'Upsettingly',
    'Nice &',
    'Pretty',
    'Violently',
    'Understandably',
    'Graciously',
    'Just a Real',
    'Just a',
    'Pleasingly',
    'Very',
    'Not',
    'Flamboyantly',
    'Terminally',
    'Your',
    'My',
    "Everyone's",
    "The People's",
    "America's",
    "The Queen's",
    'Secretly',
    'Badly',
    'Unfortunately',
    'Memory of a',
    'Allegedly',
    'The',
  ],
  adjective: [
    'Little',
    'Tiny',
    'Muddy',
    'Lovely',
    'Normal',
    'Average',
    'Metaphorical',
    'Last',
    'Final',
    'Louisiana',
    'Tropical',
    'Sideways',
    'Springtime',
    'Hot',
    'Wet',
    'Moist',
    'Sleepy',
    'Funky',
    'Slippery',
    'Fast',
    'Dizzy',
    'Ordinary',
    'Complicated',
    'Sophisticated',
    'Philosophical',
    'Tipsy',
    'Upright',
    'Regretful',
    'Whimsical',
    'Fairy',
    'Drunk',
    'Kinky',
    'Funny',
    'Ripped',
    'Jacked',
    'Exploding',
    'Imploding',
    'Crazy',
    'Insane',
    'Lively',
    'Bad',
    'American',
    'Brazilian',
    'Spanish',
    'Canadian',
    'English',
    'Wumbly-Tumbly',
    'Jiggly',
    'Seething',
    'Painful',
    'Backwards',
    'Black',
    'Eldrich',
    'Galactic',
    'Celestial',
    'Atmospheric',
    'Powerful',
    'Meaty',
    'Aromatic',
    'Fruity',
    'Gay',
    'Exciting',
    'Old-Fashioned',
    'Firey',
    'Easy',
    'Breezy',
    'Dirty',
    'Spicy',
    'Heavenly',
    'Naughty',
    'Imaginary',
    'Cool',
    'Unhappy',
    'Signature',
    'Cold',
    'Chilly',
    'Special',
    'Kiddie',
    'Flamboyant',
    'Deadly',
    'Online',
    'White',
    'Blind',
    'Royal',
    'Secret',
    'Poor',
    'Slimy',
    'Golden',
    'Late-Night',
    'New',
    'Silly',
    'Tragic',
    'Xtreme',
    'Heretical',
    'Blasphemous',
    'Rocky',
    'Mysterious',
    'Threatening',
    'Dapper',
    'Handsome',
    'Forgotten',
    'Foreign',
    'Fat',
    'Juicy',
    'Sticky',
    'Sweet',
    'No',
  ],
  noun: [
    'Explosion',
    'Slap',
    'Whisper',
    'Terror',
    'Mistake',
    'Prospector',
    'Corpse',
    'Dipper',
    'Dumper',
    'Bucket',
    'Train',
    'Mountain',
    'Racecar',
    'President',
    'Complication',
    'Sophist',
    'Philosopher',
    'Gutpunch',
    'Blackout',
    'Fantasy',
    'Shot',
    'Cocktail',
    'Catastrophe',
    'Regret',
    'King',
    'Drink',
    'Soup',
    'Fizz',
    'Sour',
    'Slide',
    'Hole',
    'Cheek',
    'Fart',
    'Toilet',
    'Mouthful',
    'Punishment',
    'Spank',
    'Kaboose',
    'Tooth',
    'Treat',
    'Echo',
    'Motorboat',
    'Breeze',
    'Bluejay',
    'Fool',
    'Beartrap',
    'Finger',
    'Mouthwash',
    'Communion',
    'Booty',
    'Promise',
    'Dream',
    'Hallucination',
    'Signature',
    'Handshake',
    'Tea',
    'Kiss',
    'Lick',
    'Jackpot',
    'Flu',
    'Kitten',
    'Eruption',
    'Cloud',
    'Beating',
    'Refreshment',
    'Soap',
    'Bath',
    'Question',
    'Fiesta',
    'Secret',
    'Dong',
    'Whistle',
    'Flip',
    'Split',
    'Protest',
    'Nightmare',
    'Event',
    'Reminder',
    'Jet',
    'Dolphin',
    'Tornado',
    'Spine',
    'Discipline',
    'Apostle',
    'Dick',
    'Gold',
    'Rizz',
    'Parade',
    'Answer',
    'Solution',
    'Posession',
    'Interest',
    'Song',
    'Melody',
    'Wife',
    'Lover',
    'Grandma',
    'Senior Citizen',
    'Heretic',
    'Pipe',
    'Rock',
    'Heart',
    'Splash',
    'Mouth',
    'Aphrodesiac',
    'Surprise',
    'Birthday',
    'Opinion',
    'Mystery',
    'Breath',
    'Gravestone',
    'Wave',
    'Alien',
    'Princess',
    'Bum',
    'Juice',
    'Nectar',
  ],
  secondary_noun: [
    'Exploder',
    'Cure',
    'Reviver',
    'Party',
    'Killer',
    'Corpse',
    'Imploder',
    'Giver',
    'Dealer',
    'Destroyer',
    'Stealer',
    'Slapper',
    'Stopper',
    'Ender',
    'Licker',
    'Eater',
    'Spanker',
    'Seducer',
    'Maker',
    'Juicer',
    'Salesman',
    'Spit',
    'Lover',
    'Stomper',
    'for You',
    'Slurper',
    'Kisser',
    'Flicker',
    'Whisperer',
    'Bucket',
    'Hater',
    'Extravaganza',
    'Remix',
    'Holder',
    'House',
    'Drink',
    'On the Beach',
    'Tester',
    'Water',
  ],
}

const dummyIngredients: Record<IngredientType, string[]> = {
  spirit: [
    'vodka',
    'gin',
    'rum',
    'spiced rum',
    'tequila',
    'bourbon',
    'whiskey',
    'brandy',
    'cognac',
    'triple sec',
    'cachaça',
    'kahlua',
    'irish cream liqueur',
    'amaretto',
    'moonshine',
    'rubbing alcohol',
  ],
  mixer: [
    'club soda',
    'tonic water',
    'ginger beer',
    'cola',
    'lemon-lime soda',
    'cranberry juice',
    'orange juice',
    'lemon juice',
    'lime juice',
    'pineapple juice',
    'grapefruit juice',
    'tomato juice',
    'pickle brine',
    'boiling water',
    'chicken broth',
  ],
  flavor: [
    'bitters',
    'orange bitters',
    'chocolate bitters',
    'cinnamon syrup',
    'simple syrup',
    'ginger syrup',
    'st germain',
    'miracle berry',
    'soy sauce',
  ],
  mouthfeel: [
    'egg white',
    'whole milk',
    'falernum',
    'activated charcoal',
    'methylcellulose',
    'lecithin foam',
    'small block of polonium',
  ],
  garnish: [
    'lemon wheel',
    'lemon twist',
    'lemon wedge',
    'lime wheel',
    'lime twist',
    'lime wedge',
    'orange slice',
    'orange wheel',
    'orange twist',
    'cherry',
    'green olive',
    'fresh mint sprig',
    'cucumber slice',
    'celery stalk',
    'superfine sugar',
    'cocktail umbrella',
    'cinnamon stick',
    'jalapeño slice',
    'rainbow sprinkles',
    'whipped cream',
    'pop rocks',
    'iron shavings',
    'salt',
    'pepper',
    'ramen noodle flavor powder pack',
    '#2 pencil',
  ],
}

const randomAmount = () => {
  const amounts = [
    '¼',
    '⅓',
    '½',
    '⅔',
    '¾',
    '1',
    '1¼',
    '1½',
    '1¾',
    '2',
    '2½',
    '3',
    '4',
    '6',
    '12',
  ]
  const units = ['oz', 'tsp', 'gal']
  const randomAmount = amounts[Math.floor(Math.random() * amounts.length)]
  // const randomUnit = units[Math.floor(Math.random() * units.length)]
  let randomUnit = 'oz'
  const r = Math.random()
  if (r < 0.1) {
    randomUnit = 'gal'
  } else if (r < 0.35) {
    randomUnit = 'tsp'
  }
  return `${randomAmount} ${randomUnit}`
}

function pickRandom<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n)
}

export const randomIngredients = (): string[] => {
  const ingredientsList: string[] = []

  const possibleNumSpirits = [1, 2, 3, 4]
  const numSpirits = possibleNumSpirits[weightedRandom([75, 20, 4, 1])]
  const spirits = pickRandom<string>(dummyIngredients.spirit, numSpirits).map(
    (s) => `${randomAmount()} ${s}`,
  )

  const numMixers = weightedRandom([35, 40, 15, 10])
  const mixers = pickRandom<string>(dummyIngredients.mixer, numMixers).map(
    (m) => `${randomAmount()} ${m}`,
  )

  const numFlavors = weightedRandom([30, 50, 15, 5])
  const flavors = pickRandom<string>(dummyIngredients.flavor, numFlavors).map(
    (f) => `${randomAmount()} ${f}`,
  )

  const numMouthfeels = weightedRandom([60, 30, 8, 2])
  const mouthfeels = pickRandom<string>(
    dummyIngredients.mouthfeel,
    numMouthfeels,
  )

  const numGarnishes = weightedRandom([50, 40, 7, 3])
  const garnishes = pickRandom<string>(dummyIngredients.garnish, numGarnishes)

  ingredientsList.push(...spirits)
  ingredientsList.push(...mixers)
  ingredientsList.push(...flavors)
  ingredientsList.push(...mouthfeels)
  ingredientsList.push(...garnishes)

  return ingredientsList
}

// const dummyInstructions = {
//   combine: [
//     'Combine ingredients in ',
//   ],
//   mix: [
//     'Combine ingredients in blender',
//     'Dry shake ingredients in shaker',
//     'Shake ingredients in shaker',
//   ],
//   garnish: [
//     ''
//     'Sneeze on it',
//   ]
// }

const generateRandomInstructions = () => {}

const generateRandomTitle = (): string => {
  let title = ''
  let adjectivePresent = false

  if (Math.random() < 0.2) {
    const adverb =
      dummyTitleParts.adverb[
        Math.floor(Math.random() * dummyTitleParts.adverb.length)
      ]
    title = title.concat(`${adverb} `)
  }

  if (Math.random() < 0.8 || title.length > 0) {
    const adjective =
      dummyTitleParts.adjective[
        Math.floor(Math.random() * dummyTitleParts.adjective.length)
      ]
    title = title.concat(`${adjective} `)
    adjectivePresent = true
  }

  const noun =
    dummyTitleParts.noun[
      Math.floor(Math.random() * dummyTitleParts.noun.length)
    ]
  title = title.concat(noun)

  const secondaryNounThreshold = adjectivePresent ? 0.25 : 0.75
  if (Math.random() < secondaryNounThreshold) {
    const secondary_noun =
      dummyTitleParts.secondary_noun[
        Math.floor(Math.random() * dummyTitleParts.secondary_noun.length)
      ]
    title = title.concat(` ${secondary_noun}`)
  }

  console.log(title)
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
  }
}
