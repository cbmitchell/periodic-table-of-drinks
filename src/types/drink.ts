import type { ElementGroup } from './ElementGroup'

export const GLASS_TYPES = [
  'collins',
  'coup',
  'flute',
  'hurricane',
  'irish',
  'margarita',
  'martini',
  'mule',
  'pint',
  'rocks',
  'shot',
  'shooter',
  'tiki',
  'wine',
] as const

export type GlassIconName = (typeof GLASS_TYPES)[number]

export interface DrinkProps {
  title: string
  abbreviation: string
  icon: GlassIconName
  ingredients: string[]
  instructions: string[]
  group?: ElementGroup
}
