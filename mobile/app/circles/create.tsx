import { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { useWallet } from '@/context/WalletContext';
import { formatAmount, STROOPS_PER_UNIT } from '@/types/ajo';

const CYCLE_OPTIONS = [
  { label: '1 week',  ledgers: 120960  },
  { label: '2 weeks', ledgers: 241920  },
  { label: '1 month', ledgers: 518400  },
];
const SIZE_OPTIONS = [3, 4, 5, 6, 8, 10];

export default function CreateCircleScreen() {
  const router = useRouter();
  const { isConnected } = useWallet();
  const [amount, setAmount] = useState('100');
  const [cycleIdx, setCycleIdx] = useState(0);
  const [maxMembers, setMaxMembers] = useState(5);
  const [loading, setLoading] = useState(false);

  const amountNum = parseFloat(amount) || 0;
  const amountStroops = BigInt(Math.round(amountNum * Number(STROOPS_PER_UNIT)));
  const totalPool = amountStroops * BigInt(maxMembers);

  async function handleDeploy() {
    if (!isConnected) {
      Alert.alert('Wallet not connected', 'Connect your wallet from the Dashboard first.');
      return;
    }
    if (amountNum <= 0) { Alert.alert('Invalid amount', 'Enter an amount greater than 0.'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    Alert.alert('Circle created!', 'Mock transaction submitted.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <Stack.Screen options={{ title: 'Start a Circle', headerBackTitle: 'Circles' }} />
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, gap: 20 }}>
        <View>
          <Text className="text-[28px] font-serif font-bold text-ajo-dark tracking-tight leading-tight">Configure your circle</Text>
          <Text className="text-[10px] font-semibold uppercase tracking-widest text-ajo-muted mt-2">You'll be assigned rotation slot #1 as creator.</Text>
        </View>

        {/* Contribution amount */}
        <View className="gap-2">
          <Text className="text-sm font-semibold text-ajo-dark">Contribution per cycle (USDC)</Text>
          <View className="flex-row items-center border border-ajo-border rounded-2xl bg-white px-4">
            <Text className="text-base text-ajo-muted mr-1">$</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              className="flex-1 py-4 text-2xl font-bold text-ajo-dark"
              placeholder="100"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Cycle length */}
        <View className="gap-2">
          <Text className="text-sm font-semibold text-ajo-dark">Cycle length</Text>
          <View className="flex-row gap-2">
            {CYCLE_OPTIONS.map((opt, i) => (
              <TouchableOpacity
                key={opt.label}
                onPress={() => setCycleIdx(i)}
                className={`flex-1 py-3 rounded-2xl border items-center ${cycleIdx === i ? 'bg-ajo-dark border-ajo-dark' : 'bg-white border-ajo-border'}`}
              >
                <Text className={`text-sm font-semibold ${cycleIdx === i ? 'text-white' : 'text-ajo-muted'}`}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Group size */}
        <View className="gap-2">
          <Text className="text-sm font-semibold text-ajo-dark">Group size</Text>
          <View className="flex-row flex-wrap gap-2">
            {SIZE_OPTIONS.map((n) => (
              <TouchableOpacity
                key={n}
                onPress={() => setMaxMembers(n)}
                className={`w-12 h-12 rounded-full border items-center justify-center ${maxMembers === n ? 'bg-ajo-dark border-ajo-dark' : 'bg-white border-ajo-border'}`}
              >
                <Text className={`text-sm font-bold ${maxMembers === n ? 'text-white' : 'text-ajo-muted'}`}>
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary */}
        <View className="bg-ajo-surface border border-ajo-border/60 rounded-3xl p-6 gap-3 shadow-sm">
          <Text className="text-xs font-semibold text-ajo-muted uppercase tracking-wide">Circle Summary</Text>
          {[
            ['Per cycle',      `$${amountNum.toFixed(0)} USDC`],
            ['Cycle length',   CYCLE_OPTIONS[cycleIdx].label],
            ['Members',        String(maxMembers)],
            ['Total rotation', `${maxMembers} cycles`],
          ].map(([k, v]) => (
            <View key={k} className="flex-row justify-between">
              <Text className="text-sm text-ajo-muted">{k}</Text>
              <Text className="text-sm font-semibold text-ajo-dark">{v}</Text>
            </View>
          ))}
          <View className="border-t border-ajo-border/60 pt-4 flex-row justify-between items-center mt-2">
            <Text className="text-sm font-semibold text-ajo-dark">Payout pool</Text>
            <Text className="text-2xl font-serif font-bold text-ajo-lime">{formatAmount(totalPool)}</Text>
          </View>
        </View>

        <Button fullWidth loading={loading} onPress={handleDeploy}>
          {isConnected ? 'Deploy Circle' : 'Connect Wallet First'}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
