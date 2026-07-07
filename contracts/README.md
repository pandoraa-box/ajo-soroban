# Ajo Smart Contract

The on-chain core of Ajo — a trustless rotating savings protocol written in **Rust**
for the **Stellar Soroban** platform (SDK v22). This package is fully self-contained:
no frontend or mobile code lives here.

---

## What it does

Manages two products:

### 1. Rotating Savings Circles (Ajo / Esusu)
1. **Create** a named group with a token, contribution amount, cycle interval, and size.
2. **Join** — members fill slots; the group auto-activates when the last slot is taken.
3. **Contribute** — each member deposits their contribution for the current cycle. When
   the last member pays in, `payout_pending` is set automatically.
4. **Claim payout** — the designated recipient calls `claim_payout()` to receive the
   pooled funds. Missed contributors have their `missed_cycles` counter incremented.
   The rotation then advances to the next cycle.
5. **Complete** — after every member has received exactly one payout.

### 2. Tiered Savings Vault
Members can lock idle funds for fixed-term yield independent of any circle:

| Tier | Lock | APR | Min deposit |
|------|------|-----|-------------|
| Flex | None | 4.50 % | 10 USDC |
| Growth | ~90 days | 9.20 % | 100 USDC |
| Power | ~365 days | 14.80 % | 500 USDC |

---

## State machine

```
create_group()
      │
      ▼
    Open ──(last slot fills)──▶ Active ──(final claim_payout)──▶ Complete
                                  │  ▲
                    contribute()  │  │ claim_payout() advances rotation
                    (all pay →    │  │
                    payout_pending)│  │
                                  ▼  │
                             payout_pending = true
```

| State | Description |
|-------|-------------|
| `Open` | Accepting participants up to `max_participants`. |
| `Active` | Full; contributions accepted each cycle. |
| `Complete` | Every participant has received exactly one payout. |

---

## Public interface

### Circle functions

| Function | Description |
|----------|-------------|
| `create_group(admin, name, token, amount, interval, max)` | Create a named circle; admin auto-joins slot 0. Returns `group_id`. |
| `join_group(group_id, participant)` | Join an open group; adds to participant groups reverse index. |
| `contribute(group_id, participant)` | Deposit one cycle contribution. Auto-sets `payout_pending` when all have paid. |
| `claim_payout(group_id)` | Recipient calls to receive pooled funds. Advances rotation; tracks missed cycles. |
| `get_config(group_id)` | Read immutable group configuration (name, token, amount, interval, admin). |
| `get_state(group_id)` | Read mutable runtime state (status, cycle, participants, payout_pending). |
| `get_participant_groups(address)` | Return all group IDs this address has joined (reverse index). |

### Vault functions

| Function | Description |
|----------|-------------|
| `deposit_vault(owner, token, amount, tier)` | Lock funds in a tiered vault. Returns `vault_id`. |
| `claim_vault(vault_id, owner)` | Claim principal + accrued yield once maturity is reached. |
| `get_vault(vault_id)` | Read vault details (principal, tier, maturity ledger, claimed flag). |
| `preview_yield(vault_id)` | Estimate yield accrued to the current ledger without claiming. |

---

## Module layout

```
contracts/ajo/src/
├── lib.rs       # #[contractimpl] — all public entry points
├── types.rs     # GroupConfig, GroupState, GroupStatus, ParticipantRecord
│               #   VaultTier, VaultDeposit, DataKey
├── errors.rs    # AjoError (16 variants, #[contracterror])
├── storage.rs   # persistent + instance storage helpers, TTL rent management,
│               #   participant-groups reverse index, vault storage
├── group.rs     # create_group, join_group — lifecycle + reverse-index maintenance
├── cycle.rs     # contribute (auto-trigger), claim_payout, missed-cycle tracking
├── vault.rs     # deposit, claim, preview_yield, tier params, yield formula
└── tests.rs     # 32 unit tests
```

---

## Key types

```rust
// Immutable circle config
pub struct GroupConfig {
    pub name: String,                  // human-readable label
    pub token: Address,                // SEP-41 token (e.g. USDC)
    pub contribution_amount: i128,
    pub cycle_interval_ledgers: u32,
    pub max_participants: u32,
    pub admin: Address,
}

// Mutable runtime state
pub struct GroupState {
    pub status: GroupStatus,           // Open | Active | Complete
    pub participants: Vec<Address>,
    pub current_cycle: u32,
    pub cycle_start_ledger: u32,
    pub next_payout_ledger: u32,       // expected payout ledger
    pub paid_this_cycle: Vec<Address>,
    pub payout_pending: bool,          // true once all have contributed
}

// Per-participant reputation data
pub struct ParticipantRecord {
    pub missed_cycles: u32,            // incremented for each missed round
    pub received_payout: bool,
}

// Vault
pub enum VaultTier { Flex, Growth, Power }

pub struct VaultDeposit {
    pub owner: Address,
    pub token: Address,
    pub principal: i128,
    pub tier: VaultTier,
    pub deposit_ledger: u32,
    pub maturity_ledger: u32,          // 0 for Flex (immediately claimable)
    pub claimed: bool,
}
```

---

## Error codes

| Code | Error | When |
|------|-------|------|
| 1 | `Unauthorized` | Caller is not the authorised actor for this action |
| 2 | `GroupNotFound` | `group_id` or `vault_id` does not exist |
| 3 | `InvalidGroupStatus` | Operation invalid for the group's current status |
| 4 | `GroupFull` | Group has reached `max_participants` |
| 5 | `AlreadyJoined` | Caller is already a member |
| 6 | `NotAMember` | Caller is not in the group |
| 7 | `AlreadyPaid` | Caller already contributed this cycle |
| 8 | `CycleIncomplete` | Not all participants have contributed yet |
| 9 | `CycleNotReady` | Minimum cycle interval has not elapsed |
| 10 | `Overflow` | Arithmetic overflow in pool calculation |
| 11 | `NoPendingPayout` | `claim_payout` called but `payout_pending` is false |
| 12 | `PayoutAlreadyPending` | `contribute` called while a payout claim is outstanding |
| 13 | `VaultNotFound` | Vault ID does not exist |
| 14 | `VaultAlreadyClaimed` | Vault has already been claimed |
| 15 | `VaultLocked` | Vault maturity ledger not yet reached |
| 16 | `InsufficientDeposit` | Amount is below the tier's minimum deposit |

---

## Building & testing

Requires Rust stable with the `wasm32-unknown-unknown` target:

```bash
rustup target add wasm32-unknown-unknown

# Run all 32 unit tests (native, no WASM tooling needed)
cargo test

# Build the WASM artifact
cargo build --release --target wasm32-unknown-unknown
# → target/wasm32-unknown-unknown/release/ajo.wasm
```

---

## Storage model

All group and vault state uses **persistent storage** with TTL bumped on every read/write
(≈ 60-day extend, 30-day low-water mark) so entries stay live between cycles.
The `NextGroupId` and `NextVaultId` counters live in **instance storage** (cheaper for
frequently updated scalars).

All fund movement uses the **SEP-41 token interface** (`token::Client`) — USDC or any
compliant Stellar asset. Contributions pull funds into the contract via `transfer`;
payouts and vault claims push funds back to recipients.

---

## Roadmap

Contract-layer features tracked as
[GitHub issues](https://github.com/pandoraa-box/ajo-soroban/issues) — including enforced
cycle timing with grace periods, PenaltyPolicy config and `flag_defaulter()`, a global
circle status index with pagination, Vault V2 treasury reserve with dynamic APR, and a
cross-circle reputation engine with premium circle gating.
