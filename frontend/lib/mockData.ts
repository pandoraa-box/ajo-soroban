import type { Circle } from '@/types/ajo';

const DEMO_ADDRESSES = [
  'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGLEWUS2XFXTHM5MYOMTDI',
  'GBVNBFXKPDV7CQHVZXLC2FPYZYJSPGQJ7FJMCXSQFXJ7AZBJNBDNILW',
  'GD6RKCG7YWQNLP2MVQQQGTFGCYGQJ5QKQP7JRFVHPWQKSKZQALRB2ZC',
  'GDRXXQQ43CQHWZ6LWBP3N4TQKPWJ7MNJT5VXVKFPJXHQM4DKRVSYG7',
  'GBPFR7YNQMQ4DTFZJBQ4LBNBKLLMXYV5ZTTZRJR7MEWFBQO7FQDLXBK',
  'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPGQS7SVUOEDTFSMY25EBTEZQEN',
  'GCJZLKLKTUVIJJGIMQVFZQKNBNNHEHFASTNQEJHCXEPJ2GBCJQ6M3WD5',
  'GDQJUTQYK2MQX2WZZA5VXLPMLEXLNB43MZ2OYC2NGKXN6R6BKTGCKWV',
];

const USDC_TESTNET = 'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA';

export const MOCK_CIRCLES: Circle[] = [
  {
    id: 1,
    name: 'Lagos Fam Circle',
    config: {
      token: USDC_TESTNET,
      contribution_amount: 1_000_000_000n,
      cycle_interval_ledgers: 120960,
      max_participants: 5,
      admin: DEMO_ADDRESSES[0],
    },
    state: {
      status: 'Active',
      participants: DEMO_ADDRESSES.slice(0, 5),
      current_cycle: 2,
      cycle_start_ledger: 52000000,
      paid_this_cycle: DEMO_ADDRESSES.slice(0, 3),
    },
  },
  {
    id: 2,
    name: 'Abuja Builders',
    config: {
      token: USDC_TESTNET,
      contribution_amount: 500_000_000n,
      cycle_interval_ledgers: 60480,
      max_participants: 8,
      admin: DEMO_ADDRESSES[1],
    },
    state: {
      status: 'Open',
      participants: DEMO_ADDRESSES.slice(1, 4),
      current_cycle: 0,
      cycle_start_ledger: 0,
      paid_this_cycle: [],
    },
  },
  {
    id: 3,
    name: 'Nairobi Savings Ring',
    config: {
      token: USDC_TESTNET,
      contribution_amount: 2_000_000_000n,
      cycle_interval_ledgers: 241920,
      max_participants: 6,
      admin: DEMO_ADDRESSES[2],
    },
    state: {
      status: 'Active',
      participants: DEMO_ADDRESSES.slice(2, 8),
      current_cycle: 1,
      cycle_start_ledger: 51500000,
      paid_this_cycle: DEMO_ADDRESSES.slice(2, 7),
    },
  },
  {
    id: 4,
    name: 'Accra Gold Circle',
    config: {
      token: USDC_TESTNET,
      contribution_amount: 250_000_000n,
      cycle_interval_ledgers: 30240,
      max_participants: 4,
      admin: DEMO_ADDRESSES[4],
    },
    state: {
      status: 'Complete',
      participants: DEMO_ADDRESSES.slice(4, 8),
      current_cycle: 4,
      cycle_start_ledger: 50000000,
      paid_this_cycle: [],
    },
  },
  {
    id: 5,
    name: 'Diaspora Trust Fund',
    config: {
      token: USDC_TESTNET,
      contribution_amount: 5_000_000_000n,
      cycle_interval_ledgers: 483840,
      max_participants: 10,
      admin: DEMO_ADDRESSES[0],
    },
    state: {
      status: 'Open',
      participants: DEMO_ADDRESSES.slice(0, 2),
      current_cycle: 0,
      cycle_start_ledger: 0,
      paid_this_cycle: [],
    },
  },
];

export const MOCK_USER_CIRCLES = MOCK_CIRCLES.filter((c) =>
  c.state.participants.includes(DEMO_ADDRESSES[0]),
);
