import { useQuery } from '@tanstack/react-query'
import api from '../../../shared/lib/axios'

export interface CoinPrice {
  coinId: string
  symbol: string
  name: string
  // Price fields are null when the cached price expired (coin still ranked, price unknown)
  priceUsd: number | null
  priceChangePercent24h: number | null
  marketCapUsd: number | null
  volume24h: number | null
  lastUpdated: string | null
  imageUrl?: string
}

export function useTopCoins(limit = 250) {
  return useQuery({
    queryKey: ['market', 'coins', limit],
    queryFn: () =>
      api.get<CoinPrice[]>(`/market/coins?limit=${limit}`).then(r => r.data),
    staleTime: 60_000,
    refetchInterval: 60_000,
  })
}
