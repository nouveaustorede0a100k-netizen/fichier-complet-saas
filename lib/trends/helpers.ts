export type TrendSourceType = 'google' | 'reddit' | 'producthunt' | 'youtube'

export interface TrendSourceItem {
  name: string
  value: number
  type: TrendSourceType
  description?: string
  url?: string
  publishedAt?: string
  channelTitle?: string
  comments?: number
}

export function createSeed(input: string) {
  let hash = 0
  const text = input.toLowerCase()
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function generateTrendItems(
  keyword: string,
  type: TrendSourceType,
  baseMultiplier: number,
  count = 6
): TrendSourceItem[] {
  const seed = createSeed(`${keyword}-${type}`)
  return Array.from({ length: count }).map((_, index) => {
    const weight = seededRandom(seed + index)
    const value = Math.round((weight * 60 + 40) * baseMultiplier)
    return {
      name: `${keyword.replace(/\b\w/g, (char) => char.toUpperCase())} ${type} ${index + 1}`,
      value,
      type,
      description: buildDescription(keyword, type, index, value),
      url: `https://example.com/${type}/${keyword.replace(/\s+/g, '-')}/${index + 1}`,
      publishedAt: new Date(Date.now() - index * 86400000).toISOString(),
      channelTitle: type === 'youtube' ? `${keyword} Channel` : undefined,
      comments: type === 'youtube' ? Math.floor(weight * 500) : undefined
    }
  })
}

function buildDescription(keyword: string, type: TrendSourceType, index: number, value: number) {
  const formattedKeyword = keyword.replace(/\b\w/g, (char) => char.toUpperCase())
  switch (type) {
    case 'google':
      return `Volume de recherche pour ${formattedKeyword} avec un indice ${value}.`
    case 'reddit':
      return `Discussion Reddit #${index + 1} autour de ${formattedKeyword}.`
    case 'producthunt':
      return `Produit émergent lié à ${formattedKeyword} (${value} votes estimés).`
    case 'youtube':
    default:
      return `Vidéo tendance sur ${formattedKeyword} (${value} interactions estimées).`
  }
}
