import { useRef, useMemo, useEffect, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule, themeQuartz, type GridApi, type GetRowIdParams } from 'ag-grid-community'
import { TrendingUp, Wifi, FilterX } from 'lucide-react'
import { useTopCoins, type CoinPrice } from '../api/marketApi'
import { usePriceWebSocket } from '../hooks/usePriceWebSocket'
import { colDefs, defaultColDef, pageSizeSelector, type CoinRow } from '../config/columns'

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
            defaultColDef={defaultColDef}
            suppressCellFocus
            rowHeight={52}
            headerHeight={40}
            popupParent={document.body}
            columnMenu="legacy"
            pagination
            paginationPageSize={50}
            paginationPageSizeSelector={pageSizeSelector}
          />
        </div>
      )}
    </div>
  )
}
