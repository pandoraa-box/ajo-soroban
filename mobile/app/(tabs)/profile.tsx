import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '@/context/WalletContext';
import { shortenAddress } from '@/types/ajo';
import { Button } from '@/components/ui/Button';

const STATS = [
  { label: 'Circles joined',     value: '—'     },
  { label: 'Payouts received',   value: '—'     },
  { label: 'Contributions made', value: '—'     },
  { label: 'Reputation score',   value: '—/100' },
];

export default function ProfileScreen() {
  const { publicKey, isConnected, disconnect } = useWallet();

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingTop: 20, paddingBottom: 32, gap: 16 }}>
        <Text className="text-2xl font-extrabold text-ajo-dark tracking-tight">Profile</Text>

        {isConnected && publicKey ? (
          <>
            {/* Profile card */}
            <View className="bg-white rounded-2xl border border-ajo-border p-6 items-center gap-3">
              <View className="w-16 h-16 rounded-2xl bg-ajo-dark items-center justify-center">
                <Text className="text-white text-3xl font-extrabold">{publicKey[1]}</Text>
              </View>
              <Text className="text-base font-bold text-ajo-dark font-mono">
                {shortenAddress(publicKey, 8)}
              </Text>
              <View className="flex-row items-center gap-1.5 bg-ajo-lime-soft rounded-full px-3 py-1.5">
                <View className="w-1.5 h-1.5 rounded-full bg-ajo-lime" />
                <Text className="text-xs text-ajo-lime font-semibold">Stellar Testnet</Text>
              </View>
            </View>

            {/* Stats grid */}
            <View className="flex-row flex-wrap gap-2">
              {STATS.map((s) => (
                <View key={s.label} className="bg-white rounded-2xl border border-ajo-border p-4 items-center" style={{ minWidth: '47%', flex: 1 }}>
                  <Text className="text-xl font-extrabold text-ajo-dark mb-1">{s.value}</Text>
                  <Text className="text-xs text-ajo-muted text-center">{s.label}</Text>
                </View>
              ))}
            </View>

            {/* Coming soon */}
            <View className="bg-ajo-bg rounded-2xl p-5 items-center gap-2">
              <Text className="text-3xl">📊</Text>
              <Text className="text-sm font-bold text-ajo-dark">Full profile coming soon</Text>
              <Text className="text-xs text-ajo-muted text-center leading-5">
                Earnings history, reputation score, and circle activity appear here once connected
                to a deployed Testnet contract.
              </Text>
            </View>

            <Button variant="secondary" fullWidth onPress={disconnect}>
              Disconnect Wallet
            </Button>
          </>
        ) : (
          <View className="flex-1 items-center pt-16 gap-3">
            <Text className="text-5xl">👤</Text>
            <Text className="text-lg font-bold text-ajo-dark">No wallet connected</Text>
            <Text className="text-sm text-ajo-muted text-center leading-5 px-5">
              Go to the Dashboard tab and enter your Stellar public key to connect.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
