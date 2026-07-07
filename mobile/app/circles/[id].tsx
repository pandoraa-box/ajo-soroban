import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { fetchCircle, txContribute, txJoinGroup, txPayout } from '@/lib/contract';
import { useWallet } from '@/context/WalletContext';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  formatAmount,
  shortenAddress,
  cycleIntervalToDays,
  contributionProgressPct,
  type Circle,
} from '@/types/ajo';

export default function CircleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { publicKey, isConnected } = useWallet();
  const [circle, setCircle] = useState<Circle | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { fetchCircle(parseInt(id, 10)).then(setCircle); }, [id]);

  if (!circle) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center" edges={['top']}>
        <Text className="text-ajo-muted">Loading…</Text>
      </SafeAreaView>
    );
  }

  const { config, state } = circle;
  const isMember = publicKey ? state.participants.includes(publicKey) : false;
  const hasContributed = publicKey ? state.paid_this_cycle.includes(publicKey) : false;
  const allPaid = state.paid_this_cycle.length >= state.participants.length;
  const pct = contributionProgressPct(state);
  const days = cycleIntervalToDays(config.cycle_interval_ledgers);
  const pool = formatAmount(config.contribution_amount * BigInt(config.max_participants));

  async function runAction(label: string, fn: () => Promise<string>) {
    if (!isConnected) { Alert.alert('Connect wallet first'); return; }
    setActionLoading(label);
    try {
      const hash = await fn();
      Alert.alert('Success', `TX: ${hash.slice(0, 24)}…`);
      const updated = await fetchCircle(parseInt(id, 10));
      if (updated) setCircle(updated);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Transaction failed');
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <Stack.Screen options={{ title: circle.config.name, headerBackTitle: 'Circles' }} />
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingTop: 16, paddingBottom: 32, gap: 16 }}>

        {/* Header */}
        <View className="flex-row items-center gap-3">
          <View className="w-14 h-14 rounded-2xl bg-ajo-dark items-center justify-center">
            <Text className="text-white text-2xl font-extrabold">{circle.config.name[0]}</Text>
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-2 flex-wrap">
              <Text className="text-[28px] font-serif font-bold text-ajo-dark tracking-tight leading-tight">{circle.config.name}</Text>
              <StatusBadge status={state.status} />
            </View>
            <Text className="text-xs text-ajo-muted font-mono mt-0.5">
              Admin: {shortenAddress(config.admin)}
            </Text>
          </View>
        </View>

        {/* Config chips */}
        <View className="flex-row flex-wrap gap-2">
          {[
            ['Token',    'USDC'                               ],
            ['Per cycle', formatAmount(config.contribution_amount)],
            ['Cycle',    `${days} days`                       ],
            ['Size',     `${config.max_participants} members` ],
          ].map(([k, v]) => (
            <View key={k} className="bg-white border border-ajo-border rounded-2xl px-4 py-3 items-center flex-1" style={{ minWidth: '45%' }}>
              <Text className="text-xs text-ajo-muted mb-0.5">{k}</Text>
              <Text className="text-sm font-bold text-ajo-dark">{v}</Text>
            </View>
          ))}
        </View>

        {/* Pool banner */}
        <View className="bg-ajo-dark rounded-3xl p-6 flex-row justify-between items-center shadow-sm">
          <View>
            <Text className="text-[10px] uppercase font-bold tracking-widest text-white/50 mb-1">Total payout pool</Text>
            <Text className="text-3xl font-serif font-bold text-white">{pool}</Text>
          </View>
          {state.status === 'Active' && (
            <View className="items-end">
              <Text className="text-xs text-white/50">Cycle {state.current_cycle + 1}/{config.max_participants}</Text>
              <Text className="text-sm font-semibold text-ajo-lime mt-0.5">
                → {shortenAddress(state.participants[state.current_cycle] ?? '')}
              </Text>
            </View>
          )}
        </View>

        {/* Contribution progress */}
        {state.status === 'Active' && (
          <View className="gap-2">
            <Text className="text-sm font-bold text-ajo-dark">Contributions this cycle</Text>
            <View className="h-2 w-full rounded-full bg-ajo-surface overflow-hidden">
              <View
                className="h-2 rounded-full bg-ajo-lime"
                style={{ width: `${pct}%` }}
              />
            </View>
            <Text className="text-xs text-ajo-muted">
              {state.paid_this_cycle.length}/{state.participants.length} members have paid
            </Text>
          </View>
        )}

        {/* Member rotation */}
        <View className="gap-2">
          <Text className="text-sm font-bold text-ajo-dark">Rotation Order</Text>
          {state.participants.map((addr, i) => {
            const paid = state.paid_this_cycle.includes(addr);
            const isCurrent = i === state.current_cycle && state.status === 'Active';
            const isMe = addr === publicKey;
            return (
              <View
                key={addr}
                className={`flex-row items-center gap-3 rounded-2xl px-4 py-3 border ${isCurrent ? 'bg-ajo-lime-soft border-ajo-lime' : 'bg-white border-ajo-border'}`}
              >
                <Text className="text-xs font-bold text-ajo-muted w-4 text-center">{i + 1}</Text>
                <Text className={`flex-1 text-sm font-mono ${isMe ? 'font-bold text-ajo-dark' : 'text-ajo-dark'}`}>
                  {shortenAddress(addr)}
                </Text>
                {isMe && (
                  <View className="bg-ajo-dark rounded-md px-1.5 py-0.5">
                    <Text className="text-white text-xs font-semibold">you</Text>
                  </View>
                )}
                {isCurrent && (
                  <View className="bg-ajo-lime rounded-md px-2 py-0.5">
                    <Text className="text-white text-xs font-semibold">This cycle</Text>
                  </View>
                )}
                <Text className={`text-xs font-semibold ${paid ? 'text-ajo-lime' : 'text-ajo-muted'}`}>
                  {paid ? '✓ Paid' : 'Pending'}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Actions */}
        <View className="gap-3 pb-4">
          {state.status === 'Open' && !isMember && (
            <Button fullWidth loading={actionLoading === 'join'}
              onPress={() => runAction('join', () => txJoinGroup(circle.id))}>
              Join Circle
            </Button>
          )}
          {state.status === 'Active' && isMember && !hasContributed && (
            <Button variant="lime" fullWidth loading={actionLoading === 'contribute'}
              onPress={() => runAction('contribute', () => txContribute(circle.id))}>
              Contribute {formatAmount(config.contribution_amount)}
            </Button>
          )}
          {state.status === 'Active' && allPaid && (
            <Button fullWidth loading={actionLoading === 'payout'}
              onPress={() => runAction('payout', () => txPayout(circle.id))}>
              Trigger Payout
            </Button>
          )}
          {state.status === 'Active' && isMember && hasContributed && !allPaid && (
            <View className="bg-ajo-lime-soft rounded-2xl p-4 items-center">
              <Text className="text-ajo-lime font-semibold text-sm">
                ✓ You've contributed — waiting for others…
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
