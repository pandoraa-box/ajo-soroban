use soroban_sdk::{contracttype, Address, Vec};

/// Current lifecycle state of a savings group.
#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum GroupStatus {
    /// Accepting new participants; no contributions yet.
    Open,
    /// All slots filled or group manually started; contributions accepted.
    Active,
    /// Every participant has received one payout.
    Complete,
}

/// Immutable configuration set at group creation time.
#[contracttype]
#[derive(Clone, Debug)]
pub struct GroupConfig {
    /// Token contract address (USDC or any SEP-41 token).
    pub token: Address,
    /// Amount each participant must contribute per cycle, in token stroops.
    pub contribution_amount: i128,
    /// Minimum ledger gap between the start of consecutive cycles.
    pub cycle_interval_ledgers: u32,
    /// Maximum (and exact) number of participants.
    pub max_participants: u32,
    /// Account that created the group.
    pub admin: Address,
}

/// Mutable runtime state of a savings group.
#[contracttype]
#[derive(Clone, Debug)]
pub struct GroupState {
    pub status: GroupStatus,
    /// Ordered list of participants; index determines payout rotation.
    pub participants: Vec<Address>,
    /// Index into `participants` for the current cycle's payout recipient.
    pub current_cycle: u32,
    /// Ledger number when the current cycle started.
    pub cycle_start_ledger: u32,
    /// Addresses that have contributed in the current cycle.
    pub paid_this_cycle: Vec<Address>,
}

/// Per-participant record (future-proofing for penalty/reputation tracking).
#[contracttype]
#[derive(Clone, Debug)]
pub struct ParticipantRecord {
    pub missed_cycles: u32,
    pub received_payout: bool,
}

/// Storage key namespacing.
#[contracttype]
pub enum DataKey {
    /// GroupConfig keyed by group_id.
    Config(u32),
    /// GroupState keyed by group_id.
    State(u32),
    /// ParticipantRecord keyed by (group_id, address).
    Participant(u32, Address),
    /// Monotonically increasing counter for group IDs.
    NextGroupId,
}
