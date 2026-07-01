import type { Circle } from '@/types/ajo';
import { MOCK_CIRCLES } from './mockData';

const USE_MOCK = true;

export async function fetchAllCircles(): Promise<Circle[]> {
  if (USE_MOCK) return MOCK_CIRCLES;
  return [];
}

export async function fetchCircle(groupId: number): Promise<Circle | null> {
  if (USE_MOCK) return MOCK_CIRCLES.find((c) => c.id === groupId) ?? null;
  return null;
}

export async function txJoinGroup(_groupId: number): Promise<string> {
  await new Promise((r) => setTimeout(r, 1000));
  return 'mock_tx_join_' + Math.random().toString(36).slice(2);
}

export async function txContribute(_groupId: number): Promise<string> {
  await new Promise((r) => setTimeout(r, 1000));
  return 'mock_tx_contribute_' + Math.random().toString(36).slice(2);
}

export async function txPayout(_groupId: number): Promise<string> {
  await new Promise((r) => setTimeout(r, 1000));
  return 'mock_tx_payout_' + Math.random().toString(36).slice(2);
}
