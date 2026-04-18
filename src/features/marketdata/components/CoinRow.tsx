import { useEffect, useRef, useState } from 'react'
import type { CoinPrice } from '../api/marketApi'

interface Props {
  rank: number
  coin: CoinPrice
  livePrice?: number
}

export default function CoinRow({ rank, coin, livePrice }: Props) {
  const price = livePrice ?? coin.priceUsd
  const prevPrice = useRef(price)
  const [flashClass, setFlashClass] = useState('')

  useEffect(() => {
    if (prevPrice.current === price) return
    const cls = price > prevPrice.current ? 'flash-up' : 'flash-down'
    setFlashClass(cls)
    prevPrice.current = price
    const t = setTimeout(() => setFlashClass(''), 600)
    return () => clearTimeout(t)
  }, [price])

  const change = coin.priceChangePercent24h
  const changeColor = change >= 0 ? 'text-accent' : 'text-danger'
  const changeSign = change >= 0 ? '+' : ''

  return (
    <tr className="border-t border-line hover:bg-raised transition-colors">
      <td className="px-4 py-3 text-sm text-muted w-10">{rank}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-raised flex items-center justify-center text-xs font-bold text-accent">
            {coin.symbol.slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{coin.name}</p>
            <p className="text-xs text-muted">{coin.symbol}</p>
          </div>
        </div>
      </td>
      <td className={`px-4 py-3 text-sm font-mono font-medium tabular-nums text-right ${flashClass}`}>
        {formatPrice(price)}
      </td>
      <td className={`px-4 py-3 text-sm font-mono text-right ${changeColor}`}>
        {changeSign}{change?.toFixed(2)}%
      </td>
      <td className="px-4 py-3 text-sm text-muted font-mono text-right">
        {formatLarge(coin.marketCapUsd)}
      </td>
      <td className="px-4 py-3 text-sm text-muted font-mono text-right">
        {formatLarge(coin.volume24h)}
      </td>
    </tr>
  )
}

function formatPrice(n: number): string {
  if (n >= 1) {
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 4, maximumFractionDigits: 6 })
}

function formatLarge(n: number): string {
  if (!n) return '—'
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(2)}M`
  return `$${n.toLocaleString('en-US')}`
}