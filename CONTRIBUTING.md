# Contributing to Ajo

Thanks for your interest in contributing! Ajo is a trustless rotating savings
protocol (Ajo / Esusu) built on **Stellar Soroban**, with a Next.js web app and an
Expo React Native mobile app. Contributions of every size are welcome.

This repository participates in open-source contribution programs on Stellar such as
the **[Drips Stellar Wave](https://www.drips.network/wave/stellar)** and
**[GrantFox](https://grantfox.xyz/)**, where scoped issues are rewarded. See
[open issues](https://github.com/pandoraa-box/ajo-soroban/issues) to find something to work on.

---

## Repository layout

| Folder | Stack | Guide |
|--------|-------|-------|
| [`contracts/`](./contracts) | Rust · Soroban | [contracts/README.md](./contracts/README.md) |
| [`frontend/`](./frontend) | Next.js 15 · Tailwind | [frontend/README.md](./frontend/README.md) |
| [`mobile/`](./mobile) | Expo · React Native | [mobile/README.md](./mobile/README.md) |

---

## Getting set up

```bash
# Smart contract
cd contracts && cargo test

# Web app (mock mode — no contract needed)
cd frontend && npm install && npm run dev

# Mobile app
cd mobile && npm install && npx expo start
```

Both apps run in **mock mode** by default, so you can build and test UI changes without a
deployed contract.

---

## Picking an issue

1. Browse [open issues](https://github.com/pandoraa-box/ajo-soroban/issues). Each issue is
   tagged by **scope** in its title (`[Contract]`, `[Mobile]`, `[Contract + Frontend]`, …)
   and by **difficulty** label (`good first issue`, `intermediate`, `advanced`).
2. Every issue lists the **work required**, **acceptance criteria**, and the exact
   **files to touch** — so you can start without reading the whole codebase.
3. Comment on the issue to claim it before starting, to avoid duplicate work.

New here? Start with a **`good first issue`**.

---

## Workflow

1. **Fork** the repo and create a branch: `git checkout -b feat/<short-name>`.
2. Make your change. Keep it focused on a single issue.
3. **Match the surrounding code** — naming, formatting, and structure.
4. Run the checks for the package you touched:
   - Contract: `cargo test` (and `cargo build --release --target wasm32-unknown-unknown`)
   - Frontend: `npm run type-check && npm run lint && npm run build`
   - Mobile: `npm run type-check`
5. Commit with a clear message (e.g. `feat: enforce cycle interval on payout`).
6. Open a **pull request** that references the issue (`Closes #NN`) and describes what you
   changed and how you tested it.

---

## Coding standards

- **Contract (Rust):** keep modules small and single-purpose. Add unit tests in
  `tests.rs` for every new entry point and error path. Never break an existing test.
- **Web / Mobile (TypeScript):** strict typing — no `any`. Reuse the shared design tokens
  (`ajo-dark` blue, `ajo-lime` orange) rather than hardcoding hex. Keep components small.
- **Commits:** conventional style (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`).

---

## Pull request checklist

- [ ] The change is scoped to a single issue.
- [ ] Tests / type-checks pass locally for the package you touched.
- [ ] New contract logic has unit tests (success **and** failure paths).
- [ ] No secrets, `.env` files, or build artifacts committed.
- [ ] The PR description references the issue and explains how you tested.

---

## Reporting bugs & ideas

Open an issue with clear reproduction steps (for bugs) or a concrete proposal (for
features). For anything spanning contract + frontend + mobile, note which layers are
affected — it helps maintainers scope and label it.

By contributing, you agree that your contributions are licensed under the
[MIT License](./LICENSE).
