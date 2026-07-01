# Ajo — Trustless Rotating Savings on Stellar

**Save together, the African way.** Ajo is a full-stack, open-source implementation of
the traditional **Ajo / Esusu** rotating savings and credit association (ROSCA),
rebuilt on the **Stellar Soroban** smart-contract platform.

A fixed group of people each contribute the same amount every round; each round the
entire pooled sum is paid out to one member. The rotation continues until every member
has received exactly one payout. The smart contract removes the need to trust a human
organiser — contributions and payouts are enforced on-chain.

---

## Monorepo structure

This repository contains three independent but connected packages:

| Folder | Stack | What it is | README |
|--------|-------|-----------|--------|
| [`contracts/`](./contracts) | Rust · Soroban SDK | The Ajo smart contract — group lifecycle, contributions, payouts | [contracts/README.md](./contracts/README.md) |
| [`frontend/`](./frontend) | Next.js 15 · Tailwind · Stellar SDK | The web app — landing page, dashboard, circle management | [frontend/README.md](./frontend/README.md) |
| [`mobile/`](./mobile) | Expo · React Native · NativeWind | The mobile app — same features, native experience | [mobile/README.md](./mobile/README.md) |

```
ajo-soroban/
├── contracts/          # Soroban smart contract (Rust)
│   └── ajo/src/        # lib, types, errors, storage, group, cycle, tests
├── frontend/           # Next.js web app
│   ├── app/            # routes (landing + /dashboard)
│   ├── components/     # UI, layout, landing, circles, dashboard
│   └── lib/            # contract + Stellar + Freighter integration
├── mobile/             # Expo React Native app
│   ├── app/            # expo-router screens (tabs + circle screens)
│   └── components/     # shared native UI
└── README.md           # you are here
```

---

## What is Ajo?

**Ajo** (Yoruba) and **Esusu** (Igbo) are West African rotating savings traditions.
Example with 4 people each saving $100/round:

```
Round 1 → Pool $400 → paid to Amara   (has $400 after only $100 in)
Round 2 → Pool $400 → paid to Kofi
Round 3 → Pool $400 → paid to Fatima
Round 4 → Pool $400 → paid to Emeka   (waited longest, ends even)
```

Everyone pays in the same total and receives the same total — but each member gets a
lump sum *before* they could have saved it alone. Ajo enforces this fairness on-chain.

---

## Design system

Both apps share a single visual language inspired by modern African fintech:

- **Primary — royal blue** `#1B3C8A` (headings, hero, sidebar)
- **Accent — warm orange** `#F97316` (primary actions, highlights)
- **Neutrals** — near-white backgrounds, subtle grey borders
- **Typeface** — [Satoshi](https://www.fontshare.com/fonts/satoshi)

---

## Quick start

```bash
# 1. Smart contract — run tests
cd contracts && cargo test

# 2. Web app — mock mode works with no deployed contract
cd frontend && npm install && npm run dev      # http://localhost:3000

# 3. Mobile app
cd mobile && npm install && npx expo start
```

Both apps default to **mock mode** (`NEXT_PUBLIC_USE_MOCK=true`) so you can explore the
full UI before deploying the contract to Testnet.

---

## Contributing

Work is tracked as [GitHub issues](https://github.com/pandoraa-box/ajo-soroban/issues) —
20 complex, cross-stack features spanning the contract, web, and mobile layers. Each
issue lists the contract work, frontend/mobile work, acceptance criteria, and the exact
files to touch, so it can be picked up independently.

## License

Open source. Testnet only — **not for production use with real funds.**
