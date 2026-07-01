# Ajo Smart Contract

The on-chain heart of Ajo — a trustless rotating savings protocol written in **Rust**
for the **Stellar Soroban** platform. This package is self-contained: no frontend or
mobile code lives here.

---

## What it does

Manages the full lifecycle of a savings circle:

1. **Create** a group with a fixed contribution amount, cycle interval, and size.
2. **Join** — members fill the slots; the group auto-activates when full.
3. **Contribute** — each member deposits their contribution per cycle (SEP-41 token).
4. **Payout** — once everyone has contributed, the pooled sum is released to the
   current cycle's recipient and the rotation advances.
5. **Complete** — after every member has received exactly one payout.

---

## State machine

```
create_group() → Open ──(last slot fills)──▶ Active ──(final payout)──▶ Complete
                          ▲                     │
                          └──(payout, more cycles remain)──┘
```

| State | Description |
|-------|-------------|
| `Open` | Accepting participants up to `max_participants`. |
| `Active` | Full; members contribute each cycle, payout follows. |
| `Complete` | Every participant has received one payout. |

---

## Public interface (`lib.rs`)

| Function | Description |
|----------|-------------|
| `create_group(admin, token, amount, interval, max)` | Create a circle; admin joins slot 0. Returns `group_id`. |
| `join_group(group_id, participant)` | Join an open group. |
| `contribute(group_id, participant)` | Deposit one cycle's contribution. |
| `payout(group_id)` | Release the pool to the current recipient; advance rotation. |
| `get_config(group_id)` | Read immutable group config. |
| `get_state(group_id)` | Read mutable runtime state. |

---

## Module layout

```
contracts/ajo/src/
├── lib.rs       # #[contractimpl] public entry points
├── types.rs     # GroupConfig, GroupState, GroupStatus, ParticipantRecord, DataKey
├── errors.rs    # AjoError (#[contracterror])
├── storage.rs   # persistent storage helpers + TTL bumping
├── group.rs     # create_group, join_group lifecycle
├── cycle.rs     # contribute, payout logic
└── tests.rs     # unit tests
```

Each module is intentionally small and single-purpose so features can be added as
isolated pull requests.

---

## Building & testing

Requires Rust stable with the `wasm32-unknown-unknown` target:

```bash
rustup target add wasm32-unknown-unknown

# Run unit tests (native, no WASM tooling needed)
cargo test

# Build the WASM artifact
cargo build --release --target wasm32-unknown-unknown
# → target/wasm32-unknown-unknown/release/ajo.wasm
```

---

## Storage & tokens

- **Persistent storage** for all long-lived state, with TTL bumped on every access
  (≈60-day extend, 30-day low-water mark) to keep entries alive.
- **SEP-41 token** (`token::Client`) for all fund movement — USDC or any compliant token.
  Contributions pull funds into the contract; payouts transfer the pool to the recipient.

---

## Roadmap

Contract-layer features are tracked as
[GitHub issues](https://github.com/pandoraa-box/ajo-soroban/issues) — including default
detection, collateral/slashing, governance voting, reputation scoring, verifiable random
rotation, and emergency dissolution.
