import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, Eye, EyeOff, ChevronRight, Gift, ArrowRight } from 'lucide-react-native';
import { useWallet } from '@/context/WalletContext';
import { fetchAllCircles } from '@/lib/contract';
import { CircleCard } from '@/components/circles/CircleCard';
import { formatAmount, shortenAddress } from '@/types/ajo';
import type { Circle } from '@/types/ajo';

export default function HomeScreen() {
  const router = useRouter();
  const { publicKey, isConnected } = useWallet();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [balanceVisible, setBalanceVisible] = useState(true);

  useEffect(() => {
    fetchAllCircles().then(setCircles);
  }, []);

  const myCircles = publicKey
    ? circles.filter((c) => c.state.participants.includes(publicKey))
    : [];
  const activeCount = myCircles.filter((c) => c.state.status === 'Active').length;
  const openCount = circles.filter((c) => c.state.status === 'Open').length;

  const upcomingPayout = myCircles.find(
    (c) =>
      c.state.status === 'Active' &&
      c.state.participants[c.state.current_cycle] === publicKey,
  );

  const totalSaved = myCircles.reduce(
    (sum, c) =>
      sum +
      (c.state.paid_this_cycle.includes(publicKey ?? '') ? c.config.contribution_amount : 0n),
    0n,
  );

  return (
    <SafeAreaView className="flex-1 bg-ajo-surface" edges={['top']}>
      <ScrollView className="flex-1" bounces showsVerticalScrollIndicator={false}>

        {/* ── Dark Header ── */}
        <View className="bg-ajo-dark px-5 pt-4 pb-10">
          {/* Top bar */}
          <View className="flex-row items-center justify-between mb-8">
            <View className="flex-row items-center gap-2.5">
              <View className="w-8 h-8 rounded-xl bg-ajo-lime items-center justify-center">
                <Text className="text-white font-black text-base">A</Text>
              </View>
              <Text className="text-white font-bold text-xl tracking-tight">Ajo</Text>
            </View>

            <View className="flex-row items-center gap-2">
              {isConnected && publicKey ? (
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/wallet')}
                  className="flex-row items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5"
                >
                  <View className="w-1.5 h-1.5 rounded-full bg-ajo-green" />
                  <Text className="text-white text-[10px] font-bold uppercase tracking-widest">
                    {shortenAddress(publicKey, 4)}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/wallet')}
                  className="flex-row items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5"
                >
                  <Text className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                    Connect
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => router.push('/(tabs)/profile')}
                className="w-9 h-9 rounded-full bg-ajo-lime items-center justify-center"
              >
                {publicKey ? (
                  <Text className="text-white font-black text-sm">
                    {publicKey[1]?.toUpperCase() ?? 'A'}
                  </Text>
                ) : (
                  <User size={16} color="#fff" strokeWidth={2.5} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Balance */}
          <View className="gap-2 mb-5">
            <View className="flex-row items-center gap-2">
              <Text className="text-white/50 text-xs font-semibold uppercase tracking-widest">
                Total in Circles
              </Text>
              <TouchableOpacity
                onPress={() => setBalanceVisible(!balanceVisible)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {balanceVisible
                  ? <Eye size={13} color="rgba(255,255,255,0.4)" />
                  : <EyeOff size={13} color="rgba(255,255,255,0.4)" />}
              </TouchableOpacity>
            </View>

            <Text className="text-white text-[44px] font-bold tracking-tight leading-none">
              {balanceVisible
                ? (totalSaved > 0n ? formatAmount(totalSaved) : '$0.00')
                : '•••••'}
            </Text>
          </View>

          {/* Stat chips */}
          <View className="flex-row gap-2 flex-wrap">
            <View className="flex-row items-center gap-1.5 bg-ajo-lime rounded-full px-4 py-2">
              <Text className="text-white text-xs font-bold">{activeCount} active</Text>
            </View>

            {upcomingPayout && (
              <View className="flex-row items-center gap-1.5 bg-ajo-amber rounded-full px-4 py-2">
                <Gift size={11} color="#fff" />
                <Text className="text-white text-xs font-bold">Payout ready</Text>
              </View>
            )}

            <View className="flex-row items-center gap-1.5 bg-white/10 rounded-full px-4 py-2">
              <Text className="text-white/80 text-xs font-semibold">
                {myCircles.length} {myCircles.length === 1 ? 'circle' : 'circles'}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Payout alert (overlaps header) ── */}
        {upcomingPayout && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push(`/circles/${upcomingPayout.id}`)}
            className="mx-4 -mt-5 bg-ajo-amber-light border border-ajo-amber/20 rounded-3xl p-4 flex-row items-center gap-3 shadow-sm"
          >
            <View className="w-11 h-11 rounded-2xl bg-ajo-amber items-center justify-center">
              <Gift size={18} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-ajo-dark text-sm">You're next to receive!</Text>
              <Text className="text-xs text-ajo-muted mt-0.5">
                {upcomingPayout.config.name} —{' '}
                {formatAmount(
                  upcomingPayout.config.contribution_amount *
                    BigInt(upcomingPayout.config.max_participants),
                )}{' '}
                pending
              </Text>
            </View>
            <ChevronRight size={16} color="#73716D" />
          </TouchableOpacity>
        )}

        {/* ── My Circles section ── */}
        <View className={`px-5 pb-4 ${upcomingPayout ? 'pt-5' : 'pt-3 -mt-5'}`}>
          {/* If no payout alert, card overlaps header */}
          {!upcomingPayout && (
            <View className="h-5" />
          )}

          <View className="flex-row items-center justify-between mb-4 mt-2">
            <Text className="text-ajo-dark font-bold text-xl tracking-tight">My Circles</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/circles')}
              className="flex-row items-center gap-1"
            >
              <Text className="text-ajo-lime text-xs font-bold uppercase tracking-widest">
                See all
              </Text>
              <ArrowRight size={12} color="#D47253" />
            </TouchableOpacity>
          </View>

          {myCircles.length === 0 ? (
            <View className="items-center py-10 border border-dashed border-ajo-border rounded-3xl gap-3 bg-white">
              <Text className="text-4xl">🌀</Text>
              <Text className="text-sm font-bold text-ajo-dark">No circles yet</Text>
              <Text className="text-xs text-ajo-muted text-center px-8">
                Join or create a circle to start saving together.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/circles')}
                className="bg-ajo-dark rounded-full px-6 py-2.5 mt-1"
              >
                <Text className="text-white font-bold text-sm">Browse Circles</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="gap-3">
              {myCircles.slice(0, 3).map((c) => (
                <CircleCard key={c.id} circle={c} />
              ))}
            </View>
          )}
        </View>

        {/* ── Browse open circles CTA ── */}
        <View className="px-5 pb-8">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/circles')}
            className="bg-white border border-ajo-border rounded-3xl p-5 flex-row items-center justify-between shadow-sm"
          >
            <View className="flex-1">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-ajo-lime mb-1">
                {openCount} available
              </Text>
              <Text className="font-bold text-ajo-dark text-base tracking-tight">
                Browse open circles
              </Text>
              <Text className="text-xs text-ajo-muted mt-0.5">
                Join a circle accepting new members
              </Text>
            </View>
            <View className="w-10 h-10 rounded-full bg-ajo-lime items-center justify-center ml-3">
              <ChevronRight size={18} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
