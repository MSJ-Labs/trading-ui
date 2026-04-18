import { useTopCoins } from '../api/marketApi'
import { usePriceWebSocket } from '../hooks/usePriceWebSocket'
import CoinRow from '../components/CoinRow'

export default function MarketPage() {
  const { data: coins, isLoading, isError } = useTopCoins(20)
  const livePrices = usePriceWebSocket()

  // Binance symbol is e.g. "BTCUSDT"; coin.symbol from CoinGecko is "BTC"
  // Match by stripping the USDT suffix from the Binance key
  function getLivePrice(symbol: string): number | undefined {
    const key = Object.keys(livePrices).find(
      k => k.toUpperCase() === symbol.toUpperCase() + 'USDT'
        || k.toUpperCase() === symbol.toUpperCase()
    )
    return key ? livePrices[key] : undefined
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Market</h2>
        <span className="text-xs text-muted">Live via Binance · refreshes every 60s</span>
      </div>

      <div className="rounded-2xl border border-line bg-surface overflow-hidden">
        {isLoading && (
          <div className="py-20 text-center text-sm text-muted">Loading prices…</div>
        )}
        {isError && (
          <div className="py-20 text-center text-sm text-danger">Failed to load market data.</div>
        )}
        {coins && (
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted uppercase tracking-wide">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">24h %</th>
                <th className="px-4 py-3 text-right">Market Cap</th>
                <th className="px-4 py-3 text-right">Volume 24h</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, i) => (
                <CoinRow
                  key={coin.coinId}
                  rank={i + 1}
                  coin={coin}
                  livePrice={getLivePrice(coin.symbol)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
