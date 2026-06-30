use soroban_sdk::contracterror;

#[contracterror]
#[derive(Clone, Debug, PartialEq)]
pub enum AjoError {
    /// Caller is not authorised for this action.
    Unauthorized = 1,
    /// Requested group does not exist.
    GroupNotFound = 2,
    /// Group is not in the required state for this operation.
    InvalidGroupStatus = 3,
    /// Group has reached its participant cap.
    GroupFull = 4,
    /// Caller is already a member of this group.
    AlreadyJoined = 5,
    /// Caller is not a member of this group.
    NotAMember = 6,
    /// Caller has already contributed for the current cycle.
    AlreadyPaid = 7,
    /// Not all participants have contributed; payout cannot proceed.
    CycleIncomplete = 8,
    /// The cycle interval has not elapsed yet.
    CycleNotReady = 9,
    /// Arithmetic overflow.
    Overflow = 10,
}
