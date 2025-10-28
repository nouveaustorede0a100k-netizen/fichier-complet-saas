import { generateTrendItems, type TrendSourceItem } from './helpers'

export async function fetchYouTubeTrends(keyword: string): Promise<TrendSourceItem[]> {
  return generateTrendItems(`${keyword} video`, 'youtube', 1.2)
}
