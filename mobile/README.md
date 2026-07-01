# Ajo Mobile App

The Ajo mobile app — built with **Expo** and **React Native**, styled with
**NativeWind** (Tailwind for RN). It mirrors the [web app](../frontend) with a native
experience and connects to the same [Ajo Soroban contract](../contracts).

---

## Features

- **Home** — hero, balance preview, and feature highlights.
- **Circles** tab — browse and filter all circles (open / saving now / finished).
- **Dashboard** tab — connect a wallet, see your circles, metrics, and upcoming payouts.
- **Profile** tab — your address, network, and savings stats.
- **Circle detail** — join, contribute, trigger payout, and view rotation order.
- **Create circle** — configure amount, frequency, and group size.

---

## Tech stack

| Concern | Choice |
|---------|--------|
| Framework | Expo SDK 51 + Expo Router (file-based routing) |
| UI | React Native + NativeWind 4 (Tailwind classes) |
| Blockchain | `@stellar/stellar-sdk` |
| Storage | `expo-secure-store` (wallet session) |
| Icons | `lucide-react-native`, emoji |

---

## Getting started

```bash
npm install
npx expo start        # then press i (iOS), a (Android), or scan the QR with Expo Go
```

The app runs in **mock mode** by default (sample circles in `lib/mockData.ts`), so the
full UI works without a deployed contract or a real wallet.

---

## Project structure

```
mobile/
├── app/
│   ├── _layout.tsx           # root stack + providers
│   ├── (tabs)/               # tab navigator
│   │   ├── _layout.tsx       # tab bar
│   │   ├── index.tsx         # Home
│   │   ├── circles.tsx       # Circles list
│   │   ├── dashboard.tsx     # Dashboard
│   │   └── profile.tsx       # Profile
│   └── circles/
│       ├── [id].tsx          # circle detail
│       └── create.tsx        # create circle
├── components/
│   ├── ui/                   # Button, Badge
│   ├── circles/              # CircleCard
│   └── dashboard/            # MetricCard
├── context/                  # WalletContext (SecureStore)
├── lib/                      # contract, mockData
├── types/                    # shared Ajo types
├── tailwind.config.js        # NativeWind theme (blue + orange)
├── babel.config.js           # nativewind preset
└── metro.config.js           # withNativeWind
```

---

## Styling (NativeWind)

Tailwind classes work directly on React Native components via `className`. The theme in
`tailwind.config.js` matches the web app:

- **Primary** royal blue `#1B3C8A` · **Accent** warm orange `#F97316`
- Native style props (nav headers, tab bar, spinners) use the same hex values.

Global styles live in `global.css`; the NativeWind Metro transform is wired in
`metro.config.js` and the Babel preset in `babel.config.js`.

---

## Scripts

```bash
npm start            # expo start
npm run android      # open on Android
npm run ios          # open on iOS
npm run type-check   # tsc --noEmit
```

---

## Roadmap

Mobile-specific features are tracked as
[GitHub issues](https://github.com/pandoraa-box/ajo-soroban/issues) — including real
mobile wallet connect (WalletConnect / deep-link) with biometric signing, push
notifications, offline-first caching, and QR-based circle invites.
