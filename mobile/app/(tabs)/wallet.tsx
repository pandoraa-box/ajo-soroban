import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { Copy, ExternalLink, LogOut, Wifi } from 'lucide-react-native';
import { useWallet } from '@/context/WalletContext';

const TESTNET_FAUCET = 'https://laboratory.stellar.org/#account-creator?network=test';

export default function WalletScreen() {
  const { publicKey, isConnected, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (!publicKey) return;
    await Clipboard.setStringAsync(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-ajo-surface" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View className="px-5 pt-5 pb-6">
          <Text className="text-[26px] font-bold text-ajo-dark tracking-tight">Wallet</Text>
          <View className="flex-row items-center gap-1.5 mt-1">
            <View className="w-1.5 h-1.5 rounded-full bg-ajo-green" />
            <Text className="text-xs font-semibold text-ajo-muted">Stellar Testnet</Text>
          </View>
        </View>

        {isConnected && publicKey ? (
          <View className="px-5 gap-4">
            {/* ── Address card ── */}
            <View className="bg-ajo-dark rounded-3xl p-6 gap-5">
              <View>
                <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">
                  Wallet Address
                </Text>
                <Text
                  className="text-white/90 text-xs leading-6"
                  style={{ fontFamily: 'monospace' }}
                  numberOfLines={2}
                >
                  {publicKey}
                </Text>
              </View>

              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={copyAddress}
                  className="flex-row items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5 flex-1 justify-center"
                >
                  <Copy size={14} color="#fff" />
                  <Text className="text-white text-xs font-bold">
                    {copied ? 'Copied!' : 'Copy'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Balance placeholder ── */}
            <View className="bg-white border border-ajo-border rounded-3xl p-6 shadow-sm">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-ajo-muted mb-1">
                Testnet Balance
              </Text>
              <Text className="text-3xl font-bold text-ajo-dark tracking-tight mt-1">
                0 USDC
              </Text>
              <View className="flex-row items-center gap-1.5 mt-3">
                <View className="w-1.5 h-1.5 rounded-full bg-ajo-green" />
                <Text className="text-xs text-ajo-muted font-medium">Stellar Testnet</Text>
              </View>
            </View>

            {/* ── Actions ── */}
            <View className="gap-3 mt-2">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-ajo-muted px-1">
                Actions
              </Text>

              <TouchableOpacity
                onPress={() => Linking.openURL(TESTNET_FAUCET)}
                className="bg-white border border-ajo-border rounded-2xl px-5 py-4 flex-row items-center gap-3 shadow-sm"
                activeOpacity={0.8}
              >
                <View className="w-11 h-11 rounded-2xl bg-ajo-lime-soft items-center justify-center">
                  <ExternalLink size={17} color="#D47253" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-ajo-dark text-sm">Get Test Funds</Text>
                  <Text className="text-xs text-ajo-muted mt-0.5">
                    Stellar Testnet Faucet ↗
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={disconnect}
                className="bg-white border border-red-100 rounded-2xl px-5 py-4 flex-row items-center gap-3 shadow-sm"
                activeOpacity={0.8}
              >
                <View className="w-11 h-11 rounded-2xl bg-red-50 items-center justify-center">
                  <LogOut size={17} color="#EF4444" />
                </View>
                <Text className="font-bold text-red-500 text-sm">Disconnect Wallet</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* ── Not connected ── */
          <View className="flex-1 items-center px-8 pt-14 gap-5">
            <View className="w-20 h-20 rounded-full bg-ajo-dark items-center justify-center">
              <Wifi size={30} color="#D47253" />
            </View>
            <View className="items-center gap-2">
              <Text className="text-xl font-bold text-ajo-dark text-center tracking-tight">
                No wallet connected
              </Text>
              <Text className="text-sm text-ajo-muted text-center leading-5 max-w-xs">
                Go to the Save tab and enter your Stellar public key to connect your wallet.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
