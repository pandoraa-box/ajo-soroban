use soroban_sdk::{Address, Env};

use crate::errors::AjoError;
use crate::types::{DataKey, GroupConfig, GroupState, ParticipantRecord};

// Storage rent bump constants.
// Soroban charges rent per ledger entry; bumping TTL keeps entries alive.
// 1 day ≈ 17,280 ledgers (5-second ledger time).
const DAY_LEDGERS: u32 = 17_280;
const BUMP_AMOUNT: u32 = 60 * DAY_LEDGERS; // extend by ~60 days on access
const MIN_TTL: u32 = 30 * DAY_LEDGERS; // only bump when TTL drops below 30 days

// ---------- NextGroupId ----------

pub fn get_next_group_id(env: &Env) -> u32 {
    let key = DataKey::NextGroupId;
    if let Some(id) = env.storage().instance().get::<_, u32>(&key) {
        id
    } else {
        1
    }
}

pub fn increment_group_id(env: &Env) -> u32 {
    let id = get_next_group_id(env);
    env.storage()
        .instance()
        .set(&DataKey::NextGroupId, &(id + 1));
    id
}

// ---------- GroupConfig ----------

pub fn save_config(env: &Env, group_id: u32, config: &GroupConfig) {
    let key = DataKey::Config(group_id);
    env.storage().persistent().set(&key, config);
    env.storage()
        .persistent()
        .extend_ttl(&key, MIN_TTL, BUMP_AMOUNT);
}

pub fn load_config(env: &Env, group_id: u32) -> Result<GroupConfig, AjoError> {
    let key = DataKey::Config(group_id);
    let config = env
        .storage()
        .persistent()
        .get::<_, GroupConfig>(&key)
        .ok_or(AjoError::GroupNotFound)?;
    env.storage()
        .persistent()
        .extend_ttl(&key, MIN_TTL, BUMP_AMOUNT);
    Ok(config)
}

// ---------- GroupState ----------

pub fn save_state(env: &Env, group_id: u32, state: &GroupState) {
    let key = DataKey::State(group_id);
    env.storage().persistent().set(&key, state);
    env.storage()
        .persistent()
        .extend_ttl(&key, MIN_TTL, BUMP_AMOUNT);
}

pub fn load_state(env: &Env, group_id: u32) -> Result<GroupState, AjoError> {
    let key = DataKey::State(group_id);
    let state = env
        .storage()
        .persistent()
        .get::<_, GroupState>(&key)
        .ok_or(AjoError::GroupNotFound)?;
    env.storage()
        .persistent()
        .extend_ttl(&key, MIN_TTL, BUMP_AMOUNT);
    Ok(state)
}

// ---------- ParticipantRecord ----------

pub fn save_participant(env: &Env, group_id: u32, address: &Address, record: &ParticipantRecord) {
    let key = DataKey::Participant(group_id, address.clone());
    env.storage().persistent().set(&key, record);
    env.storage()
        .persistent()
        .extend_ttl(&key, MIN_TTL, BUMP_AMOUNT);
}

pub fn load_participant(
    env: &Env,
    group_id: u32,
    address: &Address,
) -> Option<ParticipantRecord> {
    let key = DataKey::Participant(group_id, address.clone());
    let record = env
        .storage()
        .persistent()
        .get::<_, ParticipantRecord>(&key)?;
    env.storage()
        .persistent()
        .extend_ttl(&key, MIN_TTL, BUMP_AMOUNT);
    Some(record)
}
