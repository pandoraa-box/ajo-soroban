//! Unit tests for the Ajo savings contract.
//!
//! Soroban test client conventions (v22):
//!  - `method(...)` returns the success type `T` directly; panics on any error.
//!  - `try_method(...)` returns `Result<Result<T, T::Error>, Result<E, InvokeError>>`
//!    where the outer Err wraps `Result<ContractError, InvokeError>`.
//!    To extract a specific contract error:
//!      `client.try_method(...).unwrap_err().unwrap()` → `ContractError`

extern crate std;
use std::vec::Vec;

use soroban_sdk::{
    testutils::Address as _,
    token::{Client as TokenClient, StellarAssetClient},
    Address, Env,
};

use crate::{AjoContract, AjoContractClient, AjoError, GroupStatus};

// ---------------------------------------------------------------------------
// Test harness
// ---------------------------------------------------------------------------

struct TestEnv {
    env: Env,
    contract: Address,
    token: Address,
}

impl TestEnv {
    fn new() -> Self {
        let env = Env::default();
        env.mock_all_auths();

        let contract = env.register(AjoContract, ());

        let token_admin = Address::generate(&env);
        let token = env.register_stellar_asset_contract_v2(token_admin);

        TestEnv {
            env,
            contract,
            token: token.address(),
        }
    }

    fn client(&self) -> AjoContractClient<'_> {
        AjoContractClient::new(&self.env, &self.contract)
    }

    fn token_client(&self) -> TokenClient<'_> {
        TokenClient::new(&self.env, &self.token)
    }

    fn mint(&self, to: &Address, amount: i128) {
        StellarAssetClient::new(&self.env, &self.token).mint(to, &amount);
    }

    /// Create a group with `n` fresh members; first member is admin (slot 0).
    fn create_group_with_n_members(&self, n: u32) -> (u32, Vec<Address>) {
        let members: Vec<Address> = (0..n).map(|_| Address::generate(&self.env)).collect();

        let group_id = self.client().create_group(
            &members[0],
            &self.token,
            &1_000_000, // 1 USDC (6 decimals)
            &100,       // 100-ledger cycle interval
            &n,
        );

        for m in &members[1..] {
            self.client().join_group(&group_id, m);
        }

        (group_id, members)
    }

    /// Extract the typed contract error from a `try_*` call result.
    fn contract_err<T: core::fmt::Debug>(
        result: Result<Result<T, soroban_sdk::ConversionError>, Result<AjoError, soroban_sdk::InvokeError>>,
    ) -> AjoError {
        result.unwrap_err().unwrap()
    }
}

// ---------------------------------------------------------------------------
// Group creation
// ---------------------------------------------------------------------------

#[test]
fn test_create_group_returns_incrementing_ids() {
    let t = TestEnv::new();
    let admin1 = Address::generate(&t.env);
    let admin2 = Address::generate(&t.env);

    let id1 = t.client().create_group(&admin1, &t.token, &500_000, &100, &3);
    let id2 = t.client().create_group(&admin2, &t.token, &500_000, &100, &3);

    assert_eq!(id1, 1);
    assert_eq!(id2, 2);
}

#[test]
fn test_create_group_admin_auto_joined() {
    let t = TestEnv::new();
    let admin = Address::generate(&t.env);
    let gid = t.client().create_group(&admin, &t.token, &1_000_000, &100, &3);

    let state = t.client().get_state(&gid);
    assert_eq!(state.participants.len(), 1);
    assert_eq!(state.participants.get(0).unwrap(), admin);
    assert_eq!(state.status, GroupStatus::Open);
}

#[test]
fn test_group_auto_activates_when_full() {
    let t = TestEnv::new();
    let (gid, _) = t.create_group_with_n_members(3);

    let state = t.client().get_state(&gid);
    assert_eq!(state.status, GroupStatus::Active);
    assert_eq!(state.participants.len(), 3);
}

// ---------------------------------------------------------------------------
// Joining
// ---------------------------------------------------------------------------

#[test]
fn test_join_group_success() {
    let t = TestEnv::new();
    let admin = Address::generate(&t.env);
    let alice = Address::generate(&t.env);

    let gid = t.client().create_group(&admin, &t.token, &1_000_000, &100, &3);
    t.client().join_group(&gid, &alice);

    let state = t.client().get_state(&gid);
    assert_eq!(state.participants.len(), 2);
}

#[test]
fn test_join_group_full_fails() {
    let t = TestEnv::new();
    // Capacity check fires before status, so GroupFull is returned even
    // though the group has also auto-activated.
    let (gid, _) = t.create_group_with_n_members(2);

    let extra = Address::generate(&t.env);
    let err = TestEnv::contract_err(t.client().try_join_group(&gid, &extra));
    assert_eq!(err, AjoError::GroupFull);
}

#[test]
fn test_join_group_duplicate_fails() {
    let t = TestEnv::new();
    let admin = Address::generate(&t.env);
    let alice = Address::generate(&t.env);

    let gid = t.client().create_group(&admin, &t.token, &1_000_000, &100, &4);
    t.client().join_group(&gid, &alice);

    let err = TestEnv::contract_err(t.client().try_join_group(&gid, &alice));
    assert_eq!(err, AjoError::AlreadyJoined);
}

