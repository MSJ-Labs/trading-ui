# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Commands

```bash
npm run dev       # Dev server on http://localhost:3000
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
│   ├── router.tsx        # All routes in one place
│   └── providers.tsx     # QueryClientProvider, future providers
├── features/
│   └── auth/
│       ├── api/          # TanStack Query hooks (useLogin, useRegister, etc.)
│       ├── components/   # LoginForm, RegisterForm — pure UI, no routing logic
│       ├── store/        # Zustand auth store (current user, isAuthenticated)
│       └── pages/        # LoginPage, RegisterPage, ProfilePage — compose components
└── shared/
    ├── components/       # Button, Input, FormField — reusable primitives
    └── lib/
        └── axios.ts      # Axios instance with baseURL and withCredentials
```

New bounded contexts (market data, portfolio, etc.) follow the same pattern under `features/`.

## Key conventions

### HTTP / auth
- All requests use `withCredentials: true` — cookies are sent automatically (no manual token handling)
- JWT lives in httpOnly cookies managed by the backend — never touch localStorage for auth
- 401 responses → redirect to `/login` (handled in Axios interceptor)

### State management
- **Server state**: TanStack Query only — no Zustand for API data
- **Client/UI state**: Zustand only — current user profile, UI flags
- Never mix the two: don't put API responses in Zustand, don't put UI state in Query cache

### Component rules
- Pages compose features — they import from `features/`, never from other pages
- Components in `shared/` have zero knowledge of domain (no auth imports in Button)
- No inline styles — Tailwind classes only

### TanStack Query
- Query keys are co-located with the hook, not scattered
- Mutations invalidate the relevant query on success
- `staleTime` set per query based on how often data changes

## Layer roadmap

| Layer | Status | Description |
|---|---|---|
| 2 | In progress | Auth UI — login, register, profile |
| 4 | | Market data UI — real-time prices via WebSocket |
| 6 | | Portfolio UI |
| 7 | | Alert rules UI |
| 8 | | Order management UI |