import { type ICellRendererParams } from 'ag-grid-community'
import { Wifi, WifiOff } from 'lucide-react'
import { type CoinRow } from './columns'

function formatPrice(n: number): string {
  if (n >= 1) return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 4, maximumFractionDigits: 6 })
}

export function NameCell({ data }: ICellRendererParams<CoinRow>) {
  return (
    <div className="flex items-center gap-3 h-full py-1">
      {data!.imageUrl
        ? <img src={data!.imageUrl} alt={data!.symbol} className="w-8 h-8 rounded-full shrink-0" />
        : (
          <div className="w-8 h-8 rounded-full bg-raised flex items-center justify-center text-xs font-bold text-accent shrink-0">
            {data!.symbol.slice(0, 2).toUpperCase()}
          </div>
        )
      }
      <div className="min-w-0">
        <p className="text-sm font-medium text-white truncate leading-tight">{data!.name}</p>
        <p className="text-xs text-muted">{data!.symbol.toUpperCase()}</p>
      </div>
    </div>
  )
}

export function PriceCell({ data, value }: ICellRendererParams<CoinRow>) {
  return (
    <div className="flex items-center justify-end gap-2 h-full font-mono tabular-nums text-sm">
      <span className="text-white">{formatPrice(value)}</span>
      {data!.isLive
        ? <Wifi size={12} className="text-accent shrink-0" />
        : <WifiOff size={12} className="text-muted shrink-0" />
      }
    </div>
  )
}

export function ChangeCell({ value }: ICellRendererParams<CoinRow>) {
  if (value == null) return <span className="text-muted">—</span>
  const pos = value >= 0
  return (
    <div className={`flex items-center justify-end h-full font-mono tabular-nums text-sm ${pos ? 'text-accent' : 'text-danger'}`}>
      {pos ? '+' : ''}{value.toFixed(2)}%
    </div>
  )
}