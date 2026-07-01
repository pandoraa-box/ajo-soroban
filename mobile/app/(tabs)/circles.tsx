import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CircleCard } from '@/components/circles/CircleCard';
import { Button } from '@/components/ui/Button';
import { fetchAllCircles } from '@/lib/contract';
import type { Circle, GroupStatus } from '@/types/ajo';

type Filter = GroupStatus | 'All';
const FILTERS: Filter[] = ['All', 'Open', 'Active', 'Complete'];

export default function CirclesScreen() {
  const router = useRouter();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('All');

  useEffect(() => {
    fetchAllCircles().then((c) => { setCircles(c); setLoading(false); });
  }, []);

  const filtered = filter === 'All' ? circles : circles.filter((c) => c.state.status === filter);

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-start justify-between px-5 pt-5 pb-3">
        <View>
          <Text className="text-2xl font-extrabold text-ajo-dark tracking-tight">All Circles</Text>
          <Text className="text-xs text-ajo-muted mt-0.5">Browse open circles or track active rotations</Text>
        </View>
        <Button size="sm" onPress={() => router.push('/circles/create')}>
          + New
        </Button>
      </View>

      {/* Filter pills */}
      <View className="flex-row gap-2 px-5 pb-4">
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 ${filter === f ? 'bg-ajo-dark border-ajo-dark' : 'bg-white border-ajo-border'}`}
          >
            <Text className={`text-xs font-semibold ${filter === f ? 'text-white' : 'text-ajo-muted'}`}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#F97316" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(c) => String(c.id)}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 12 }}
          renderItem={({ item }) => <CircleCard circle={item} />}
          ListEmptyComponent={
            <View className="items-center pt-16 gap-2">
              <Text className="text-4xl">🌀</Text>
              <Text className="text-base font-bold text-ajo-dark">No circles found</Text>
              <Text className="text-sm text-ajo-muted">Create one to get started!</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
