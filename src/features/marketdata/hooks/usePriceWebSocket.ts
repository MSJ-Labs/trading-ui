import { useEffect, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

interface PriceUpdate {
  symbol: string
  price: number
  timestamp: string
}

// Returns a map of Binance symbol → latest price (e.g. { BTCUSDT: 98430.12 })
export function usePriceWebSocket(): Record<string, number> {
  const [prices, setPrices] = useState<Record<string, number>>({})

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5_000,
      onConnect: () => {
        client.subscribe('/topic/prices', (msg) => {
          const update: PriceUpdate = JSON.parse(msg.body)
          setPrices(prev => ({ ...prev, [update.symbol]: update.price }))
        })
      },
    })

    client.activate()
    return () => { client.deactivate() }
  }, [])

  return prices
}