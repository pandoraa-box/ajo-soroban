import { View, Text } from 'react-native';
import { Radio, UserPlus, CheckCircle, Gift } from 'lucide-react-native';
import type { GroupStatus } from '@/types/ajo';

type BadgeVariant = GroupStatus | 'yourTurn';

interface BadgeConfig {
  bg: string;
  icon: React.ReactNode;
  text: string;
  label: string;
}

function makeConfig(status: BadgeVariant): BadgeConfig {
  switch (status) {
    case 'Active':
      return {
        bg: 'bg-ajo-lime-soft',
        icon: <Radio size={11} color="#D47253" fill="#D47253" />,
        text: 'text-ajo-lime',
        label: 'Saving now',
      };
    case 'Open':
      return {
        bg: 'bg-ajo-amber-light',
        icon: <UserPlus size={11} color="#F59E0B" />,
        text: 'text-ajo-amber',
        label: 'Open to join',
      };
    case 'Complete':
      return {
        bg: 'bg-ajo-surface',
        icon: <CheckCircle size={11} color="#73716D" />,
        text: 'text-ajo-muted',
        label: 'Finished',
      };
    case 'yourTurn':
      return {
        bg: 'bg-ajo-amber',
        icon: <Gift size={11} color="#fff" />,
        text: 'text-white',
        label: 'Your turn!',
      };
  }
}

export function StatusBadge({ status }: { status: BadgeVariant }) {
  const c = makeConfig(status);
  return (
    <View className={`flex-row items-center gap-1.5 rounded-full px-3 py-1.5 ${c.bg}`}>
      {c.icon}
      <Text className={`text-[11px] font-bold ${c.text}`}>{c.label}</Text>
    </View>
  );
}
