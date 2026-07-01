# Ajo Web App

The Ajo web frontend — a **Next.js 15** app (App Router) styled with **Tailwind CSS**,
connecting to the [Ajo Soroban contract](../contracts) via the Stellar SDK and the
Freighter wallet.

---

## Features

- **Landing page** — hero, how-it-works, and a live app preview.
- **Dashboard** (`/dashboard`) — sidebar layout with an overview, KPI cards, a savings
  chart, activity feed, and quick actions. All data is derived from real circle state.
- **Circles** — browse, filter (open / active / finished), and view circle details.
- **Create a circle** — configure amount, frequency, and group size.
- **Circle detail** — join, contribute, and trigger payouts; live contribution progress
  and rotation order.
- **Wallet** — connect via the Freighter browser extension.

---

## Tech stack

| Concern | Choice |
|---------|--------|
| Framework | Next.js 15 (App Router, Turbopack dev) |
| Styling | Tailwind CSS + Satoshi font |
| Blockchain | `@stellar/stellar-sdk`, `@stellar/freighter-api` |
| Icons | `lucide-react` |

---

## Getting started

```bash
npm install
cp .env.local.example .env.local   # optional — mock mode works without it
npm run dev                        # http://localhost:3000
```

The app defaults to **mock mode** (`NEXT_PUBLIC_USE_MOCK=true`), rendering the full UI
with sample circles so you can develop without a deployed contract.

### Environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CONTRACT_ID` | Deployed Ajo contract address (Testnet) |
| `NEXT_PUBLIC_NETWORK` | `TESTNET` or `MAINNET` |
| `NEXT_PUBLIC_USE_MOCK` | `true` to use in-memory sample data |
| `NEXT_PUBLIC_SOROBAN_RPC_URL` | Soroban RPC endpoint |
| `NEXT_PUBLIC_HORIZON_URL` | Horizon endpoint |

---

## Project structure

```
frontend/
├── app/
│   ├── page.tsx              # landing page
│   ├── dashboard/            # sidebar-wrapped app (layout.tsx)
│   │   ├── page.tsx          # overview
│   │   └── circles/          # list, create, [id] detail
│   └── layout.tsx            # root layout + providers
├── components/
│   ├── ui/                   # Button, Badge, Card
│   ├── layout/               # Navbar, Footer, Sidebar, ClientShell
│   ├── landing/              # Hero, Features, HowItWorks, TrustBand
│   ├── circles/              # CircleCard, CreateCircleForm, MemberList, …
│   └── dashboard/            # KPI cards, SavingsChart, ActivityFeed, CircleList
├── context/                  # WalletContext (Freighter)
├── hooks/                    # useCircle, useAllCircles
├── lib/                      # contract, stellar, freighter, mockData, utils
└── types/                    # shared Ajo types + formatters
```

---

## Scripts

```bash
npm run dev          # start dev server (Turbopack)
npm run build        # production build
npm run start        # serve production build
npm run lint         # eslint
npm run type-check   # tsc --noEmit
```

---

## Design system

- **Primary** royal blue `#1B3C8A` · **Accent** warm orange `#F97316`
- Mostly-white backgrounds, generous whitespace, `max-w-8xl` + `px-28` on large screens
- Satoshi typeface throughout
