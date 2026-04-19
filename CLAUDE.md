# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Commands

```bash
npm run dev       # Dev server on http://localhost:5173
npm run build     # tsc + vite build
npm run lint      # ESLint
npm run preview   # Preview production build
```

Backend must be running on port 8080. Vite proxies `/api` → `http://localhost:8080`.

## Architecture

Feature-based folder structure — each bounded context from the backend gets its own folder:

```
src/
├── app/
│   ├── router.tsx            # All routes
│   ├── providers.tsx         # QueryClientProvider
│   └── layout/AppLayout.tsx  # Nav (Iris logo + Lucide icons), logout
├── features/
│   ├── auth/
│   │   ├── api/              # useLogin, useRegister, useLogout, useMe
│   │   ├── store/            # Zustand auth store (current user)
│   │   └── pages/            # LoginPage, RegisterPage, ProfilePage
│   └── marketdata/
│       ├── api/              # useTopCoins (250 coins, 60s refresh)
│       ├── hooks/            # usePriceWebSocket (STOMP /topic/prices)
│       └── pages/            # MarketPage (AG Grid)
└── shared/
    ├── components/           # Button, Card, Input, IrisLogo
    └── lib/
        └── axios.ts          # Axios instance — withCredentials: true, baseURL /api/v1
```

## Key conventions

### HTTP / auth
- All requests use `withCredentials: true` — cookies sent automatically
- JWT lives in httpOnly cookies managed by the backend — never localStorage
- 401 → redirect to `/login` (Axios interceptor)

### State management
- **Server state**: TanStack Query only
- **Client/UI state**: Zustand only
- Never mix: no API responses in Zustand, no UI state in Query cache

### Component rules
- Pages compose features — import from `features/`, never from other pages
- `shared/` components have zero domain knowledge
- No inline styles — Tailwind classes only
- Use `shrink-0` not `flex-shrink-0` (Tailwind v3+ syntax)

### AG Grid (MarketPage)
- Theme: `themeQuartz.withParams({...})` JS API — no CSS class approach
- `columnMenu="legacy"` — required fix for React 19 event delegation conflict with filter popups
- `popupParent={document.body}` — filter popup positioning
- Live updates: `gridApi.applyTransaction({ update: rows })` — no full re-render on each tick
- `enableCellChangeFlash: true` on price column

### WebSocket (usePriceWebSocket)
- Connects to `/ws` via SockJS, subscribes to `/topic/prices`
- Returns `Record<string, number>` — Binance symbol → latest price (e.g. `{ BTCUSDT: 98430.12 }`)
- Match to CoinGecko coins: `symbol + 'USDT'` or exact match

## Layer roadmap

| Layer | Status | Description |
|---|---|---|
| 2 | Done | Auth UI — login, register, profile |
| 4 | Done | Market data UI — AG Grid, 250 coins, Binance live feed, coin logos |
| 5 | Next | Candlestick chart (TradingView Lightweight Charts) |
| 6 | | Portfolio UI |
| 7 | | Alert rules UI |
| 8 | | Order management UI |