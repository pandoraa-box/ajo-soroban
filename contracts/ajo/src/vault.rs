/// Tiered savings vault (mirrors Rolla's Flex / Growth / Power tiers).
///
/// Users deposit a SEP-41 token and earn a fixed APR based on their chosen
/// lock tier.  The contract holds the principal; yield is paid from a
/// treasury reserve that must be funded separately.
use soroban_sdk::{token, Address, Env};

use crate::errors::AjoError;
use crate::storage::{increment_vault_id, load_vault, save_vault};
use crate::types::{VaultDeposit, VaultTier};

// 1 day in ledgers at ~5 s per ledger.
const DAY_LEDGERS: u32 = 17_280;
// Approximate ledgers in one year.
const YEAR_LEDGERS: i128 = 365 * 17_280;

/// Tier-specific parameters: (lock_ledgers, apr_bps, min_deposit_stroops).
///
/// Min deposits assume a 6-decimal token (USDC):
///   10 USDC  = 10_000_000 stroops
///  100 USDC  = 100_000_000 stroops
///  500 USDC  = 500_000_000 stroops
fn tier_params(tier: &VaultTier) -> (u32, i128, i128) {
    match tier {
        VaultTier::Flex => (
            0,                    // no lock
            450,                  // 4.50 % APR
            10_000_000,           // min 10 USDC
        ),
        VaultTier::Growth => (
            90 * DAY_LEDGERS,     // ~90-day lock
            920,                  // 9.20 % APR
            100_000_000,          // min 100 USDC
        ),
        VaultTier::Power => (
            365 * DAY_LEDGERS,    // ~365-day lock
            1_480,                // 14.80 % APR
            500_000_000,          // min 500 USDC
        ),
    }
}

/// Compute accrued yield.
///
/// Formula: `principal * apr_bps * ledgers_held / (10_000 * YEAR_LEDGERS)`
fn compute_yield(principal: i128, apr_bps: i128, ledgers_held: u32) -> i128 {
    principal
        .saturating_mul(apr_bps)
        .saturating_mul(ledgers_held as i128)
        / (10_000 * YEAR_LEDGERS)
}

/// Deposit `amount` of `token` into a new vault with the given `tier`.
///
/// Caller must have pre-approved this contract to transfer `amount` tokens.
/// Returns the new `vault_id`.
pub fn deposit(
    env: &Env,
    owner: Address,
    token: Address,
    amount: i128,
    tier: VaultTier,
) -> Result<u32, AjoError> {
    owner.require_auth();

    let (lock_ledgers, _apr, min_deposit) = tier_params(&tier);

    if amount < min_deposit {
        return Err(AjoError::InsufficientDeposit);
    }

    // Pull tokens from the owner into this contract.
    let token_client = token::Client::new(env, &token);
    token_client.transfer(&owner, &env.current_contract_address(), &amount);

    let deposit_ledger = env.ledger().sequence();
    let maturity_ledger = if lock_ledgers == 0 {
        0 // Flex: always claimable
    } else {
        deposit_ledger + lock_ledgers
    };

    let vault_id = increment_vault_id(env);
    save_vault(
        env,
        vault_id,
        &VaultDeposit {
            owner,
            token,
            principal: amount,
            tier,
            deposit_ledger,
            maturity_ledger,
            claimed: false,
        },
    );

    Ok(vault_id)
}

/// Claim principal plus accrued yield from vault `vault_id`.
///
/// Fails if the maturity ledger has not been reached (Growth/Power tiers).
/// Returns the total amount transferred (principal + yield).
pub fn claim_vault(env: &Env, vault_id: u32, owner: Address) -> Result<i128, AjoError> {
    owner.require_auth();

    let mut vault = load_vault(env, vault_id)?;

    if vault.owner != owner {
        return Err(AjoError::Unauthorized);
    }
    if vault.claimed {
        return Err(AjoError::VaultAlreadyClaimed);
    }

    let current_ledger = env.ledger().sequence();

    // Flex vaults (maturity_ledger == 0) are immediately claimable.
    if vault.maturity_ledger > 0 && current_ledger < vault.maturity_ledger {
        return Err(AjoError::VaultLocked);
    }

    let (_lock, apr_bps, _min) = tier_params(&vault.tier);
    let ledgers_held = current_ledger.saturating_sub(vault.deposit_ledger);
    let yield_earned = compute_yield(vault.principal, apr_bps, ledgers_held);
    let total = vault.principal + yield_earned;

    let token_client = token::Client::new(env, &vault.token);
    token_client.transfer(&env.current_contract_address(), &owner, &total);

    vault.claimed = true;
    save_vault(env, vault_id, &vault);

    Ok(total)
}

/// Return the stored details for vault `vault_id`.
pub fn get_vault_info(env: &Env, vault_id: u32) -> Result<VaultDeposit, AjoError> {
    load_vault(env, vault_id)
}

/// Preview the yield that would be credited if `vault_id` were claimed now.
pub fn preview_yield(env: &Env, vault_id: u32) -> Result<i128, AjoError> {
    let vault = load_vault(env, vault_id)?;
    if vault.claimed {
        return Ok(0);
    }
    let (_lock, apr_bps, _min) = tier_params(&vault.tier);
    let current_ledger = env.ledger().sequence();
    let ledgers_held = current_ledger.saturating_sub(vault.deposit_ledger);
    Ok(compute_yield(vault.principal, apr_bps, ledgers_held))
}
