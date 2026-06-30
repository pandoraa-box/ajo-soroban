#![no_std]

mod cycle;
mod errors;
mod group;
mod storage;
mod types;

pub use errors::AjoError;
pub use types::{GroupConfig, GroupState, GroupStatus, ParticipantRecord};

use soroban_sdk::{contract, contractimpl, Address, Env};

#[contract]
pub struct AjoContract;

#[contractimpl]
impl AjoContract {
    // -----------------------------------------------------------------------
    // Group lifecycle
    // -----------------------------------------------------------------------

    /// Create a new Ajo savings group.  Admin is auto-enrolled in slot 0.
    /// Returns the group ID.
    pub fn create_group(
        env: Env,
        admin: Address,
        token: Address,
        contribution_amount: i128,
        cycle_interval_ledgers: u32,
        max_participants: u32,
    ) -> u32 {
        group::create_group(
            &env,
            admin,
            token,
            contribution_amount,
            cycle_interval_ledgers,
            max_participants,
        )
    }

    /// Join an open group.  Fails when the group is full or already active.
    pub fn join_group(env: Env, group_id: u32, participant: Address) -> Result<(), AjoError> {
        group::join_group(&env, group_id, participant)
    }

    // -----------------------------------------------------------------------
    // Contribution & payout
    // -----------------------------------------------------------------------

    /// Deposit one cycle contribution.  Caller must have approved this
    /// contract to transfer `contribution_amount` tokens beforehand.
    pub fn contribute(env: Env, group_id: u32, participant: Address) -> Result<(), AjoError> {
        cycle::contribute(&env, group_id, participant)
    }

    /// Trigger payout to the current cycle's recipient once all participants
    /// have contributed.  Returns the recipient address.
    pub fn payout(env: Env, group_id: u32) -> Result<Address, AjoError> {
        cycle::payout(&env, group_id)
    }

    // -----------------------------------------------------------------------
    // Read-only queries
    // -----------------------------------------------------------------------

    pub fn get_config(env: Env, group_id: u32) -> Result<GroupConfig, AjoError> {
        group::get_config(&env, group_id)
    }

    pub fn get_state(env: Env, group_id: u32) -> Result<GroupState, AjoError> {
        group::get_state(&env, group_id)
    }
}

// -----------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------
#[cfg(test)]
mod tests;
