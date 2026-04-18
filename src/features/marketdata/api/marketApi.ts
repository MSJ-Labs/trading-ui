import { useQuery } from '@tanstack/react-query'
import api from '../../../shared/lib/axios'

export interface CoinPrice {
  coinId: string
  symbol: string
  name: string
  priceUsd: number
  priceChangePercent24h: number
  marketCapUsd: number
  volume24h: number
  lastUpdated: string
}

export function useTopCoins(limit = 20) {
  return useQuery({
    queryKey: ['market', 'coins', limit],
    queryFn: () =>
      api.get<CoinPrice[]>(`/market/coins?limit=${limit}`).then(r => r.data),
    staleTime: 60_000,
    refetchInterval: 60_000,
  })
}