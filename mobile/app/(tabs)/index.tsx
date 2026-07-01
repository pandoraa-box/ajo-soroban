import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';

const FEATURES = [
  { icon: '🤝', title: 'Everyone gets their turn',  body: 'The order is set at the start and never changes. When it\'s your turn, the full pot is yours — no chasing anyone.' },
  { icon: '⛓️', title: 'No trust needed',            body: 'A smart contract handles everything. Contributions are locked in. No one can skip or disappear with your money.' },
  { icon: '📈', title: 'You set the rules',          body: 'Choose how much to save, how often, and how big your group is. Done in under a minute.' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-ajo-dark" edges={['top']}>
      <ScrollView className="flex-1">
        {/* Hero */}
        <View className="bg-ajo-dark px-6 pt-10 pb-8 gap-5">
          <View className="flex-row items-center gap-2 self-start bg-ajo-lime/10 rounded-full px-3 py-1.5">
            <View className="w-1.5 h-1.5 rounded-full bg-ajo-lime" />
            <Text className="text-xs text-ajo-lime font-bold">Stellar Testnet</Text>
          </View>

          <Text className="text-4xl font-black text-white leading-tight tracking-tight">
            Save together,{'\n'}
            <Text className="text-ajo-lime">the African way.</Text>
          </Text>

          <Text className="text-base text-white/50 leading-relaxed">
            Start a savings circle with your people. Everyone puts in each round, and one person
            gets the full pot. Your turn always comes.
          </Text>

          {/* Balance preview card */}
          <View className="bg-ajo-lime rounded-3xl p-5 mt-2">
            <Text className="text-xs font-medium text-ajo-dark/50 mb-1">Total saved</Text>
            <Text className="text-3xl font-black text-ajo-dark">$4,820</Text>
            <View className="flex-row items-center gap-1.5 mt-3">
              <View className="w-1.5 h-1.5 rounded-full bg-ajo-dark/30" />
              <Text className="text-xs font-medium text-ajo-dark/50">3 active circles</Text>
            </View>
          </View>

          <View className="flex-row gap-3 flex-wrap mt-1">
            <Button variant="lime" onPress={() => router.push('/circles/create')}>
              Start a Circle
            </Button>
            <Button
              variant="secondary"
              className="border-white/20 bg-transparent"
              onPress={() => router.push('/(tabs)/circles')}
            >
              <Text className="text-sm font-bold text-white">Browse Circles</Text>
            </Button>
          </View>
        </View>

        {/* Stats strip */}
        <View className="flex-row bg-ajo-dark border-t border-white/10">
          {[
            { value: '$0 fees',  label: 'Platform fee'  },
            { value: 'USDC',     label: 'Savings token' },
            { value: 'Open',     label: 'Source code'   },
          ].map((s, i) => (
            <View key={s.label} className={`flex-1 items-center py-4 ${i < 2 ? 'border-r border-white/10' : ''}`}>
              <Text className="text-sm font-black text-white mb-0.5">{s.value}</Text>
              <Text className="text-xs text-white/40">{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Features */}
        <View className="bg-white px-5 pt-8 pb-10 gap-4">
          <Text className="text-2xl font-black text-ajo-dark tracking-tight mb-2">
            A savings club that{'\n'}runs itself.
          </Text>
          {FEATURES.map((f) => (
            <View key={f.title} className="bg-ajo-surface rounded-3xl p-5 gap-3">
              <Text className="text-3xl">{f.icon}</Text>
              <Text className="text-base font-black text-ajo-dark">{f.title}</Text>
              <Text className="text-sm text-ajo-muted leading-5">{f.body}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
