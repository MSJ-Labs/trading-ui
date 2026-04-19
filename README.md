# Iris — Frontend

React 19 frontend for the **Iris** crypto trading platform. Consumes the `trading-core` Spring Boot API.

## Stack

| Concern | Technology |
|---|---|
| Build | Vite 8 |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Server state | TanStack Query v5 |
| Client state | Zustand |
| Routing | React Router v7 |
| HTTP | Axios |
| WebSocket | @stomp/stompjs + SockJS |
| Data grids | AG Grid Community v35 |
| Icons | Lucide React |

## Commands

```bash
npm run dev       # Dev server on http://localhost:5173 (proxies /api → :8080)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint
```

Backend (`trading-core`) must be running on port 8080.

## Layer roadmap

| Layer | Status | Description |
|---|---|---|
| 2 | Done | Auth UI — login, register, profile, JWT cookie auth |
| 4 | Done | Market data UI — AG Grid, 250 coins, live Binance WebSocket, coin logos |
| 5 | Next | Candlestick chart (TradingView Lightweight Charts), OHLCV from MongoDB |
| 6 | | Portfolio & positions UI |
| 7 | | Alert configuration UI |
| 8 | | Order management UI |