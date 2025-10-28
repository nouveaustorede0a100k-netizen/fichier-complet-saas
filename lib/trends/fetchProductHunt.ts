import { generateTrendItems, type TrendSourceItem } from './helpers'

export async function fetchProductHuntTrends(keyword: string): Promise<TrendSourceItem[]> {
  return generateTrendItems(`${keyword} product`, 'producthunt', 1)
}