#[test]
fn test_join_nonexistent_group_fails() {
    let t = TestEnv::new();
    let participant = Address::generate(&t.env);
    let err = TestEnv::contract_err(t.client().try_join_group(&999, &participant));
    assert_eq!(err, AjoError::GroupNotFound);
}

// ---------------------------------------------------------------------------
// Contribution
// ---------------------------------------------------------------------------

#[test]
fn test_contribute_success() {
    let t = TestEnv::new();
    let (gid, members) = t.create_group_with_n_members(2);

    for m in &members {
        t.mint(m, 1_000_000);
        t.client().contribute(&gid, m);
    }

    let state = t.client().get_state(&gid);
    assert_eq!(state.paid_this_cycle.len(), 2);
}

#[test]
fn test_double_contribute_fails() {
    let t = TestEnv::new();
    let (gid, members) = t.create_group_with_n_members(2);

    t.mint(&members[0], 2_000_000);
    t.client().contribute(&gid, &members[0]);

    let err = TestEnv::contract_err(t.client().try_contribute(&gid, &members[0]));
    assert_eq!(err, AjoError::AlreadyPaid);
}

#[test]
fn test_non_member_contribute_fails() {
    let t = TestEnv::new();
    let (gid, _) = t.create_group_with_n_members(2);

    let outsider = Address::generate(&t.env);
    t.mint(&outsider, 1_000_000);

    let err = TestEnv::contract_err(t.client().try_contribute(&gid, &outsider));
    assert_eq!(err, AjoError::NotAMember);
}

// ---------------------------------------------------------------------------
// Payout
// ---------------------------------------------------------------------------

#[test]
fn test_payout_before_all_contributed_fails() {
    let t = TestEnv::new();
    let (gid, members) = t.create_group_with_n_members(3);

    // Only one of three contributes.
    t.mint(&members[0], 1_000_000);
    t.client().contribute(&gid, &members[0]);

    let err = TestEnv::contract_err(t.client().try_payout(&gid));
    assert_eq!(err, AjoError::CycleIncomplete);
}

#[test]
fn test_full_rotation_two_members() {
    let t = TestEnv::new();
    let (gid, members) = t.create_group_with_n_members(2);
    let contribution = 1_000_000_i128;

    for m in &members {
        t.mint(m, contribution * 2);
    }

    // --- Cycle 0: recipient = members[0] ---
    for m in &members {
        t.client().contribute(&gid, m);
    }
    let recipient0 = t.client().payout(&gid);
    assert_eq!(recipient0, members[0]);

    // members[0]: started 2_000_000, paid 1_000_000, received 2_000_000 → 3_000_000.
    assert_eq!(t.token_client().balance(&members[0]), 3_000_000);

    let state_mid = t.client().get_state(&gid);
    assert_eq!(state_mid.current_cycle, 1);
    assert_eq!(state_mid.status, GroupStatus::Active);

    // --- Cycle 1: recipient = members[1] ---
    for m in &members {
        t.client().contribute(&gid, m);
    }
    let recipient1 = t.client().payout(&gid);
    assert_eq!(recipient1, members[1]);

    let state_final = t.client().get_state(&gid);
    assert_eq!(state_final.status, GroupStatus::Complete);

    // members[1]: started 2_000_000, paid 2 × 1_000_000, received 2_000_000 → 2_000_000.
    assert_eq!(t.token_client().balance(&members[1]), 2_000_000);
}

#[test]
fn test_full_rotation_three_members() {
    let t = TestEnv::new();
    let (gid, members) = t.create_group_with_n_members(3);
    let contribution = 1_000_000_i128;

    for m in &members {
        t.mint(m, contribution * 3);
    }

    let expected_payout = contribution * 3;

    for cycle in 0..3u32 {
        for m in &members {
            t.client().contribute(&gid, m);
        }
        let recipient = t.client().payout(&gid);
        assert_eq!(recipient, members[cycle as usize]);

        let contributions_paid = (cycle as i128 + 1) * contribution;
        let expected = (contribution * 3) - contributions_paid + expected_payout;
        assert_eq!(
            t.token_client().balance(&members[cycle as usize]),
            expected,
            "cycle {cycle} balance mismatch"
        );
    }

    assert_eq!(t.client().get_state(&gid).status, GroupStatus::Complete);
}

#[test]
fn test_payout_on_complete_group_fails() {
    let t = TestEnv::new();
    let (gid, members) = t.create_group_with_n_members(2);

    for m in &members {
        t.mint(m, 2_000_000);
    }

    for _ in 0..2 {
        for m in &members {
            t.client().contribute(&gid, m);
        }
        t.client().payout(&gid);
    }

    let err = TestEnv::contract_err(t.client().try_payout(&gid));
    assert_eq!(err, AjoError::InvalidGroupStatus);
}
