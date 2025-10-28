import { generateTrendItems, type TrendSourceItem } from './helpers'

export async function fetchGoogleTrends(keyword: string, country: string): Promise<TrendSourceItem[]> {
  const normalizedCountry = country || 'US'
  return generateTrendItems(`${keyword} ${normalizedCountry}`, 'google', 1.1)
}
