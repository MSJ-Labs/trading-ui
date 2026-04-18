# trading-ui

Frontend for the personal crypto trading platform. Consumes the `trading-core` Spring Boot API.

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
| WebSocket (Layer 4+) | @stomp/stompjs |
| Data grids (Layer 4+) | AG Grid Community |

## Commands

```bash
npm run dev       # Dev server on http://localhost:3000 (proxies /api → :8080)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint
```

## Layer roadmap

| Layer | Status | Description |
|---|---|---|
| 2 | In progress | Auth UI — login, register, profile |
| 4 | | Market data UI — real-time price display |
| 5+ | | CQRS read models, Kafka events |
| 6 | | Portfolio & positions UI |
| 7 | | Alert configuration UI |
| 8 | | Order management UI |