import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Plus, CheckCircle, Loader, UserPlus } from 'lucide-react-native';
import { CircleCard } from '@/components/circles/CircleCard';
import { fetchAllCircles } from '@/lib/contract';
import type { Circle, GroupStatus } from '@/types/ajo';

type Filter = GroupStatus | 'All';
const FILTERS: Filter[] = ['All', 'Open', 'Active', 'Complete'];

export default function CirclesScreen() {
  const router = useRouter();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('All');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchAllCircles().then((c) => {
      setCircles(c);
      setLoading(false);
    });
  }, []);

  const filtered = circles.filter((c) => {
    const matchesFilter = filter === 'All' || c.state.status === filter;
    const matchesSearch =
      searchText === '' || c.config.name.toLowerCase().includes(searchText.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const openCount = circles.filter((c) => c.state.status === 'Open').length;
  const activeCount = circles.filter((c) => c.state.status === 'Active').length;

  return (
    <SafeAreaView className="flex-1 bg-ajo-surface" edges={['top']}>
      {/* ── Header ── */}
      <View className="bg-ajo-surface px-5 pt-5 pb-3">
        <View className="flex-row items-center justify-between mb-5">
          <View>
            <Text className="text-[26px] font-bold text-ajo-dark tracking-tight">Circles</Text>
            <Text className="text-[10px] font-semibold uppercase tracking-widest text-ajo-muted mt-0.5">
              {circles.length} total · {openCount} open
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/circles')}
              className="flex-row items-center gap-1.5 border border-ajo-border bg-white rounded-xl px-4 py-2.5 shadow-sm"
            >
              <UserPlus size={14} color="#1E1D1B" strokeWidth={2} />
              <Text className="text-ajo-dark font-bold text-sm">Join</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/circles/create')}
              className="flex-row items-center gap-1.5 bg-ajo-lime rounded-xl px-4 py-2.5 shadow-sm"
            >
              <Plus size={14} color="#fff" strokeWidth={3} />
              <Text className="text-white font-bold text-sm">Create</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search bar */}
        <View className="flex-row items-center gap-2.5 bg-white border border-ajo-border rounded-2xl px-4 py-3 shadow-sm mb-3">
          <Search size={15} color="#73716D" />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search circles…"
            placeholderTextColor="#73716D"
            className="flex-1 text-sm text-ajo-dark font-medium"
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text className="text-ajo-muted text-xs font-bold">✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter pills */}
        <View className="flex-row gap-2">
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              className={`rounded-full border px-4 py-1.5 ${
                filter === f ? 'bg-ajo-dark border-ajo-dark' : 'bg-white border-ajo-border'
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  filter === f ? 'text-white' : 'text-ajo-muted'
                }`}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#D47253" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(c) => String(c.id)}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 32,
            paddingTop: 12,
            gap: 12,
          }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            filter === 'All' && !searchText && filtered.length > 0 ? (
              <View className="gap-5">
                {activeCount > 0 && (
                  <SectionHeader
                    icon={<Loader size={13} color="#D47253" />}
                    label="Active"
                    count={activeCount}
                  />
                )}
              </View>
            ) : null
          }
          renderItem={({ item, index }) => {
            const showOpenHeader =
              filter === 'All' &&
              !searchText &&
              item.state.status === 'Open' &&
              (index === 0 || circles[index - 1]?.state.status !== 'Open');
            const showCompleteHeader =
              filter === 'All' &&
              !searchText &&
              item.state.status === 'Complete' &&
              (index === 0 || circles[index - 1]?.state.status !== 'Complete');

            return (
              <View className="gap-3">
                {showOpenHeader && (
                  <SectionHeader
                    icon={<UserPlus size={13} color="#73716D" />}
                    label="Open to join"
                    count={openCount}
                  />
                )}
                {showCompleteHeader && (
                  <SectionHeader
                    icon={<CheckCircle size={13} color="#73716D" />}
                    label="Completed"
                    count={circles.filter((c) => c.state.status === 'Complete').length}
                  />
                )}
                <CircleCard circle={item} />
              </View>
            );
          }}
          ListEmptyComponent={
            <View className="items-center pt-14 gap-3">
              <View className="w-16 h-16 rounded-full bg-white border border-ajo-border items-center justify-center">
                <Text className="text-3xl">🌀</Text>
              </View>
              <Text className="text-base font-bold text-ajo-dark">No circles found</Text>
              <Text className="text-sm text-ajo-muted text-center px-8 leading-5">
                {searchText
                  ? `No results for "${searchText}"`
                  : 'Be the first to create one!'}
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/circles/create')}
                className="bg-ajo-dark rounded-full px-6 py-2.5 mt-2"
              >
                <Text className="text-white font-bold text-sm">+ Create Circle</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

function SectionHeader({
  icon,
  label,
  count,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <View className="flex-row items-center gap-2 px-1 pt-2">
      {icon}
      <Text className="text-[10px] font-bold uppercase tracking-widest text-ajo-dark">
        {label}
      </Text>
      <View className="flex-1 h-px bg-ajo-border mx-1" />
      <Text className="text-[10px] font-semibold text-ajo-muted">{count}</Text>
    </View>
  );
}
