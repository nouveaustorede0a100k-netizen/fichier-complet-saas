import { createSeed, seededRandom } from './helpers'

const STOP_WORDS = ['the', 'a', 'an', 'and', 'for', 'avec', 'les', 'des']

export async function normalizeKeyword(rawKeyword: string) {
  const keyword = rawKeyword
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token && !STOP_WORDS.includes(token))
    .join(' ')
    .trim()

  const seed = createSeed(keyword)
  const variants = new Set<string>([keyword])

  const suffixes = ['2025', 'growth', 'automation', 'premium', 'ai']

  suffixes.forEach((suffix, index) => {
    if (seededRandom(seed + index) > 0.3) {
      variants.add(`${keyword} ${suffix}`.trim())
    }
  })

  if (keyword.includes('ai') || seededRandom(seed) > 0.6) {
    variants.add(`${keyword} tools`)
  }

  return {
    keyword,
    variants: Array.from(variants)
  }
}
