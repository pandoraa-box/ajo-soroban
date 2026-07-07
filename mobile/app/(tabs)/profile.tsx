import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { shortenAddress } from '@/types/ajo';
import { useRouter } from 'expo-router';
import { Bell, Wallet, LogOut } from 'lucide-react-native';

const STATS = [
  { label: 'Circles joined',     value: '—'     },
  { label: 'Payouts received',   value: '—'     },
  { label: 'Contributions made', value: '—'     },
  { label: 'Reputation score',   value: '—/100' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { publicKey, isConnected, disconnect } = useWallet();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const avatarLetter = publicKey ? publicKey[1]?.toUpperCase() ?? 'A' : 'A';

  return (
    <SafeAreaView className="flex-1 bg-ajo-surface" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {isConnected && publicKey ? (
          <>
            {/* ── Dark avatar header ── */}
            <View className="bg-ajo-dark items-center px-5 pt-8 pb-12">
              {/* Avatar */}
              <View className="w-20 h-20 rounded-full bg-ajo-lime items-center justify-center mb-3 shadow-lg">
                <Text className="text-white font-black text-3xl">{avatarLetter}</Text>
              </View>

              {/* Address */}
              <Text className="text-white font-bold text-base mb-2" style={{ fontFamily: 'monospace' }}>
                {shortenAddress(publicKey, 8)}
              </Text>

              {/* Network badge */}
              <View className="flex-row items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                <View className="w-1.5 h-1.5 rounded-full bg-ajo-green" />
                <Text className="text-white/80 text-[10px] font-bold uppercase tracking-widest">
                  Stellar Testnet
                </Text>
              </View>
            </View>

            {/* ── Stats grid (overlaps header) ── */}
            <View className="mx-4 -mt-6 flex-row flex-wrap gap-3">
              {STATS.map((s) => (
                <View
                  key={s.label}
                  className="bg-white rounded-2xl border border-ajo-border p-4 items-center shadow-sm"
                  style={{ minWidth: '47%', flex: 1 }}
                >
                  <Text className="text-xl font-extrabold text-ajo-dark mb-1">{s.value}</Text>
                  <Text className="text-[11px] text-ajo-muted text-center leading-4">{s.label}</Text>
                </View>
              ))}
            </View>

            {/* ── Settings card ── */}
            <View className="mx-4 mt-4 bg-white rounded-3xl border border-ajo-border overflow-hidden shadow-sm">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-ajo-muted px-5 pt-5 pb-3">
                Settings
              </Text>

              {/* Notifications toggle */}
              <View className="flex-row items-center justify-between px-5 py-4 border-t border-ajo-border/60">
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-xl bg-ajo-lime-soft items-center justify-center">
                    <Bell size={16} color="#D47253" />
                  </View>
                  <View>
                    <Text className="font-bold text-ajo-dark text-sm">Notifications</Text>
                    <Text className="text-xs text-ajo-muted mt-0.5">Payout & contribution alerts</Text>
                  </View>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#EBE8E1', true: '#D47253' }}
                  thumbColor="#fff"
                />
              </View>

              {/* Wallet row */}
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/wallet')}
                className="flex-row items-center justify-between px-5 py-4 border-t border-ajo-border/60"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-xl bg-ajo-surface items-center justify-center border border-ajo-border">
                    <Wallet size={16} color="#1E1D1B" />
                  </View>
                  <Text className="font-bold text-ajo-dark text-sm">Wallet</Text>
                </View>
                <Text className="text-ajo-muted text-xs">›</Text>
              </TouchableOpacity>

              {/* Sign out */}
              <TouchableOpacity
                onPress={disconnect}
                className="flex-row items-center gap-3 px-5 py-4 border-t border-ajo-border/60"
                activeOpacity={0.7}
              >
                <View className="w-9 h-9 rounded-xl bg-red-50 items-center justify-center">
                  <LogOut size={16} color="#EF4444" />
                </View>
                <Text className="font-bold text-red-500 text-sm">Sign out</Text>
              </TouchableOpacity>
            </View>

            {/* ── Coming soon notice ── */}
            <View className="mx-4 mt-4 bg-white rounded-2xl border border-ajo-border p-5 items-center gap-2 shadow-sm">
              <Text className="text-2xl">📊</Text>
              <Text className="text-sm font-bold text-ajo-dark">Full profile coming soon</Text>
              <Text className="text-xs text-ajo-muted text-center leading-5">
                Earnings history, reputation score, and full circle activity appear once
                connected to a deployed Testnet contract.
              </Text>
            </View>
          </>
        ) : (
          /* ── Not connected ── */
          <>
            {/* Mini dark header */}
            <View className="bg-ajo-dark items-center px-5 pt-8 pb-12">
              <View className="w-20 h-20 rounded-full bg-white/10 items-center justify-center mb-3">
                <Text className="text-4xl">👤</Text>
              </View>
              <Text className="text-white font-bold text-base">No wallet connected</Text>
              <Text className="text-white/50 text-xs mt-1 text-center">
                Connect from the Save tab to view your profile
              </Text>
            </View>

            <View className="mx-4 -mt-4 bg-white rounded-3xl border border-ajo-border p-6 items-center gap-3 shadow-sm">
              <Text className="text-sm text-ajo-muted text-center leading-5">
                Your circles, stats, and reputation will appear here once you connect your
                Stellar public key.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/dashboard')}
                className="bg-ajo-dark rounded-full px-6 py-2.5 mt-1"
              >
                <Text className="text-white font-bold text-sm">Connect Wallet</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
