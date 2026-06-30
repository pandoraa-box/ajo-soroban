/// Group lifecycle: create, join, start.
use soroban_sdk::{Address, Env, Vec};

use crate::errors::AjoError;
use crate::storage::{increment_group_id, load_config, load_state, save_config, save_participant, save_state};
use crate::types::{GroupConfig, GroupState, GroupStatus, ParticipantRecord};

/// Create a new savings group.
///
/// # Arguments
/// * `token`                  - SEP-41 token contract (e.g. USDC)
/// * `contribution_amount`    - Stroops each participant pays per cycle
/// * `cycle_interval_ledgers` - Minimum ledgers between cycle starts
/// * `max_participants`       - Fixed group size; also determines rotation length
///
/// Returns the new `group_id`.
pub fn create_group(
    env: &Env,
    admin: Address,
    token: Address,
    contribution_amount: i128,
    cycle_interval_ledgers: u32,
    max_participants: u32,
) -> u32 {
    admin.require_auth();

    let group_id = increment_group_id(env);

    let config = GroupConfig {
        token,
        contribution_amount,
        cycle_interval_ledgers,
        max_participants,
        admin: admin.clone(),
    };

    let state = GroupState {
        status: GroupStatus::Open,
        participants: Vec::new(env),
        current_cycle: 0,
        cycle_start_ledger: 0,
        paid_this_cycle: Vec::new(env),
    };

    save_config(env, group_id, &config);
    save_state(env, group_id, &state);

    // Admin auto-joins as first participant, setting rotation slot 0.
    _join(env, group_id, admin, &config, state);

    group_id
}

/// Join an open group as a participant.
pub fn join_group(env: &Env, group_id: u32, participant: Address) -> Result<(), AjoError> {
    participant.require_auth();

    let config = load_config(env, group_id)?;
    let state = load_state(env, group_id)?;

    // Capacity check before status: a full group returns GroupFull even if
    // it has already auto-activated, giving a more specific error.
    if state.participants.len() >= config.max_participants {
        return Err(AjoError::GroupFull);
    }
    if state.status != GroupStatus::Open {
        return Err(AjoError::InvalidGroupStatus);
    }
    if state.participants.contains(&participant) {
        return Err(AjoError::AlreadyJoined);
    }

    _join(env, group_id, participant, &config, state);
    Ok(())
}

fn _join(env: &Env, group_id: u32, participant: Address, config: &GroupConfig, mut state: GroupState) {
    state.participants.push_back(participant.clone());

    // Auto-activate when the last slot is filled.
    if state.participants.len() == config.max_participants {
        state.status = GroupStatus::Active;
        state.cycle_start_ledger = env.ledger().sequence();
    }

    save_state(env, group_id, &state);
    save_participant(
        env,
        group_id,
        &participant,
        &ParticipantRecord {
            missed_cycles: 0,
            received_payout: false,
        },
    );
}

/// Query group config (read-only helper for tests and frontends).
pub fn get_config(env: &Env, group_id: u32) -> Result<GroupConfig, AjoError> {
    load_config(env, group_id)
}

/// Query group state (read-only helper for tests and frontends).
pub fn get_state(env: &Env, group_id: u32) -> Result<GroupState, AjoError> {
    load_state(env, group_id)
}
