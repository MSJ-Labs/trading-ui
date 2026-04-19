import { useRef, useMemo, useEffect, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
  type ColDef,
  type GridApi,
  type GetRowIdParams,
  type ICellRendererParams,
} from 'ag-grid-community'
import { TrendingUp, Wifi, WifiOff, FilterX } from 'lucide-react'
import { useTopCoins, type CoinPrice } from '../api/marketApi'
import { usePriceWebSocket } from '../hooks/usePriceWebSocket'

ModuleRegistry.registerModules([AllCommunityModule])

const irisTheme = themeQuartz.withParams({
  accentColor: '#00d4b8',
  backgroundColor: '#1a1a1a',
  browserColorScheme: 'dark',
  chromeBackgroundColor: '#222222',
  foregroundColor: '#ffffff',
  headerTextColor: '#9ca3af',
  headerBackgroundColor: '#222222',
  borderColor: '#2a2a2a',
  rowHoverColor: '#222222',
  oddRowBackgroundColor: '#1a1a1a',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 14,
  cellHorizontalPaddingScale: 1.1,
  valueChangeValueHighlightBackgroundColor: 'rgba(0, 212, 184, 0.18)',
  valueChangeDeltaUpColor: '#00d4b8',
  valueChangeDeltaDownColor: '#ef4444',
  wrapperBorder: false,
})

interface CoinRow extends CoinPrice {
  rank: number
  displayPrice: number
  isLive: boolean
}

function resolveLivePrice(symbol: string, livePrices: Record<string, number>): number | undefined {
  const key = Object.keys(livePrices).find(
    k => k.toUpperCase() === symbol.toUpperCase() + 'USDT'
      || k.toUpperCase() === symbol.toUpperCase()
  )
  return key ? livePrices[key] : undefined
}

function toRow(coin: CoinPrice, rank: number, livePrice?: number): CoinRow {
  return { ...coin, rank, displayPrice: livePrice ?? coin.priceUsd, isLive: livePrice !== undefined }
}

// ── Cell renderers ──────────────────────────────────────────────────────────

function NameCell({ data }: ICellRendererParams<CoinRow>) {
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

function PriceCell({ data, value }: ICellRendererParams<CoinRow>) {
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

function ChangeCell({ value }: ICellRendererParams<CoinRow>) {
  if (value == null) return <span className="text-muted">—</span>
  const pos = value >= 0
  return (
    <div className={`flex items-center justify-end h-full font-mono tabular-nums text-sm ${pos ? 'text-accent' : 'text-danger'}`}>
      {pos ? '+' : ''}{value.toFixed(2)}%
    </div>
  )
}

// ── Formatters ───────────────────────────────────────────────────────────────

function formatPrice(n: number): string {
  if (n >= 1) return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 4, maximumFractionDigits: 6 })
}

function formatLarge(n: number): string {
  if (!n) return '—'
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(2)}M`
  return `$${n.toLocaleString('en-US')}`
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MarketPage() {
  const { data: coins, isLoading, isError } = useTopCoins(250)
  const livePrices = usePriceWebSocket()
  const gridApiRef = useRef<GridApi<CoinRow> | null>(null)

  const rowData = useMemo<CoinRow[]>(() => {
    if (!coins) return []
    return coins.map((coin, i) => toRow(coin, i + 1, resolveLivePrice(coin.symbol, livePrices)))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coins])

  useEffect(() => {
    if (!gridApiRef.current || !coins) return
    const updates: CoinRow[] = []
    coins.forEach((coin, i) => {
      const livePrice = resolveLivePrice(coin.symbol, livePrices)
      if (livePrice !== undefined) updates.push(toRow(coin, i + 1, livePrice))
    })
    if (updates.length > 0) gridApiRef.current.applyTransaction({ update: updates })
  }, [livePrices, coins])

  const getRowId = useCallback((p: GetRowIdParams<CoinRow>) => p.data.coinId, [])

  const colDefs = useMemo<ColDef<CoinRow>[]>(() => [
    {
      field: 'rank',
      headerName: '#',
      width: 58,
      sortable: false,
      suppressMovable: true,
      filter: false,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 2,
      minWidth: 180,
      cellRenderer: NameCell,
      filter: 'agTextColumnFilter',
      filterParams: { filterOptions: ['contains', 'startsWith'], maxNumConditions: 1 },
    },
    {
      field: 'displayPrice',
      headerName: 'Price',
      flex: 1.5,
      minWidth: 140,
      cellRenderer: PriceCell,
      enableCellChangeFlash: true,
      type: 'rightAligned',
      filter: 'agNumberColumnFilter',
      filterParams: { filterOptions: ['greaterThan', 'lessThan', 'inRange'], maxNumConditions: 1 },
    },
    {
      field: 'priceChangePercent24h',
      headerName: '24h %',
      flex: 1,
      minWidth: 90,
      cellRenderer: ChangeCell,
      type: 'rightAligned',
      filter: 'agNumberColumnFilter',
      filterParams: { filterOptions: ['greaterThan', 'lessThan', 'inRange'], maxNumConditions: 1 },
    },
    {
      field: 'marketCapUsd',
      headerName: 'Market Cap',
      flex: 1.5,
      minWidth: 120,
      valueFormatter: p => formatLarge(p.value),
      type: 'rightAligned',
      cellStyle: () => ({ color: '#9ca3af', fontSize: '13px', fontFamily: 'monospace' }),
      filter: 'agNumberColumnFilter',
      filterParams: { filterOptions: ['greaterThan', 'lessThan', 'inRange'], maxNumConditions: 1 },
    },
    {
      field: 'volume24h',
      headerName: 'Volume 24h',
      flex: 1.5,
      minWidth: 120,
      valueFormatter: p => formatLarge(p.value),
      type: 'rightAligned',
      cellStyle: () => ({ color: '#9ca3af', fontSize: '13px', fontFamily: 'monospace' }),
      filter: 'agNumberColumnFilter',
      filterParams: { filterOptions: ['greaterThan', 'lessThan', 'inRange'], maxNumConditions: 1 },
    },
  ], [])

  const liveCount = Object.keys(livePrices).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <TrendingUp size={18} className="text-accent" />
          Market
        </h2>
        <div className="flex items-center gap-3 text-xs text-muted">
          {liveCount > 0 && (
            <span className="flex items-center gap-1.5 text-accent">
              <Wifi size={12} />
              {liveCount} live
            </span>
          )}
          <button
            onClick={() => gridApiRef.current?.setFilterModel(null)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-line hover:border-accent hover:text-accent transition-colors"
          >
            <FilterX size={12} />
            Clear filters
          </button>
          <span>Binance WebSocket · CoinGecko refreshes every 60s</span>
        </div>
      </div>

      {isLoading && <div className="py-20 text-center text-sm text-muted">Loading prices…</div>}
      {isError && <div className="py-20 text-center text-sm text-danger">Failed to load market data.</div>}

      {!isLoading && !isError && (
        <div
          className="rounded-2xl overflow-hidden border border-line"
          style={{ height: 'calc(100vh - 200px)' }}
        >
          <AgGridReact<CoinRow>
            theme={irisTheme}
            rowData={rowData}
            columnDefs={colDefs}
            getRowId={getRowId}
            onGridReady={p => { gridApiRef.current = p.api }}
            defaultColDef={{ resizable: true, sortable: true }}
            suppressCellFocus
            rowHeight={52}
            headerHeight={40}
            popupParent={document.body}
            columnMenu="legacy"
            pagination
            paginationPageSize={50}
            paginationPageSizeSelector={[25, 50, 100, 250]}
          />
        </div>
      )}
    </div>
  )
}
