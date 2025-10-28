import { generateTrendItems, type TrendSourceItem } from './helpers'

export async function fetchRedditTrends(keyword: string): Promise<TrendSourceItem[]> {
  return generateTrendItems(`${keyword} reddit`, 'reddit', 0.9)
}
