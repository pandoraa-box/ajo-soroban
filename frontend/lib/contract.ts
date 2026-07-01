import type { Circle, GroupConfig, GroupState, ParticipantRecord } from '@/types/ajo';
import { MOCK_CIRCLES } from './mockData';
import {
  CONTRACT_ID,
  addrToScVal,
  u32ToScVal,
  i128ToScVal,
  simulateContractCall,
  buildAndPrepareTransaction,
  submitSignedTransaction,
} from './stellar';
import { signTx, getWalletPublicKey } from './freighter';
import { NETWORK_PASSPHRASE } from './stellar';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || !CONTRACT_ID;

// ─── Read helpers ─────────────────────────────────────────────────────────────

export async function fetchGroupConfig(
  groupId: number,
  callerKey: string,
): Promise<GroupConfig> {
  if (USE_MOCK) {
    const c = MOCK_CIRCLES.find((x) => x.id === groupId);
    if (!c) throw new Error(`Group ${groupId} not found`);
    return c.config;
  }
  const raw = await simulateContractCall(
    CONTRACT_ID,
    'get_config',
    [u32ToScVal(groupId)],
    callerKey,
  ) as Record<string, unknown>;
  return {
    token: raw.token as string,
    contribution_amount: BigInt(raw.contribution_amount as string),
    cycle_interval_ledgers: raw.cycle_interval_ledgers as number,
    max_participants: raw.max_participants as number,
    admin: raw.admin as string,
  };
}

export async function fetchGroupState(
  groupId: number,
  callerKey: string,
): Promise<GroupState> {
  if (USE_MOCK) {
    const c = MOCK_CIRCLES.find((x) => x.id === groupId);
    if (!c) throw new Error(`Group ${groupId} not found`);
    return c.state;
  }
  const raw = await simulateContractCall(
    CONTRACT_ID,
    'get_state',
    [u32ToScVal(groupId)],
    callerKey,
  ) as Record<string, unknown>;
  return raw as unknown as GroupState;
}

export async function fetchCircle(groupId: number, callerKey: string): Promise<Circle> {
  const [config, state] = await Promise.all([
    fetchGroupConfig(groupId, callerKey),
    fetchGroupState(groupId, callerKey),
  ]);
  const mock = MOCK_CIRCLES.find((x) => x.id === groupId);
  return { id: groupId, name: mock?.name ?? `Circle #${groupId}`, config, state };
}

export async function fetchAllCircles(callerKey: string): Promise<Circle[]> {
  if (USE_MOCK) return MOCK_CIRCLES;
  return [];
}

// ─── Write helpers ─────────────────────────────────────────────────────────────

export async function txCreateGroup(
  token: string,
  contributionAmount: bigint,
  cycleIntervalLedgers: number,
  maxParticipants: number,
): Promise<string> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 1200));
    return 'mock_tx_create_' + Math.random().toString(36).slice(2);
  }
  const publicKey = await getWalletPublicKey();
  const xdr = await buildAndPrepareTransaction(
    CONTRACT_ID,
    'create_group',
    [
      addrToScVal(publicKey),
      addrToScVal(token),
      i128ToScVal(contributionAmount),
      u32ToScVal(cycleIntervalLedgers),
      u32ToScVal(maxParticipants),
    ],
    publicKey,
  );
  const signed = await signTx(xdr, NETWORK_PASSPHRASE, publicKey);
  return submitSignedTransaction(signed);
}

export async function txJoinGroup(groupId: number): Promise<string> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 900));
    return 'mock_tx_join_' + Math.random().toString(36).slice(2);
  }
  const publicKey = await getWalletPublicKey();
  const xdr = await buildAndPrepareTransaction(
    CONTRACT_ID,
    'join_group',
    [u32ToScVal(groupId), addrToScVal(publicKey)],
    publicKey,
  );
  const signed = await signTx(xdr, NETWORK_PASSPHRASE, publicKey);
  return submitSignedTransaction(signed);
}

export async function txContribute(groupId: number): Promise<string> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 1000));
    return 'mock_tx_contribute_' + Math.random().toString(36).slice(2);
  }
  const publicKey = await getWalletPublicKey();
  const xdr = await buildAndPrepareTransaction(
    CONTRACT_ID,
    'contribute',
    [u32ToScVal(groupId), addrToScVal(publicKey)],
    publicKey,
  );
  const signed = await signTx(xdr, NETWORK_PASSPHRASE, publicKey);
  return submitSignedTransaction(signed);
}

export async function txPayout(groupId: number): Promise<string> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 1000));
    return 'mock_tx_payout_' + Math.random().toString(36).slice(2);
  }
  const publicKey = await getWalletPublicKey();
  const xdr = await buildAndPrepareTransaction(
    CONTRACT_ID,
    'payout',
    [u32ToScVal(groupId)],
    publicKey,
  );
  const signed = await signTx(xdr, NETWORK_PASSPHRASE, publicKey);
  return submitSignedTransaction(signed);
}
