# عقار — Website Architecture

## Overview

Customer-facing real estate platform (RTL Arabic). No admin/owner panels — those redirect to `NEXT_PUBLIC_DASHBOARD_URL`.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js App Router (Server Components first) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + shadcn-style UI |
| Server state | TanStack Query |
| Client state | Zustand |
| HTTP | Axios (client) + fetch (RSC) |
| Forms | React Hook Form + Zod |
| i18n | next-intl (ar only) |
| Auth tokens | js-cookie + localStorage permissions |
| Notifications | Firebase (placeholder config) |

## Folder Structure

```
src/
├── app/                    # Routes & layouts (RSC pages)
├── components/
│   ├── ui/                 # Primitives (shadcn)
│   ├── layout/             # Header, Footer, AccountSidebar
│   ├── property/           # PropertyCard, Gallery, Filters
│   ├── search/             # SearchBar
│   ├── engagement/         # Offer, Review, Comment forms
│   └── common/             # EmptyState, Skeletons
├── features/               # Domain hooks (React Query)
│   ├── auth/
│   ├── properties/
│   ├── categories/
│   ├── favorites/
│   ├── cart/
│   ├── reviews/
│   ├── comments/
│   ├── offers/
│   ├── bookings/
│   └── notifications/
├── lib/
│   ├── api/                # server fetch, pagination, config
│   ├── auth/               # tokens, redirect, persist
│   ├── firebase/
│   ├── types.ts
│   └── utils.ts
├── hooks/                  # useAxiosInstance
├── store/                  # Zustand (auth, ui)
├── schemas/                # Zod validation
├── constants/
├── providers/
├── i18n/
└── middleware.ts           # Protect /account/*
```

## Data Flow

### Public catalog (SEO)

1. `app/properties/page.tsx` — Server Component
2. `lib/api/server.ts` — `fetch()` with `revalidate: 60`
3. Pass `initialData` to client catalog for view mode / pagination links

### Authenticated actions

1. Client components call `features/*` hooks
2. Hooks use `useAxiosInstance()` with Bearer + 401 refresh
3. Mutations invalidate React Query cache

## Auth

- Register always sends `role: "CUSTOMER"`
- Tokens in cookies (`access_token`, `refresh_token`)
- Permissions in `localStorage`
- `middleware.ts` guards `/account/*`
- OWNER/ADMIN → dashboard URL on login

## API Conventions

- Categories: `GET /categories/select-menu`, `GET /subcategories/select-menu?parentId=`
- Properties: `GET /properties` with filters
- Never use legacy `/categories` list for filters

## AI Readiness

- `app/search` — AI search placeholder
- Feature modules isolated for future agent integration
- Typed API layer ready for tool-calling wrappers

## Routes

| Route | Auth | Type |
|-------|------|------|
| `/` | Public | RSC |
| `/properties` | Public | RSC + client filters |
| `/properties/[id]` | Public | RSC + `generateMetadata` |
| `/auth/*` | Public | Client |
| `/account/*` | CUSTOMER | Client (middleware) |
| Static pages | Public | RSC |

## Environment

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_DASHBOARD_URL=
NEXT_PUBLIC_APP_URL=
```
