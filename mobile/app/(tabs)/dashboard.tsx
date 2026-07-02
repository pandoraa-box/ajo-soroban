import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { User } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useWallet } from '@/context/WalletContext';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { CircleCard } from '@/components/circles/CircleCard';
import { Button } from '@/components/ui/Button';
import { fetchAllCircles } from '@/lib/contract';
import { formatAmount, shortenAddress } from '@/types/ajo';
import type { Circle } from '@/types/ajo';

export default function DashboardScreen() {
  const { publicKey, isConnected, connect } = useWallet();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [inputKey, setInputKey] = useState('');
  const router = useRouter();

  useEffect(() => { fetchAllCircles().then(setCircles); }, []);

  const myCircles = publicKey
    ? circles.filter((c) => c.state.participants.includes(publicKey))
    : [];

  const upcomingPayout = myCircles.find(
    (c) =>
      c.state.status === 'Active' &&
      c.state.participants[c.state.current_cycle] === publicKey,
  );

  if (!isConnected) {
    return (
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-1 items-center justify-center px-8 gap-4">
          <Text className="text-5xl">🔒</Text>
          <Text className="text-xl font-serif font-bold text-ajo-dark text-center tracking-tight">Connect your wallet</Text>
          <Text className="text-sm text-ajo-muted text-center leading-5">
            Enter your Stellar public key to view your circles and savings.
          </Text>
          {showInput ? (
            <View className="w-full gap-3">
              <TextInput
                value={inputKey}
                onChangeText={setInputKey}
                placeholder="G... (56 character public key)"
                placeholderTextColor="#9CA3AF"
                className="border border-ajo-border rounded-2xl px-4 py-3 text-sm font-mono text-ajo-dark bg-white"
                autoCapitalize="characters"
                autoCorrect={false}
              />
              <Button fullWidth onPress={() => connect(inputKey.trim())}>Connect</Button>
              <Button variant="ghost" fullWidth onPress={() => setShowInput(false)}>Cancel</Button>
            </View>
          ) : (
            <TouchableOpacity 
              onPress={() => setShowInput(true)}
              activeOpacity={0.8}
              className="mt-4 flex-row items-center gap-3 bg-white border border-ajo-border/60 rounded-full px-6 py-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
            >
              <View className="w-5 h-5 rounded-full overflow-hidden flex-row">
                <View className="flex-1 bg-blue-500" />
                <View className="flex-1 bg-purple-500" />
                <View className="flex-1 bg-pink-500" />
                <View className="flex-1 bg-yellow-400" />
              </View>
              <Text className="font-bold text-ajo-dark text-base px-2">Connect Wallet</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ gap: 20, paddingTop: 20, paddingBottom: 32 }}>
        {/* Header */}
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-xs font-semibold uppercase tracking-widest text-ajo-muted mb-1">Welcome back,</Text>
            <Text className="text-[28px] font-serif font-bold text-ajo-dark tracking-tight">
              {shortenAddress(publicKey!, 8)}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => router.push('/circles/create')}
              className="bg-ajo-lime rounded-xl px-5 py-2.5 shadow-sm"
            >
              <Text className="text-white font-bold text-sm">+ New</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} className="w-10 h-10 rounded-xl bg-white border border-ajo-border/60 items-center justify-center shadow-sm">
              <User size={18} color="#1E1D1B" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Payout notification */}
        {upcomingPayout && (
          <TouchableOpacity
            onPress={() => router.push(`/circles/${upcomingPayout.id}`)}
            className="flex-row items-center gap-3 bg-ajo-amber-light border border-ajo-amber-light rounded-2xl p-4"
          >
            <Text className="text-2xl">🎉</Text>
            <View className="flex-1">
              <Text className="font-semibold text-ajo-amber text-sm">You're next for payout!</Text>
              <Text className="text-xs text-ajo-amber/80 mt-0.5">
                {upcomingPayout.name} — {formatAmount(
                  upcomingPayout.config.contribution_amount * BigInt(upcomingPayout.config.max_participants),
                )} pending
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Metrics row */}
        <View className="flex-row gap-3">
          <MetricCard
            label="Active circles"
            value={String(myCircles.filter((c) => c.state.status === 'Active').length)}
            icon="🌀"
          />
          <MetricCard
            label="Next payout"
            value={upcomingPayout
              ? formatAmount(upcomingPayout.config.contribution_amount * BigInt(upcomingPayout.config.max_participants))
              : '—'}
            icon="🏆"
            accent={upcomingPayout ? 'green' : 'default'}
          />
        </View>

        {/* My Circles */}
        <View className="mt-2">
          <Text className="text-xl font-serif font-bold text-ajo-dark mb-4 tracking-tight">My Circles</Text>
          {myCircles.length === 0 ? (
            <View className="items-center py-8 border border-dashed border-ajo-border rounded-2xl gap-2">
              <Text className="text-sm text-ajo-muted">You haven't joined any circles yet.</Text>
              <Button size="sm" onPress={() => router.push('/(tabs)/circles')}>
                Browse Circles
              </Button>
            </View>
          ) : (
            <View className="gap-3">
              {myCircles.map((c) => <CircleCard key={c.id} circle={c} />)}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
