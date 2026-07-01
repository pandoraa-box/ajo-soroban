import { View, Text } from 'react-native';
import type { GroupStatus } from '@/types/ajo';

const CONFIG: Record<GroupStatus, { bg: string; dot: string; text: string }> = {
  Open:     { bg: 'bg-blue-50',        dot: 'bg-blue-500',  text: 'text-blue-700'  },
  Active:   { bg: 'bg-ajo-lime-soft',  dot: 'bg-ajo-lime',  text: 'text-ajo-dark'  },
  Complete: { bg: 'bg-ajo-surface',    dot: 'bg-ajo-border', text: 'text-ajo-muted' },
};

const LABEL: Record<GroupStatus, string> = {
  Open:     'Open to join',
  Active:   'Saving now',
  Complete: 'Finished',
};

export function StatusBadge({ status }: { status: GroupStatus }) {
  const c = CONFIG[status];
  return (
    <View className={`flex-row items-center gap-1 rounded-full px-3 py-1.5 ${c.bg}`}>
      <View className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      <Text className={`text-xs font-bold ${c.text}`}>{LABEL[status]}</Text>
    </View>
  );
}
