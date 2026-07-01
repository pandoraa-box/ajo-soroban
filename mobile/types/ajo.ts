export type GroupStatus = 'Open' | 'Active' | 'Complete';

export interface GroupConfig {
  token: string;
  contribution_amount: bigint;
  cycle_interval_ledgers: number;
  max_participants: number;
  admin: string;
}

export interface GroupState {
  status: GroupStatus;
  participants: string[];
  current_cycle: number;
  cycle_start_ledger: number;
  paid_this_cycle: string[];
}

export interface Circle {
  id: number;
  name: string;
  config: GroupConfig;
  state: GroupState;
}

export interface WalletState {
  publicKey: string | null;
  network: 'TESTNET' | 'MAINNET';
  isConnected: boolean;
}

export const STROOPS_PER_UNIT = 10_000_000n;

export function formatAmount(stroops: bigint): string {
  const units = Number(stroops) / Number(STROOPS_PER_UNIT);
  return '$' + units.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function shortenAddress(addr: string, chars = 4): string {
  if (!addr) return '';
  return `${addr.slice(0, chars + 1)}...${addr.slice(-chars)}`;
}

export function cycleIntervalToDays(ledgers: number): number {
  return Math.round((ledgers * 5) / 86400);
}

export function contributionProgressPct(state: GroupState): number {
  if (state.participants.length === 0) return 0;
  return Math.round((state.paid_this_cycle.length / state.participants.length) * 100);
}
