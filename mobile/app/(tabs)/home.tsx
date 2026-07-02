import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';

const FEATURES = [
  { icon: '🤝', title: 'Everyone gets their turn',  body: 'The order is set at the start and never changes. When it\'s your turn, the full pot is yours — no chasing anyone.' },
  { icon: '⛓️', title: 'No trust needed',            body: 'A smart contract handles everything. Contributions are locked in. No one can skip or disappear with your money.' },
  { icon: '📈', title: 'You set the rules',          body: 'Choose how much to save, how often, and how big your group is. Done in under a minute.' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-ajo-surface" edges={['top']}>
      <ScrollView className="flex-1">
        {/* Hero */}
        <View className="bg-ajo-surface px-6 pt-10 pb-8 gap-5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Image source={require('../../assets/logo.png')} className="w-8 h-8 opacity-90 grayscale sepia-[.2]" resizeMode="contain" />
              <Text className="font-serif text-2xl font-bold text-ajo-dark">Ajo</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="flex-row items-center gap-2 bg-white border border-ajo-border rounded-lg px-3 py-1.5 shadow-sm">
                <View className="w-1.5 h-1.5 rounded-full bg-ajo-lime" />
                <Text className="text-[10px] text-ajo-dark font-bold uppercase tracking-widest">Testnet</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} className="w-9 h-9 rounded-full bg-white border border-ajo-border/60 items-center justify-center shadow-sm">
                <User size={16} color="#1E1D1B" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-[40px] font-bold text-ajo-dark leading-[1.1] tracking-tight">
            Your savings circle,{'\n'}
            <Text className="italic text-ajo-lime">on-chain.</Text>
          </Text>

          <Text className="text-base text-ajo-muted leading-relaxed">
            Ajo lets you save with friends — everyone puts in the same amount, one person gets the pot each round. No bank, perfectly fair.
          </Text>

          {/* Balance preview card */}
          <View className="bg-white rounded-3xl p-6 mt-2 border border-ajo-border shadow-sm">
            <Text className="text-[10px] font-bold uppercase tracking-widest text-ajo-muted mb-1">Total saved</Text>
            <Text className="text-3xl font-bold tracking-tight text-ajo-dark">$4,820</Text>
            <View className="flex-row items-center gap-1.5 mt-4">
              <View className="w-1.5 h-1.5 rounded-full bg-ajo-lime/30" />
              <Text className="text-xs font-semibold text-ajo-muted">3 active circles</Text>
            </View>
          </View>

          <View className="flex-row gap-3 flex-wrap mt-2">
            <Button variant="lime" onPress={() => router.push('/circles/create')} className="rounded-xl flex-1">
              Start a Circle
            </Button>
            <Button
              variant="secondary"
              className="border-ajo-border bg-white rounded-xl flex-1 shadow-sm"
              onPress={() => router.push('/(tabs)/circles')}
            >
              <Text className="text-sm font-bold text-ajo-dark">Browse Circles</Text>
            </Button>
          </View>
        </View>

        {/* Stats strip */}
        <View className="flex-row bg-white border-y border-ajo-border/60 py-2">
          {[
            { value: '$0',     label: 'in fees, forever'  },
            { value: 'USDC',   label: 'stable currency' },
            { value: 'Open',   label: 'source code'   },
          ].map((s, i) => (
            <View key={s.label} className={`flex-1 items-center py-4 ${i < 2 ? 'border-r border-ajo-border/60' : ''}`}>
              <Text className="text-2xl font-bold text-ajo-dark tracking-tight mb-1">{s.value}</Text>
              <Text className="text-[9px] uppercase tracking-widest font-semibold text-ajo-muted">{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Features */}
        <View className="bg-ajo-surface px-5 pt-12 pb-14 gap-6">
          <View className="items-center mb-2">
            <Text className="text-[10px] uppercase font-semibold tracking-widest text-ajo-lime mb-3">Why Ajo</Text>
            <Text className="text-3xl font-bold text-ajo-dark tracking-tight text-center">
              A savings club that{'\n'}runs itself.
            </Text>
          </View>
          {FEATURES.map((f) => (
            <View key={f.title} className="bg-white border border-ajo-border/60 rounded-3xl p-6 shadow-sm">
              <Text className="text-3xl mb-4">{f.icon}</Text>
              <Text className="text-lg font-bold text-ajo-dark mb-2">{f.title}</Text>
              <Text className="text-sm text-ajo-muted leading-relaxed">{f.body}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
