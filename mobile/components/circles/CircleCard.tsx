import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBadge } from '@/components/ui/Badge';
import type { Circle } from '@/types/ajo';
import { formatAmount, cycleIntervalToDays, contributionProgressPct } from '@/types/ajo';

export function CircleCard({ circle: c }: { circle: Circle }) {
  const router = useRouter();
  const pct = contributionProgressPct(c.state);
  const days = cycleIntervalToDays(c.config.cycle_interval_ledgers);
  const pool = formatAmount(c.config.contribution_amount * BigInt(c.config.max_participants));

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => router.push(`/circles/${c.id}`)}
      className="bg-white rounded-3xl border border-ajo-border p-5 gap-4"
    >
      {/* Header */}
      <View className="flex-row items-start gap-3">
        <View className="w-12 h-12 rounded-2xl bg-ajo-dark items-center justify-center">
          <Text className="text-white text-xl font-black">{c.name[0]}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-ajo-dark font-serif font-bold text-lg tracking-tight">{c.name}</Text>
          <Text className="text-ajo-muted text-[10px] uppercase tracking-widest mt-0.5">Circle #{c.id}</Text>
        </View>
        <StatusBadge status={c.state.status} />
      </View>

      {/* Big payout number */}
      <View className="bg-ajo-surface rounded-2xl px-5 py-4 border border-ajo-border/60">
        <Text className="text-[10px] font-bold uppercase tracking-widest text-ajo-muted mb-1">Full pot payout</Text>
        <Text className="text-2xl font-serif font-bold text-ajo-dark">{pool}</Text>
      </View>

      {/* Stats row */}
      <View className="flex-row items-center">
        <StatItem label="You save" value={formatAmount(c.config.contribution_amount)} />
        <View className="w-px h-8 bg-ajo-border" />
        <StatItem label="Members" value={`${c.state.participants.length}/${c.config.max_participants}`} />
        <View className="w-px h-8 bg-ajo-border" />
        <StatItem label="Every" value={`${days} days`} />
      </View>

      {/* Active progress */}
      {c.state.status === 'Active' && (
        <View className="gap-1.5">
          <View className="flex-row justify-between">
            <Text className="text-xs text-ajo-muted">Round {c.state.current_cycle + 1} of {c.config.max_participants}</Text>
            <Text className="text-xs font-semibold text-ajo-dark">{c.state.paid_this_cycle.length}/{c.state.participants.length} paid</Text>
          </View>
          <View className="h-2 w-full rounded-full bg-ajo-surface overflow-hidden">
            <View className="h-2 rounded-full bg-ajo-lime" style={{ width: `${pct}%` }} />
          </View>
        </View>
      )}

      {/* Open slots */}
      {c.state.status === 'Open' && (
        <View className="flex-row gap-1">
          {Array.from({ length: c.config.max_participants }).map((_, i) => (
            <View key={i} className={`flex-1 h-1.5 rounded-full ${i < c.state.participants.length ? 'bg-ajo-dark' : 'bg-ajo-surface'}`} />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 items-center gap-0.5">
      <Text className="text-[10px] font-bold uppercase tracking-widest text-ajo-muted mb-0.5">{label}</Text>
      <Text className="text-sm font-bold text-ajo-dark">{value}</Text>
    </View>
  );
}
