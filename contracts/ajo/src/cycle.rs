/// Contribution and payout logic for one rotation cycle.
use soroban_sdk::{token, Address, Env};

use crate::errors::AjoError;
use crate::storage::{load_config, load_participant, load_state, save_participant, save_state};
use crate::types::{GroupStatus, ParticipantRecord};

/// Deposit the cycle contribution from `participant`.
///
/// The participant must have pre-approved this contract via token `approve`.
/// Soroban's `token::Client::transfer_from` pulls the funds trustlessly.
pub fn contribute(env: &Env, group_id: u32, participant: Address) -> Result<(), AjoError> {
    participant.require_auth();

    let config = load_config(env, group_id)?;
    let mut state = load_state(env, group_id)?;

    if state.status != GroupStatus::Active {
        return Err(AjoError::InvalidGroupStatus);
    }
    if !state.participants.contains(&participant) {
        return Err(AjoError::NotAMember);
    }
    if state.paid_this_cycle.contains(&participant) {
        return Err(AjoError::AlreadyPaid);
    }

    // Pull tokens from participant into this contract.
    let token_client = token::Client::new(env, &config.token);
    token_client.transfer(
        &participant,
        &env.current_contract_address(),
        &config.contribution_amount,
    );

    state.paid_this_cycle.push_back(participant.clone());
    save_state(env, group_id, &state);

    Ok(())
}

/// Release the pooled funds to the current cycle's recipient once every
/// participant has contributed.  Advances the rotation automatically.
pub fn payout(env: &Env, group_id: u32) -> Result<Address, AjoError> {
    let config = load_config(env, group_id)?;
    let mut state = load_state(env, group_id)?;

    if state.status != GroupStatus::Active {
        return Err(AjoError::InvalidGroupStatus);
    }

    // All participants must have contributed before payout.
    if state.paid_this_cycle.len() < state.participants.len() {
        return Err(AjoError::CycleIncomplete);
    }

    let recipient_idx = state.current_cycle;
    let recipient = state
        .participants
        .get(recipient_idx)
        .ok_or(AjoError::GroupNotFound)?;

    // Total pool = contribution × participant count.
    let pool = config
        .contribution_amount
        .checked_mul(state.participants.len() as i128)
        .ok_or(AjoError::Overflow)?;

    let token_client = token::Client::new(env, &config.token);
    token_client.transfer(&env.current_contract_address(), &recipient, &pool);

    // Mark participant as having received their payout.
    let mut record = load_participant(env, group_id, &recipient)
        .unwrap_or(ParticipantRecord { missed_cycles: 0, received_payout: false });
    record.received_payout = true;
    save_participant(env, group_id, &recipient, &record);

    // Advance to the next cycle.
    state.current_cycle += 1;
    state.paid_this_cycle = soroban_sdk::Vec::new(env);
    state.cycle_start_ledger = env.ledger().sequence();

    // Check if the entire rotation is complete.
    if state.current_cycle >= state.participants.len() {
        state.status = GroupStatus::Complete;
    }

    save_state(env, group_id, &state);

    Ok(recipient)
}
