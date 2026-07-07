# Ajo — Trustless Rotating Savings on Stellar

**Save together, the African way.** Ajo is a full-stack, open-source implementation of
the traditional **Ajo / Esusu** rotating savings and credit association (ROSCA),
rebuilt on the **Stellar Soroban** smart-contract platform.

A fixed group of people each contribute the same amount every round; each round the
entire pooled sum is paid out to one member in rotation. The smart contract removes the
need to trust a human organiser — contributions, payouts, and payout eligibility are all
enforced on-chain. A companion **tiered savings vault** (Flex / Growth / Power) lets
members lock idle funds for fixed-term yield.

---

join TG channel 
https://t.me/+mUl2WidjFcU0NTY0

## Monorepo structure

| Folder | Stack | What it is | README |
|--------|-------|------------|--------|
| [`contracts/`](./contracts) | Rust · Soroban SDK v22 | Smart contract — circles, two-step payouts, savings vault | [contracts/README.md](./contracts/README.md) |
| [`frontend/`](./frontend) | Next.js 15 · Tailwind · Stellar SDK | Web app — landing page, dashboard, circle management | [frontend/README.md](./frontend/README.md) |
| [`mobile/`](./mobile) | Expo 54 · React Native · NativeWind | Mobile app — 5-tab native experience | [mobile/README.md](./mobile/README.md) |

```
ajo-soroban/
├── contracts/ajo/src/
│   ├── lib.rs        # public entry points (#[contractimpl])
│   ├── types.rs      # GroupConfig, GroupState, VaultDeposit, VaultTier, DataKey
│   ├── errors.rs     # AjoError (16 variants)
│   ├── storage.rs    # persistent storage helpers + TTL rent management
│   ├── group.rs      # create_group, join_group, reverse-index maintenance
│   ├── cycle.rs      # contribute (auto-triggers payout), claim_payout, missed-cycle tracking
│   ├── vault.rs      # Flex/Growth/Power deposit, claim, preview_yield
│   └── tests.rs      # 32 unit tests
├── frontend/
│   ├── app/          # Next.js App Router (landing + /dashboard)
│   └── components/   # UI, layout, landing sections, circles, dashboard
└── mobile/
    ├── app/(tabs)/   # Home · Circles · Save · Wallet · Profile
    └── components/   # native UI (CircleCard, Badge, MetricCard)
```

---

## How it works

**Ajo** (Yoruba) and **Esusu** (Igbo) are centuries-old West African savings traditions.
Example with 4 people each saving 100 USDC per round:

```
Round 1 → Pool 400 USDC → paid to Amara   (receives lump sum after only 100 in)
Round 2 → Pool 400 USDC → paid to Kofi
Round 3 → Pool 400 USDC → paid to Fatima
Round 4 → Pool 400 USDC → paid to Emeka   (waited longest, ends even)
```

Everyone pays in the same total and receives the same total — but each member gets a
lump sum *before* they could have saved it alone. The smart contract enforces this
fairness on-chain with no human intermediary.

---

## Contract highlights

| Feature | Detail |
|---------|--------|
| **Circle naming** | Every group has a human-readable name stored in `GroupConfig` |
| **Two-step payout** | `contribute()` auto-sets `payout_pending` when all pay in; recipient calls `claim_payout()` to receive funds |
| **next_payout_ledger** | Tracks the expected payout ledger for each cycle; enforced by `claim_payout()` |
| **Missed-cycle tracking** | `missed_cycles` incremented on `ParticipantRecord` for every absent contributor |
| **Participant groups index** | `get_participant_groups(address)` returns all group IDs the address belongs to |
| **Tiered vault** | Flex (4.5 % APR, no lock) / Growth (9.2 %, ~90 days) / Power (14.8 %, ~365 days) |

---

## Design system

Both apps share a unified visual language inspired by modern African fintech:

| Token | Hex | Usage |
|-------|-----|-------|
| `ajo-dark` | `#1E1D1B` | Charcoal — headings, sidebar, dark header |
| `ajo-lime` | `#D47253` | Coral / terracotta — primary actions, avatar, accent |
| `ajo-surface` | `#FAF8F3` | Warm cream — page backgrounds |
| `ajo-muted` | `#73716D` | Secondary text, inactive icons |
| `ajo-green` | `#16A34A` | Active status, network indicator |
| `ajo-amber` | `#F59E0B` | Warnings, payout alerts |

Typeface: [Satoshi](https://www.fontshare.com/fonts/satoshi) (sans-serif primary) +
[Newsreader](https://fonts.google.com/specimen/Newsreader) (serif for headings).

---

## Quick start

```bash
# 1. Smart contract — run the 32 unit tests
cargo test

# 2. Web app — mock mode works without a deployed contract
cd frontend && npm install && npm run dev       # → http://localhost:3000

# 3. Mobile app
cd mobile && npm install && npx expo start      # press i / a / scan QR
```

Both apps default to **mock mode** (`NEXT_PUBLIC_USE_MOCK=true`) so the full UI is
explorable before deploying the contract to Testnet.

---

## Contributing

Work is tracked as [GitHub issues](https://github.com/pandoraa-box/ajo-soroban/issues)
— complex, cross-stack features spanning the contract, web, and mobile layers.
Each issue describes the contract changes, UI work, new tests, and acceptance criteria so
it can be picked up independently.

See [CONTRIBUTING.md](./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## License

Open source under [MIT](./LICENSE). Testnet only — **not audited, not for production use
with real funds.**
