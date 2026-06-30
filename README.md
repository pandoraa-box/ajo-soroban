# ajo-soroban

Trustless rotating savings protocol built on Soroban for the Stellar network.

This is a contract-only port of an Ethereum/Solidity Ajo/Esusu implementation.
No mobile or frontend code lives here — this repository is purely the smart
contract layer.

---

## What is Ajo / Esusu?

**Ajo** (Yoruba) and **Esusu** (Igbo) are traditional West African rotating
savings and credit associations (ROSCAs). A fixed group of people each
contribute the same amount of money at regular intervals; at every interval,
the entire pooled sum is paid out to one member. The rotation continues until
every member has received exactly one payout. Everyone ends up paying in and
receiving out the same total — but each member benefits from a lump-sum
payment *before* they have saved the full amount themselves.

Example with 4 participants each contributing $100/week:

```
Week 1 → Pool = $400 → paid to Alice   (Alice now has $400 after only $100 in)
Week 2 → Pool = $400 → paid to Bob
Week 3 → Pool = $400 → paid to Carol
Week 4 → Pool = $400 → paid to Dave    (Dave waited longest, but ends even)
```

The protocol depends entirely on trust that every member will contribute each
cycle. This contract removes that dependency by enforcing contributions and
payouts on-chain.

---

## Contract state machine

```
         create_group()
               │
               ▼
          ┌─────────┐
          │  Open   │  ← participants join via join_group()
          └─────────┘
               │ last slot fills (auto-transition)
               ▼
          ┌──────────┐
          │  Active  │  ◄──────────────────────────────┐
          └──────────┘                                  │
               │                                        │
               │  all participants call contribute()    │
               │                                        │
               ▼                                        │
          pool is full → payout() releases              │
          funds to current cycle's recipient            │
               │                                        │
               │  cycle advances (current_cycle += 1)  │
               │  if more cycles remain ───────────────►┘
               │
               │  current_cycle == len(participants)
               ▼
          ┌──────────────┐
          │   Complete   │
          └──────────────┘
```

### States

| State      | Description |
|------------|-------------|
| `Open`     | Group created; accepting new participants up to `max_participants`. |
| `Active`   | Group is full. Participants submit contributions each cycle; payout follows. |
| `Complete` | Every participant has received one payout. No further actions possible. |

### Transition rules

- `Open → Active`: triggered automatically when the last participant joins.
- `Active → Active`: after each successful `payout()` when more cycles remain.
- `Active → Complete`: after the final `payout()`.

---

## How it maps to Ajo/Esusu

| Traditional concept | Contract equivalent |
|---------------------|---------------------|
| Group organiser     | `admin` address (slot 0 in rotation) |
| Fixed contribution  | `contribution_amount` in token stroops |
| Contribution period | `cycle_interval_ledgers` (min ledgers between cycle starts) |
| Payout rotation     | `participants` Vec index == `current_cycle` |
| Trustless guarantee | On-chain token transfer via SEP-41 `token::Client` |

---

## Project structure

```
contracts/
└── ajo/
    └── src/
        ├── lib.rs       — contract entry point; public interface via #[contractimpl]
        ├── types.rs     — GroupConfig, GroupState, GroupStatus, ParticipantRecord, DataKey
        ├── errors.rs    — AjoError enum (#[contracterror])
        ├── storage.rs   — persistent storage helpers with TTL bumping
        ├── group.rs     — create_group, join_group lifecycle logic
        ├── cycle.rs     — contribute, payout logic
        └── tests.rs     — unit tests
```

Each module is intentionally small and single-purpose so individual features
(default handling, penalty logic, additional queries) can be implemented as
isolated GitHub issues by external contributors without needing to understand
the entire codebase.

---

## Building and testing

Requires Rust stable with the `wasm32-unknown-unknown` target:

```bash
rustup target add wasm32-unknown-unknown
```

```bash
# Run unit tests (native, no WASM tooling needed)
cargo test

# Build the WASM artifact
cargo build --release --target wasm32-unknown-unknown
```

The compiled contract will be at:
`target/wasm32-unknown-unknown/release/ajo.wasm`

---

## Storage design

Soroban charges rent per ledger entry proportional to how long it lives. This
contract uses **persistent** storage for all long-lived state and bumps TTL on
every read/write to keep entries alive:

| Key pattern                   | Type                | Notes |
|-------------------------------|---------------------|-------|
| `Config(group_id)`            | `GroupConfig`       | Immutable after creation |
| `State(group_id)`             | `GroupState`        | Updated every contribute/payout |
| `Participant(group_id, addr)` | `ParticipantRecord` | Updated on payout receipt |
| `NextGroupId`                 | `u32`               | Instance storage counter |

TTL is bumped to 60 days (≈ 1,036,800 ledgers) on every access, with a
30-day low-water mark to avoid unnecessary bumps.

---

## Token integration

The contract uses Soroban's `token::Client` (SEP-41) for all fund movement.
USDC or any compliant token contract can be used.

- **Contribute**: calls `token.transfer(participant → contract, amount)`.
  The participant must hold sufficient balance; the participant authorises the
  transfer directly via Soroban auth.
- **Payout**: calls `token.transfer(contract → recipient, pool_total)`.

---

## Planned follow-up issues

The following are scoped as separate GitHub issues for contributors:

- [ ] **Default handling** — detect missed contributions; flag participant;
  optionally pause cycle or redistribute slot.
- [ ] **Penalty / slashing** — lock a collateral deposit at join time;
  slash it on missed contributions.
- [ ] **Manual group start** — allow admin to start the group before it fills
  (useful for smaller groups that don't want to wait for a full cohort).
- [ ] **Cycle interval enforcement** — enforce `cycle_interval_ledgers`
  minimum gap between payouts (currently stored but not enforced).
- [ ] **Participant query** — expose `get_participant_record` for off-chain
  UIs to display per-member status.
- [ ] **Extended test coverage** — edge cases: overflow, re-entrant calls,
  zero-amount groups, single-member groups.
