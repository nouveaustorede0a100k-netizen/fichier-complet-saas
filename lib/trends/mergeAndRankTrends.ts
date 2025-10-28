import type { TrendSourceItem } from './helpers'

export function mergeAndRankTrends(...sources: TrendSourceItem[][]): TrendSourceItem[] {
  const map = new Map<string, TrendSourceItem & { score: number; occurrences: number }>()

  sources.flat().forEach((item) => {
    const key = item.name.toLowerCase()
    if (!map.has(key)) {
      map.set(key, { ...item, score: item.value, occurrences: 1 })
    } else {
      const existing = map.get(key)!
      existing.score += item.value
      existing.occurrences += 1
      existing.value = Math.round(existing.score / existing.occurrences)
    }
  })

  const merged = Array.from(map.values())

  merged.sort((a, b) => {
    if (b.score === a.score) {
      return b.occurrences - a.occurrences
    }
    return b.score - a.score
  })

  return merged.map(({ score, occurrences, ...rest }) => rest)
}
