# Ajo Mobile App

The Ajo mobile app — built with **Expo 54** and **React Native**, styled with
**NativeWind 4** (Tailwind CSS for RN). It connects to the same
[Ajo Soroban contract](../contracts) as the web app and mirrors its features
with a fully native experience.

---

## Features

**Home tab** — dashboard-style overview
- Dark charcoal header with logo, wallet address pill, and profile avatar button
- Large balance display with show/hide toggle
- Stat chips: active circles count, payout-ready badge, total circles
- Payout alert card (overlaps header) when it's your turn to receive
- My Circles list with progress bars; "Browse open circles" CTA card

**Circles tab** — browse and join
- Search bar, Join + Create dual action buttons, status filter pills (All / Open / Active / Complete)
- Section headers: Active → Open to join → Completed
- CircleCard — name, full pot amount, contribution, member count, cycle frequency, progress bar / slot indicators

**Save tab** — wallet connect + my circles
- Connect wallet via Stellar public key text input
- Metric cards: active circles, next payout
- My Circles list with upcoming payout alert
- Create circle shortcut

**Wallet tab** — key management
- Monospace public key display on dark card with Copy button
- Testnet balance display
- Get Test Funds (links to Stellar Testnet Faucet)
- Disconnect button

**Profile tab** — savings identity
- Dark header with coral avatar (initial from address), shortened address, Testnet badge
- 4-stat grid: circles joined, payouts received, contributions made, reputation score
- Settings card: notification toggle, Wallet navigation, Sign out

**Circle detail** (`/circles/[id]`)
- Full circle info, join / contribute / claim payout actions
- Rotation order, member list, live progress

**Create circle** (`/circles/create`)
- Configure name, token, contribution amount, cycle frequency, group size

---

## Tech stack

| Concern | Choice |
|---------|--------|
| Framework | Expo SDK 54 + Expo Router 6 (file-based routing) |
| UI | React Native 0.81 + NativeWind 4 (Tailwind classes via `className`) |
| Blockchain | `@stellar/stellar-sdk` |
| Storage | `expo-secure-store` (wallet session) |
| Clipboard | `expo-clipboard` |
| Icons | `lucide-react-native` |
| Animations | `react-native-reanimated` 4 |

---

## Getting started

```bash
npm install
npx expo start        # press i (iOS Simulator), a (Android), or scan QR with Expo Go
```

The app runs in **mock mode** by default — sample circles from `lib/mockData.ts` populate
all screens without a deployed contract or a real Stellar wallet.

---

## Project structure

```
mobile/
├── app/
│   ├── _layout.tsx               # root stack + providers (safe area, gesture handler)
│   ├── index.tsx                 # onboarding carousel (3 slides, animated dots)
│   └── (tabs)/
│       ├── _layout.tsx           # 5-tab navigator (Home, Circles, Save, Wallet, Profile)
│       ├── home.tsx              # dashboard home — dark header, balance, my circles
│       ├── circles.tsx           # browse + search + filter
│       ├── dashboard.tsx         # wallet connect + my circles + metrics  (Save tab)
│       ├── wallet.tsx            # address card, copy, faucet link, disconnect
│       ├── profile.tsx           # avatar header, stats grid, settings card
│       └── circles/
│           ├── [id].tsx          # circle detail
│           └── create.tsx        # create circle form
├── components/
│   ├── ui/
│   │   ├── Button.tsx            # variants: lime, dark, secondary, ghost; sizes: sm/md/lg
│   │   └── Badge.tsx             # StatusBadge with icon: Active, Open, Complete, yourTurn
│   ├── circles/
│   │   └── CircleCard.tsx        # card with progress bar / slot indicators
│   └── dashboard/
│       └── MetricCard.tsx        # KPI card with accent variants
├── context/
│   └── WalletContext.tsx         # public key storage via expo-secure-store
├── lib/
│   ├── contract.ts               # fetchAllCircles + Soroban SDK integration
│   └── mockData.ts               # sample circles for mock mode
├── types/
│   └── ajo.ts                    # Circle, GroupConfig, GroupState + formatters
├── assets/                       # logo, onboarding slide images
├── tailwind.config.js            # NativeWind theme (ajo.* colour tokens)
├── global.css                    # @tailwind directives
├── babel.config.js               # nativewind/babel preset
└── metro.config.js               # withNativeWind transform
```

---

## Design system (NativeWind)

Tailwind classes work directly on React Native components via `className`. The custom
theme in `tailwind.config.js` uses the same tokens as the web app:

| Token | Hex | Usage |
|-------|-----|-------|
| `ajo-dark` | `#1E1D1B` | Charcoal — dark header, avatar, dark buttons |
| `ajo-lime` | `#D47253` | Coral — primary CTAs, active tab icon, badge fills |
| `ajo-lime-soft` | `#F7ECE6` | Light coral — active tab background, badge bg |
| `ajo-surface` | `#FAF8F3` | Warm cream — screen background |
| `ajo-muted` | `#73716D` | Secondary text, inactive tab icons |
| `ajo-green` | `#16A34A` | Active status dot, network indicator |
| `ajo-amber` | `#F59E0B` | Payout-ready chip, alert card |
| `ajo-border` | `#EBE8E1` | Card borders, tab bar top border |

**Tab bar:** white background, 1 px `ajo-border` top border, 84 px height.
Active icon: coral (`#D47253`), 20 px, `strokeWidth 2.5`, `rounded-2xl` soft background.
Inactive: muted (`#73716D`), `strokeWidth 2`.

---

## Scripts

```bash
npm start            # expo start
npm run android      # open on Android emulator / device
npm run ios          # open on iOS Simulator
npm run web          # run in browser (limited functionality)
npm run type-check   # tsc --noEmit
npm run lint         # eslint
```

---

## Roadmap

Mobile-specific features are tracked as
[GitHub issues](https://github.com/pandoraa-box/ajo-soroban/issues) — including
WalletConnect V2 + Freighter mobile deep-link signing, Profile V2 with reputation dial
and SVG contribution rings, push notifications with offline-first caching, real-time
Horizon streaming, and QR-based circle invite scanning.
